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

interface LineScheduleProps {
  selectedOrder?: SelectedOrderSummary | null;
  plans?: ProductionPlan[];
  onSelectTask?: (task: GanttTask) => void;
  onConfirmLines?: (lines: string[]) => void;
  onDeletePlan?: (planId: string) => void;
}

interface SelectionState {
  orderId?: number;
  lineIds: string[];
  task: GanttTask | null;
}

interface SuggestedLine extends SewingLine {
  isSuggested?: boolean;
  nextAvailableDate?: string | null;
}

const scheduleStatusOptions: Array<ScheduleStatus | "All"> = ["All", "On Time", "Delay"];

export function LineSchedule({
  selectedOrder = null,
  plans = [],
  onSelectTask,
  onConfirmLines,
  onDeletePlan,
}: LineScheduleProps) {
  const [selection, setSelection] = useState<SelectionState>({
    lineIds: [],
    task: null,
  });

  const [timePreferences, setTimePreferences] =
    useState<Record<string, LineTimePreference>>({});

  const [filterSeason, setFilterSeason] = useState("All");
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [filterLine, setFilterLine] = useState("All");

  const [openSubTables, setOpenSubTables] = useState(false);

  const selectedOrderId = selectedOrder?.id;
  const selectedLines = selection.orderId === selectedOrderId ? selection.lineIds : [];
  const selectedTask = selection.orderId === selectedOrderId ? selection.task : null;

  const planTasks = useMemo(
    () => plans.map(planToGanttTask).filter((task): task is GanttTask => Boolean(task)),
    [plans]
  );

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

  const minLineSuggestion = useMemo(() => {
    if (!priContext) return { recommendedLineIds: [], minLinesCount: 0 };
    return suggestMinLines(sewingLines, priContext);
  }, [priContext]);

  const seasonOptions = useMemo(() => {
    const seasons = new Set<string>();
    prioritizedLines.forEach((line) => {
      [...getTasksByLine(line.id), ...planTasks.filter((task) => task.lineId === line.id)]
        .forEach((task) => seasons.add(task.season));
    });
    return ["All", ...Array.from(seasons).sort()];
  }, [planTasks, prioritizedLines]);

  const lineOptions = useMemo(
    () => ["All", ...prioritizedLines.map((line) => line.id)],
    [prioritizedLines]
  );

  const filteredLines = useMemo(
    () => prioritizedLines.filter((line) => filterLine === "All" || line.id === filterLine),
    [filterLine, prioritizedLines]
  );

  const tasksByLineId = useMemo(() => {
    const map = new Map<string, GanttTask[]>();

    //Tasks sẵn có theo sewing lines
    for (const line of prioritizedLines) {
      map.set(line.id, getTasksByLine(line.id));
    }

    //Tasks từ plans
    for (const task of planTasks) {
      const existing = map.get(task.lineId) ?? [];
      map.set(task.lineId, [...existing, task]);
    }

    return map;
  }, [prioritizedLines, planTasks]);

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

  const selectedLine = selectedTask
    ? prioritizedLines.find((line) => line.id === selectedTask.lineId)
    : null;

      const selectedLineId = selectedLines[0] ?? null;


  // Keep task selection in sync with single-selected line
  const handleSelectTask = (task: GanttTask) => {

    setSelection((current) => ({
      orderId: selectedOrderId,
      lineIds: selectedLineId ? [selectedLineId] : [],
      task,
    }));
    onSelectTask?.(task);
  };

  // Multi-select for line scheduling
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
        // If multiple/none lines selected, task detail should be closed.
        task: isSelected ? current.task : null,
      };
    });
  };

  const handleTimePreferenceChange = (preference: LineTimePreference) => {
    setTimePreferences((current) => ({
      ...current,
      [preference.lineId]: preference,
    }));
  };

  const handleConfirm = () => {
    if (!selectedOrderId || selectedLines.length === 0) return;
    onConfirmLines?.(selectedLines);
  };


  const handleCloseTaskDetail = () => {
    setSelection((current) => ({ ...current, task: null }));
  };

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

        {/* Put Edit Detail beside Apply when at least 1 line is selected */}
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

      {/* Modal bản */}
      <SubTablesModal
        open={openSubTables}
        onClose={() => setOpenSubTables(false)}
        userRole="PPIC"
      />
    </section>
  );
}

export default LineSchedule;

