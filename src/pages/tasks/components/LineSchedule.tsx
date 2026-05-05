import { useMemo, useState } from "react";
import {
  sewingLines,
  getTasksByLine,
  calcProgress,
  type GanttTask,
  type PlanStatus,
  type SewingLine,
} from "../data/LineSchedule.data";

interface LineScheduleProps {
  selectedOrder?: {
    style?: string;
    buy?: string;
    productType?: string;
    earliestStartDate?: string;
    qvtDate?: string;
    qtyOrder?: number;
    planStatus?: string;
  } | null;
}

const DAY_MS = 86_400_000;
const TIMELINE_START = new Date("2026-05-01T00:00:00");
const TIMELINE_DAYS = 76;
const DAY_WIDTH = 30;
const LEFT_GRID_WIDTH = 520;
const ROW_HEIGHT = 42;

const STATUS_COLOR: Record<PlanStatus, string> = {
  "Already plan": "#22c55e",
  "Not yet plan": "#94a3b8",
  "Plan Partial": "#f97316",
};

const CATEGORY_COLOR = {
  TP: { bg: "#dbeafe", border: "#2563eb", text: "#1e3a8a" },
  DUP: { bg: "#fef3c7", border: "#d97706", text: "#78350f" },
  BTP: { bg: "#ede9fe", border: "#7c3aed", text: "#4c1d95" },
} as const;

