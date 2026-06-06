import { useCallback, useMemo, useState } from "react";
import {
  getTasksByLine,
  sewingLines,
  type GanttTask,
  type SewingLine,
} from "../data/LineSchedule.data";
import type { ProductionPlan } from "../types/productionPlan.types";
import { getScheduleStatus, type ScheduleStatus } from "../utils/LineSchedule.utils";
import { planToGanttTask } from "../utils/productionPlan.utils";
import { calculatePRI, suggestMinLines, type PRIContext } from "../utils/priEngine";
import LineScheduleGantt from "./LineScheduleGantt";
import { LineScheduleDetailPanel } from "./LineScheduleDetailPanel";
import { LineScheduleLineList, type LineTimePreference } from "./LineScheduleLineList";
import { LineScheduleToolbar } from "./LineScheduleToolbar";
import PriMinLineLegend from "./PriMinLineLegend";
import { SubTablesModal } from "./SubTables/SubTablesModal/SubTablesModal";
import { compileSetter } from "devextreme/common/data";

// Thông tin tóm tắt của đơn hàng đang được chọn
// Dùng cho hiển thị và làm dữ liệu đầu vào cho việc lập kế hoạch
interface SelectedOrderSummary {
  id?: number;
  style?: string;
  buy?: string;
  productType?: string;
  earliestStartDate?: string;
  qvtDate?: string;
  qtyOrder?: number;
  target?: number;
  groupedBy?: string;
  firstCrd?: string;
  sewingLineType?: string;
}

// Props chính của màn hình Line Schedule
interface LineScheduleProps {
  selectedOrder?: SelectedOrderSummary | null;
  plans?: ProductionPlan[];
  onSelectTask?: (task: GanttTask) => void;
  onConfirmLines?: (lines: string[]) => void;
  onDeletePlan?: (planId: string) => void;
}

// Trạng thái selection hiện tại trên màn hình
// - orderId: đơn hàng đang thao tác
// - lineIds: danh sách chuyền được chọn
// - task: task đang được focus (nếu có)
interface SelectionState {
  orderId?: number;
  lineIds: string[];
  task: GanttTask | null;
}

// Sewing line sau khi được gán thêm thông tin gợi ý
interface SuggestedLine extends SewingLine {
  isSuggested?: boolean;
  nextAvailableDate?: string | null;
}

// Danh sách trạng thái dùng cho filter tiến độ kế hoạch
const scheduleStatusOptions: Array<ScheduleStatus | "All"> = ["All", "On Time", "Delay"];

