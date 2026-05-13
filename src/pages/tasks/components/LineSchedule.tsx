import { useCallback, useMemo, useState } from "react";
import {
  getTasksByLine,
  sewingLines,
  type GanttTask,
} from "../data/LineSchedule.data";
import {
  getScheduleStatus,
  type ScheduleStatus,
} from "../utils/LineSchedule.utils";
import LineScheduleGantt from "./LineScheduleGantt";
import { LineScheduleDetailPanel } from "./LineScheduleDetailPanel";
import { LineScheduleLineList } from "./LineScheduleLineList";
import { LineScheduleToolbar } from "./LineScheduleToolbar";

interface SelectedOrderSummary {
  style?: string;
  buy?: string;
  productType?: string;
  earliestStartDate?: string;
  qvtDate?: string;
  qtyOrder?: number;
  planStatus?: string;
}

interface LineScheduleProps {
  selectedOrder?: SelectedOrderSummary | null;
  onSelectTask?: (task: GanttTask) => void;
  onConfirmLines?: (lines: string[]) => void;
}

const scheduleStatusOptions: Array<ScheduleStatus | "All"> = [
  "All",
  "On Time",
  "Delay",
];

export function LineSchedule({
  selectedOrder = null,
  onSelectTask,
  onConfirmLines,
}: LineScheduleProps) {
  const [selectedTask, setSelectedTask] = useState<GanttTask | null>(null);
  const [selectedLines, setSelectedLines] = useState<string[]>([]);
  const [filterSeason, setFilterSeason] = useState("All");
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [filterLine, setFilterLine] = useState("All");

  const seasonOptions = useMemo(() => {
    const seasons = new Set<string>();
    sewingLines.forEach((line) => {
      getTasksByLine(line.id).forEach((task) => seasons.add(task.season));
    });

    return ["All", ...Array.from(seasons).sort()];
  }, []);

  const lineOptions = useMemo(
    () => ["All", ...sewingLines.map((line) => line.id)],
    []
  );

  const filteredLines = useMemo(
    () =>
      sewingLines.filter((line) => filterLine === "All" || line.id === filterLine),
    [filterLine]
  );

  const getVisibleTasks = useCallback(
    (lineId: string) =>
      getTasksByLine(lineId).filter((task) => {
        if (filterSeason !== "All" && task.season !== filterSeason) return false;
        if (filterStatus !== "All" && getScheduleStatus(task) !== filterStatus) {
          return false;
        }

        return true;
      }),
    [filterSeason, filterStatus]
  );

  const selectedLine = selectedTask
    ? sewingLines.find((line) => line.id === selectedTask.lineId)
    : null;

  const handleSelectTask = (task: GanttTask) => {
    setSelectedTask(task);
    onSelectTask?.(task);
  };

  const handleToggleLine = (lineId: string) => {
    setSelectedLines((currentLines) =>
      currentLines.includes(lineId)
        ? currentLines.filter((id) => id !== lineId)
        : [...currentLines, lineId]
    );
  };

  const handleConfirm = () => {
    onConfirmLines?.(selectedLines);
  };

  return (
    <section className="line-schedule planning-gantt">
      <LineScheduleToolbar
        seasonOptions={seasonOptions}
        statusOptions={scheduleStatusOptions}
        lineOptions={lineOptions}
        filterSeason={filterSeason}
        filterStatus={filterStatus}
        filterLine={filterLine}
        onSeasonChange={setFilterSeason}
        onStatusChange={setFilterStatus}
        onLineChange={setFilterLine}
      />

      {selectedOrder?.style && (
        <div className="line-schedule__selected-order">
          <b>Selected order:</b> {selectedOrder.style} / {selectedOrder.buy || "-"}
        </div>
      )}

      <div className="line-schedule__board">
        <LineScheduleLineList
          lines={filteredLines}
          selectedLines={selectedLines}
          onToggleLine={handleToggleLine}
        />
        <LineScheduleGantt
          lines={filteredLines}
          getTasks={getVisibleTasks}
          selectedTask={selectedTask}
          onSelectTask={handleSelectTask}
        />
      </div>

      <div className="mt-3 text-end">
        <button
          type="button"
          className="btn btn-success"
          onClick={handleConfirm}
          disabled={!selectedOrder || selectedLines.length === 0}
        >
          Chọn ({selectedLines.length} Chuyền)
        </button>
      </div>

      {selectedTask && selectedLine && (
        <LineScheduleDetailPanel
          task={selectedTask}
          line={selectedLine}
          onClose={() => setSelectedTask(null)}
        />
      )}
    </section>
  );
}

export default LineSchedule;