const formatShortDate = (iso: string | Date) => {
  const d = typeof iso === "string" ? new Date(iso) : iso;
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}`;
};

const formatFullDate = (iso: string | Date) => {
  const d = typeof iso === "string" ? new Date(iso) : iso;
  return `${formatShortDate(d)}/${d.getFullYear()}`;
};

const dayOffset = (iso: string) =>
  Math.round((new Date(`${iso}T00:00:00`).getTime() - TIMELINE_START.getTime()) / DAY_MS);

const addDays = (date: Date, days: number) =>
  new Date(date.getTime() + days * DAY_MS);

const latestOfflineDate = (tasks: GanttTask[]) => {
  if (!tasks.length) return null;

  return tasks
    .map((task) => new Date(`${task.finalOfflineDate}T00:00:00`).getTime())
    .sort((a, b) => b - a)[0];
};

const planStatusOptions: Array<PlanStatus | "All"> = [
  "All",
  "Already plan",
  "Not yet plan",
  "Plan Partial",
];

function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="line-schedule__filter">
      <span>{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function Legend() {
  return (
    <div className="line-schedule__legend">
      <span>
        <i style={{ background: CATEGORY_COLOR.TP.border }} />
        TP
      </span>
      <span>
        <i style={{ background: CATEGORY_COLOR.DUP.border }} />
        DUP
      </span>
      <span>
        <i style={{ background: CATEGORY_COLOR.BTP.border }} />
        BTP
      </span>
      <span>
        <i style={{ background: "#f59e0b" }} />
        Suggested
      </span>
      <span>
        <i style={{ background: "#ef4444" }} />
        Over QVT
      </span>
    </div>
  );
}

function StatusBadge({ status }: { status: PlanStatus }) {
  return (
    <span
      className="line-schedule__status"
      style={{
        color: STATUS_COLOR[status],
        borderColor: `${STATUS_COLOR[status]}55`,
        background: `${STATUS_COLOR[status]}18`,
      }}
    >
      {status}
    </span>
  );
}

function GanttBar({
  task,
  selected,
  recommended,
  onSelect,
}: {
  task: GanttTask;
  selected: boolean;
  recommended: boolean;
  onSelect: (task: GanttTask) => void;
}) {
  const left = Math.max(0, dayOffset(task.inlineDate)) * DAY_WIDTH;
  const width = Math.max(
    DAY_WIDTH,
    (Math.max(0, dayOffset(task.finalOfflineDate)) - Math.max(0, dayOffset(task.inlineDate)) + 1) *
      DAY_WIDTH
  );
  const category = CATEGORY_COLOR[task.category];
  const isOverdue = task.isOverdue || new Date(task.finalOfflineDate) > new Date(task.crd);
  const barBorder = isOverdue ? "#ef4444" : recommended || task.isHighlighted ? "#f59e0b" : category.border;
  const barBg = isOverdue ? "#fee2e2" : recommended || task.isHighlighted ? "#fef3c7" : category.bg;
  const textColor = isOverdue ? "#991b1b" : recommended || task.isHighlighted ? "#92400e" : category.text;

  return (
    <button
      type="button"
      className={`line-schedule__bar${selected ? " line-schedule__bar--selected" : ""}`}
      title={`${task.style} / ${task.buy} / ${task.category} | ${task.dutyQty.toLocaleString()} pcs | ${formatFullDate(
        task.inlineDate
      )} - ${formatFullDate(task.finalOfflineDate)}`}
      onClick={() => onSelect(task)}
      style={{
        left,
        width: width - 4,
        borderColor: barBorder,
        background: barBg,
        color: textColor,
        boxShadow: selected ? `0 0 0 3px ${barBorder}44` : undefined,
      }}
    >
      <span
        className="line-schedule__bar-progress"
        style={{ width: `${calcProgress(task)}%`, background: `${barBorder}2f` }}
      />
      {task.conversionTime === "Conv" && <span className="line-schedule__conv" />}
      <span className="line-schedule__bar-label">
        {task.style} / {task.buy} / {task.category}
      </span>
    </button>
  );
}

function DetailPanel({
  task,
  line,
  onClose,
}: {
  task: GanttTask;
  line: SewingLine;
  onClose: () => void;
}) {
  return (
    <aside className="line-schedule__detail">
      <div className="line-schedule__detail-head">
        <strong>{task.style}</strong>
        <button type="button" onClick={onClose} aria-label="Close detail">
          x
        </button>
      </div>
      <div className="line-schedule__detail-grid">
        <span>Line</span>
        <b>{line.id}</b>
        <span>Line Type</span>
        <b>{line.lineType}</b>
        <span>Category</span>
        <b>{task.category}</b>
        <span>Status</span>
        <b>
          <StatusBadge status={task.planStatus} />
        </b>
        <span>Duty Qty</span>
        <b>{task.dutyQty.toLocaleString()}</b>
        <span>Target</span>
        <b>{task.target.toLocaleString()} pcs/day</b>
        <span>Production Days</span>
        <b>{task.productionDays}</b>
        <span>Inline</span>
        <b>{formatFullDate(task.inlineDate)}</b>
        <span>Final Offline</span>
        <b>{formatFullDate(task.finalOfflineDate)}</b>
        <span>CRD/QVT</span>
        <b>{formatFullDate(task.crd)}</b>
      </div>
    </aside>
  );
}

export function LineSchedule({ selectedOrder = null }: LineScheduleProps) {
  const [selectedTask, setSelectedTask] = useState<GanttTask | null>(null);
  const [filterSeason, setFilterSeason] = useState("All");
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [filterLine, setFilterLine] = useState("All");

  const days = useMemo(
    () => Array.from({ length: TIMELINE_DAYS }, (_, index) => addDays(TIMELINE_START, index)),
    []
  );

  const seasonOptions = useMemo(() => {
    const seasons = new Set<string>();
    sewingLines.forEach((line) => getTasksByLine(line.id).forEach((task) => seasons.add(task.season)));
    return ["All", ...Array.from(seasons).sort()];
  }, []);

  const filteredLines = useMemo(
    () => sewingLines.filter((line) => filterLine === "All" || line.id === filterLine),
    [filterLine]
  );

  const taskMatchesSelectedOrder = (task: GanttTask) => {
    if (!selectedOrder?.style) return false;
    return task.style === selectedOrder.style || task.buy === selectedOrder.buy;
  };

  const getVisibleTasks = (lineId: string) =>
    getTasksByLine(lineId).filter((task) => {
      if (filterSeason !== "All" && task.season !== filterSeason) return false;
      if (filterStatus !== "All" && task.planStatus !== filterStatus) return false;
      return true;
    });

  const selectedLine = selectedTask ? sewingLines.find((line) => line.id === selectedTask.lineId) : null;
  const lineIds = ["All", ...sewingLines.map((line) => line.id)];
  const timelineWidth = TIMELINE_DAYS * DAY_WIDTH;

  return (
    <section className="line-schedule planning-gantt">
      <div className="line-schedule__toolbar">
        <div className="line-schedule__title">
          <strong>LINE SCHEDULE</strong>
          <span>Gantt-Chart</span>
        </div>
        <FilterSelect label="Season" value={filterSeason} options={seasonOptions} onChange={setFilterSeason} />
        <FilterSelect
          label="Status"
          value={filterStatus}
          options={planStatusOptions}
          onChange={setFilterStatus}
        />
        <FilterSelect label="Line" value={filterLine} options={lineIds} onChange={setFilterLine} />
        <Legend />
      </div>

      {selectedOrder?.style && (
        <div className="line-schedule__selected-order">
          <b>Selected order:</b> {selectedOrder.style} / {selectedOrder.buy || "-"}
          {selectedOrder.productType && <span>{selectedOrder.productType}</span>}
          {selectedOrder.earliestStartDate && <span>Earliest: {formatFullDate(selectedOrder.earliestStartDate)}</span>}
          {selectedOrder.qvtDate && <span>QVT: {formatFullDate(selectedOrder.qvtDate)}</span>}
        </div>
      )}

      <div className="line-schedule__board">
        <div className="line-schedule__left" style={{ width: LEFT_GRID_WIDTH }}>
          <div className="line-schedule__left-head">
            <span>PRI Line</span>
            <span>Line</span>
            <span>Line Type</span>
            <span>Product Type</span>
            <span>Avg Eff</span>
            <span>Free From</span>
          </div>
          {filteredLines.map((line) => {
            const tasks = getVisibleTasks(line.id);
            const freeFrom = latestOfflineDate(tasks);
            return (
              <button
                type="button"
                key={line.id}
                className="line-schedule__line-row"
                style={{ height: ROW_HEIGHT }}
                onClick={() => setFilterLine(line.id)}
              >
                <span>{line.priLine}</span>
                <b>{line.id}</b>
                <span>{line.lineType}</span>
                <span title={line.productType}>{line.productType}</span>
                <span>{Math.round(line.avgEff * 100)}%</span>
                <span>{freeFrom ? formatShortDate(new Date(freeFrom)) : "-"}</span>
              </button>
            );
          })}
        </div>

        <div className="line-schedule__timeline">
          <div className="line-schedule__dates" style={{ width: timelineWidth }}>
            {days.map((day) => (
              <div key={day.toISOString()} className={day.getDay() === 0 ? "is-sunday" : undefined}>
                <span>{formatShortDate(day)}</span>
              </div>
            ))}
          </div>
          <div className="line-schedule__rows" style={{ width: timelineWidth }}>
            {filteredLines.map((line) => {
              const tasks = getVisibleTasks(line.id);
              return (
                <div key={line.id} className="line-schedule__timeline-row" style={{ height: ROW_HEIGHT }}>
                  <div className="line-schedule__grid-days">
                    {days.map((day) => (
                      <span key={day.toISOString()} className={day.getDay() === 0 ? "is-sunday" : undefined} />
                    ))}
                  </div>
                  {tasks.map((task) => (
                    <GanttBar
                      key={task.id}
                      task={task}
                      recommended={taskMatchesSelectedOrder(task)}
                      selected={selectedTask?.id === task.id}
                      onSelect={setSelectedTask}
                    />
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {selectedTask && selectedLine && <DetailPanel task={selectedTask} line={selectedLine} onClose={() => setSelectedTask(null)} />}
    </section>
  );
}

export default LineSchedule;