export function LineSchedule({
  selectedOrder = null,
  plans = [],
  onSelectTask,
  onConfirmLines,
  onDeletePlan,
}: LineScheduleProps) {
  // State quản lý selection hiện tại (đơn hàng / chuyền / task)
  const [selection, setSelection] = useState<SelectionState>({
    lineIds: [],
    task: null,
  });

  // Lưu preference về thời gian mong muốn cho từng chuyền
  // Dùng làm đầu vào cho thuật toán PRI
  const [timePreferences, setTimePreferences] =
    useState<Record<string, LineTimePreference>>({});

  // State filter cho màn hình (season, trạng thái tiến độ, chuyền)
  const [filterSeason, setFilterSeason] = useState("All");
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [filterLine, setFilterLine] = useState("All");

  // Trạng thái mở / đóng modal chỉnh sửa chi tiết
  const [openSubTables, setOpenSubTables] = useState(false);

  // Đồng bộ selection theo đơn hàng hiện tại
  // Tránh trường hợp giữ selection của đơn hàng cũ
  const selectedOrderId = selectedOrder?.id;
  const selectedLines = selection.orderId === selectedOrderId ? selection.lineIds : [];
  const selectedTask = selection.orderId === selectedOrderId ? selection.task : null;

  // Chuyển Production Plan sang Gantt Task để hiển thị trên Gantt chart
  const planTasks = useMemo(
    () => plans.map(planToGanttTask).filter((task): task is GanttTask => Boolean(task)),
    [plans]
  );

  // Context đầu vào
  // Chỉ được tạo khi đã có đơn hàng được chọn
  const priContext = useMemo<PRIContext | null>(() => {
    if (!selectedOrder) return null;

    return {
      order: {
        earliestStartDate: selectedOrder.earliestStartDate,
        productType: selectedOrder.productType || "",
        groupedBy: selectedOrder.groupedBy,
        firstCrd: selectedOrder.firstCrd || selectedOrder.qvtDate || "",
        qvtDate: selectedOrder.qvtDate,
        qtyOrder: selectedOrder.qtyOrder || 0,
        sewingLineType: selectedOrder.sewingLineType,
        target: selectedOrder.target,
      },
      preferredDates: timePreferences,
      plans: plans.map((plan) => ({
        id: plan.id,
        line: plan.line,
        inlineDate: plan.inlineDate,
        crd: plan.crd,
        qvtDate: plan.qvtDate,
        actualOfflineDate: plan.actualOfflineDate,
        dutyQty: plan.dutyQty,
        target: plan.target,
        conversionTime: plan.conversionTime,
        finalOfflineDate: plan.finalOfflineDate,
      })),
    };
  }, [plans, selectedOrder, timePreferences]);

  // Danh sách chuyền đã được sắp xếp ưu tiên theo PRI
  const prioritizedLines = useMemo<SuggestedLine[]>(() => {
    if (!priContext) {
      return sewingLines.map((line, index) => ({
        ...line,
        priLine: index + 1,
        isSuggested: false,
        nextAvailableDate: null,
      }));
    }

    return calculatePRI(sewingLines, priContext).map((line) => ({
      ...line,
      nextAvailableDate: line.nextAvailableDate,
    }));
  }, [priContext]);

  // Gợi ý số lượng chuyền tối thiểu cần thiết cho đơn hàng
  const minLineSuggestion = useMemo(() => {
    if (!priContext) return { recommendedLineIds: [], minLinesCount: 0 };
    return suggestMinLines(sewingLines, priContext);
  }, [priContext]);

  // Tổng hợp danh sách season để dùng cho filter
  const seasonOptions = useMemo(() => {
    const seasons = new Set<string>();
    prioritizedLines.forEach((line) => {
      [...getTasksByLine(line.id), ...planTasks.filter((task) => task.lineId === line.id)]
        .forEach((task) => seasons.add(task.season));
    });
    return ["All", ...Array.from(seasons).sort()];
  }, [planTasks, prioritizedLines]);

  // Danh sách chuyền cho dropdown filter
  const lineOptions = useMemo(
    () => ["All", ...prioritizedLines.map((line) => line.id)],
    [prioritizedLines]
  );

  // Danh sách chuyền sau khi áp dụng filter
  const filteredLines = useMemo(
    () => prioritizedLines.filter((line) => filterLine === "All" || line.id === filterLine),
    [filterLine, prioritizedLines]
  );

  // Gom toàn bộ task theo từng chuyền để phục vụ hiển thị Gantt
  const tasksByLineId = useMemo(() => {
    const map = new Map<string, GanttTask[]>();

    // Task mặc định theo từng sewing line
    for (const line of prioritizedLines) {
      map.set(line.id, getTasksByLine(line.id));
    }

    // Task phát sinh từ các production plan
    for (const task of planTasks) {
      const existing = map.get(task.lineId) ?? [];
      map.set(task.lineId, [...existing, task]);
    }

    return map;
  }, [prioritizedLines, planTasks]);

  // Lấy danh sách task hiển thị theo filter season và trạng thái tiến độ
  const getVisibleTasks = useCallback(
    (lineId: string) => {
      const tasks = tasksByLineId.get(lineId) ?? [];

      if (filterSeason === "All" && filterStatus === "All") return tasks;

      return tasks.filter((task) => {
        if (filterSeason !== "All" && task.season !== filterSeason) return false;
        if (filterStatus !== "All" && getScheduleStatus(task) !== filterStatus) return false;
        return true;
      });
    },
    [tasksByLineId, filterSeason, filterStatus]
  );

  // Chuyền tương ứng với task đang được chọn
  const selectedLine = selectedTask
    ? prioritizedLines.find((line) => line.id === selectedTask.lineId)
    : null;

  const selectedLineId = selectedLines[0] ?? null;

  // Khi chọn task:
  // - Ép trạng thái selection về single-line
  // - Loại bỏ các line đã chọn trước đó
  // - Tránh trạng thái dữ liệu và UI không nhất quán
  const handleSelectTask = (task: GanttTask) => {
    setSelection({
      orderId: selectedOrderId,
      lineIds: selectedLineId ? [selectedLineId] : [],
      task,
    });

    // Thông báo ra ngoài để các component khác (detail, highlight, ...) xử lý tiếp
    onSelectTask?.(task);
  };

  // Cho phép chọn nhiều chuyền để lên kế hoạch
  // Khi multi-select hoặc bỏ chọn chuyền, task detail sẽ bị đóng
  const handleToggleLine = (lineId: string) => {
    if (!selectedOrderId) return;

    setSelection((current) => {
      const currentLineIds = current.orderId === selectedOrderId ? current.lineIds : [];
      const isSelected = currentLineIds.includes(lineId);

      return {
        orderId: selectedOrderId,
        lineIds: isSelected
          ? currentLineIds.filter((id) => id !== lineId)
          : [...currentLineIds, lineId],
        // Khi không còn chọn duy nhất 1 line, task detail không còn hợp lệ
        task: isSelected ? current.task : null,
      };
    });
  };

  // Cập nhật preference về thời gian cho từng chuyền
  const handleTimePreferenceChange = (preference: LineTimePreference) => {
    setTimePreferences((current) => ({
      ...current,
      [preference.lineId]: preference,
    }));
  };

  // Xác nhận áp dụng các chuyền đã chọn cho đơn hàng
  const handleConfirm = () => {
    if (!selectedOrderId || selectedLines.length === 0) return;
    onConfirmLines?.(selectedLines);
  };

  // Đóng panel chi tiết task
  const handleCloseTaskDetail = () => {
    setSelection((current) => ({ ...current, task: null }));
  };

  // Xóa plan tương ứng với task đang được chọn
  const handleDeleteSelectedTask = () => {
    if (!selectedTask?.planId) return;
    onDeletePlan?.(selectedTask.planId);
    handleCloseTaskDetail();
  };

  return (
    <section className="line-schedule planning-gantt">
      {selectedOrder?.style && (
        <div className="line-schedule__selected-order">
          Đã chọn mã hàng<span>{selectedOrder.style}</span>Vui lòng chọn chuyền bên dưới để lên kế hoạch
        </div>
      )}

      <LineScheduleToolbar
        seasonOptions={seasonOptions}
        statusOptions={scheduleStatusOptions}
        lineOptions={lineOptions}
        filterSeason={filterSeason}
        filterStatus={filterStatus}
        filterLine={filterLine}
        selectedLineCount={selectedLines.length}
        recommendedLineCount={minLineSuggestion.minLinesCount}
        onSeasonChange={setFilterSeason}
        onStatusChange={setFilterStatus}
        onLineChange={setFilterLine}
      />

      {selectedOrder && (
        <PriMinLineLegend minRecommendedLineIds={minLineSuggestion.recommendedLineIds} />
      )}

      <div className="line-schedule__board">
        <LineScheduleLineList
          lines={filteredLines.map((line) => ({
            ...line,
            isSuggested:
              Boolean(line.isSuggested) ||
              minLineSuggestion.recommendedLineIds.includes(line.id),
          }))}
          selectedLines={selectedLines}
          onToggleLine={handleToggleLine}
          onTimePreferenceChange={handleTimePreferenceChange}
          timePreferences={timePreferences}
        />

        <div className="line-schedule__gantt-wrap">
          <LineScheduleGantt
            lines={filteredLines}
            getTasks={getVisibleTasks}
            selectedTask={selectedTask}
            selectedLineIds={selectedLines}
            recommendedLineIds={minLineSuggestion.recommendedLineIds}
            onSelectTask={handleSelectTask}
          />
        </div>
      </div>

      <div className="line-schedule__action-bar">
        <div>
          <strong>{selectedLines.length}</strong> Line Selected
          {minLineSuggestion.minLinesCount > 0 && (
            <span> Minimum suggested: {minLineSuggestion.minLinesCount}</span>
          )}
        </div>

        {/* Chỉ hiển thị nút Edit Detail khi đã chọn ít nhất 1 chuyền */}
        {selectedLines.length > 0 && (
          <button
            type="button"
            className="btn btn-outline-secondary btn-sm"
            onClick={() => setOpenSubTables(true)}
          >
            Edit Detail
          </button>
        )}

        <button
          type="button"
          className="btn btn-success"
          onClick={handleConfirm}
          disabled={!selectedOrderId || selectedLines.length === 0}
        >
          Apply
        </button>
      </div>

      {selectedTask && selectedLine && (
        <LineScheduleDetailPanel
          task={selectedTask}
          line={selectedLine}
          onClose={handleCloseTaskDetail}
          onDelete={selectedTask.planId ? handleDeleteSelectedTask : undefined}
        />
      )}

      {/* Modal chỉnh sửa chi tiết bảng phụ */}
      <SubTablesModal
        open={openSubTables}
        onClose={() => setOpenSubTables(false)}
        userRole="PPIC"
      />
    </section>
  );
}

export default LineSchedule;