import { useMemo, useState } from "react";
import {
  sewingLines,
  getTasksByLine,
  calcProgress,
  type GanttTask,
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

  onSelectTask?: (task: GanttTask) => void;
  onConfirmLines?: (lines: string[]) => void;   // ← Thêm để truyền danh sách line đã chọn
}

const DAY_MS = 86_400_000;
const TIMELINE_START = new Date("2026-05-01T00:00:00");
const TIMELINE_DAYS = 76;
const DAY_WIDTH = 30;
const LEFT_GRID_WIDTH = 250;
const ROW_HEIGHT = 40;

type ScheduleStatus = "On Time" | "Delay";

const STATUS_COLOR: Record<ScheduleStatus, string> = {
  "On Time": "#198754",
  "Delay": "#ff0000ff",
};

const STATUS_BADGE_CLASS: Record<ScheduleStatus, string> = {
  "On Time": "bg-success",
  "Delay": "bg-danger",
};

const scheduleStatusOptions: Array<ScheduleStatus | "All"> = ["All", "On Time", "Delay"];

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

const addDays = (date: Date, days: number) => new Date(date.getTime() + days * DAY_MS);

const getQvtDate = (task: GanttTask) => addDays(new Date(`${task.crd}T00:00:00`), -5);

const getScheduleStatus = (task: GanttTask): ScheduleStatus => {
  const finalOfflineDate = new Date(`${task.finalOfflineDate}T00:00:00`);
  const qvtDate = getQvtDate(task);
  return finalOfflineDate < qvtDate ? "On Time" : "Delay";
};

function FilterSelect({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void; }) {
  return (
    <label className="line-schedule__filter">
      <span>{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}

function Legend() {
  return (
    <div className="line-schedule__legend">
      <span><i style={{ background: STATUS_COLOR["On Time"] }} /> On time</span>
      <span><i style={{ background: STATUS_COLOR["Delay"] }} /> Delay</span>
    </div>
  );
}

function StatusBadge({ status }: { status: ScheduleStatus }) {
  return <span className={`badge line-schedule__status ${STATUS_BADGE_CLASS[status]}`}>{status}</span>;
}

function GanttBar({ task, selected, onSelect }: { task: GanttTask; selected: boolean; onSelect: (task: GanttTask) => void; }) {
  const left = Math.max(0, dayOffset(task.inlineDate)) * DAY_WIDTH;
  const width = Math.max(DAY_WIDTH, (Math.max(0, dayOffset(task.finalOfflineDate)) - Math.max(0, dayOffset(task.inlineDate)) + 1) * DAY_WIDTH);
  const scheduleStatus = getScheduleStatus(task);
  const isOnTime = scheduleStatus === "On Time";
  const barBorder = STATUS_COLOR[scheduleStatus];
  const barBg = isOnTime ? "#d1e7dd" : "#f8d7da";
  const textColor = isOnTime ? "#000000ff" : "#842029";
  const qvtDate = getQvtDate(task);

  return (
    <button type="button" className={`line-schedule__bar${selected ? " line-schedule__bar--selected" : ""}`}
      title={`${task.style} / ${task.buy} / ${task.category} | ${task.dutyQty.toLocaleString()} pcs | ${formatFullDate(task.inlineDate)} - ${formatFullDate(task.finalOfflineDate)} | ${scheduleStatus} | QVT: ${formatFullDate(qvtDate)}`}
      onClick={() => onSelect(task)}
      style={{ left, width: width - 4, borderColor: barBorder, background: barBg, color: textColor }}>
      <span className="line-schedule__bar-progress" style={{ width: `${calcProgress(task)}%`, background: `${barBorder}2f` }} />
      {task.conversionTime === "Conv" && <span className="line-schedule__conv" />}
      <span className="line-schedule__bar-label">{task.style} / {task.buy} / {task.category}</span>
    </button>
  );
}

function DetailPanel({ task, line, onClose }: { task: GanttTask; line: SewingLine; onClose: () => void; }) {
  const scheduleStatus = getScheduleStatus(task);
  const qvtDate = getQvtDate(task);
  return (
    <aside className="line-schedule__detail">
      <div className="line-schedule__detail-head">
        <strong>{task.style}</strong>
        <button type="button" onClick={onClose}>x</button>
      </div>
      <div className="line-schedule__detail-grid">
        <span>Line</span><b>{line.id}</b>
        <span>Line Type</span><b>{line.lineType}</b>
        <span>Category</span><b>{task.category}</b>
        <span>Status</span><b><StatusBadge status={scheduleStatus} /></b>
        <span>Duty Qty</span><b>{task.dutyQty.toLocaleString()}</b>
        <span>Target</span><b>{task.target.toLocaleString()} pcs/day</b>
        <span>Production Days</span><b>{task.productionDays}</b>
        <span>Inline</span><b>{(task.inlineDate)}</b>
        <span>Final Offline</span><b>{formatFullDate(task.finalOfflineDate)}</b>
        <span>QVT Date</span><b>{formatFullDate(qvtDate)}</b>
        <span>CRD</span><b>{formatFullDate(task.crd)}</b>
      </div>
    </aside>
  );
}

//Logic chọn chuyền (LINE)
export function LineSchedule({ selectedOrder = null, onConfirmLines }: LineScheduleProps) {
  const [selectedTask, setSelectedTask] = useState<GanttTask | null>(null);
  //Danh sách chuyền được tick để hiển thị chi tiết
  const [selectedLines, setSelectedLines] = useState<string[]>([]);
  const [filterSeason, setFilterSeason] = useState("All");
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [filterLine, setFilterLine] = useState("All");

  const days = useMemo(() => Array.from({ length: TIMELINE_DAYS }, (_, index) => addDays(TIMELINE_START, index)), []);
  const seasonOptions = useMemo(() => {
    const seasons = new Set<string>();
    sewingLines.forEach((line) => getTasksByLine(line.id).forEach((task) => seasons.add(task.season)));
    return ["All", ...Array.from(seasons).sort()];
  }, []);

  const filteredLines = useMemo(() => sewingLines.filter((line) => filterLine === "All" || line.id === filterLine), [filterLine]);

  const getVisibleTasks = (lineId: string) => getTasksByLine(lineId).filter((task) => {
    if (filterSeason !== "All" && task.season !== filterSeason) return false;
    if (filterStatus !== "All" && getScheduleStatus(task) !== filterStatus) return false;
    return true;
  });

  const selectedLine = selectedTask ? sewingLines.find((line) => line.id === selectedTask.lineId) : null;
  const lineIds = ["All", ...sewingLines.map((line) => line.id)];
  const timelineWidth = TIMELINE_DAYS * DAY_WIDTH;

  const handleCheckboxChange = (lineId: string) => {
    if (selectedLines.includes(lineId)) {
      setSelectedLines(selectedLines.filter(id => id !== lineId));
    } else {
      setSelectedLines([...selectedLines, lineId]);
    }
  };

  const handleConfirm = () => {
    onConfirmLines?.(selectedLines);
  };

  return (
    <section className="line-schedule planning-gantt">
      <div className="line-schedule__toolbar">
        <div className="line-schedule__title"><strong>Line Schedule</strong></div>
        <FilterSelect label="Season" value={filterSeason} options={seasonOptions} onChange={setFilterSeason} />
        <FilterSelect label="Status" value={filterStatus} options={scheduleStatusOptions} onChange={setFilterStatus} />
        <FilterSelect label="Line" value={filterLine} options={lineIds} onChange={setFilterLine} />
        <Legend />
      </div>

      {selectedOrder?.style && (
        <div className="line-schedule__selected-order">
          <b>Selected order:</b> {selectedOrder.style} / {selectedOrder.buy || "-"}
        </div>
      )}

      <div className="line-schedule__board">
        <div className="line-schedule__left" style={{ width: LEFT_GRID_WIDTH }}>
  <div className="line-schedule__left-head">
    <span>PRI LINE</span>
    <span>LINE</span>
    <span>LINE TYPE</span>
  </div>
  {filteredLines.map((line) => (
    <div 
      key={line.id} 
      className={`line-schedule__line-row ${selectedLines.includes(line.id) ? 'selected' : ''}`}
      style={{ height: ROW_HEIGHT, display: 'flex', alignItems: 'center' }}
    >

      <input
        type="checkbox"
        checked={selectedLines.includes(line.id)}
        onChange={() => handleCheckboxChange(line.id)}
        style={{ marginRight: '15px', marginLeft: '10px' }}
      />

      <span style={{ width: '40px' }}>{line.priLine}</span>
      <b style={{ width: '60px' }}>{line.id}</b>
      <span style={{ flex: 1 }}>{line.lineType}</span>
    </div>
  ))}
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

      <div className="mt-3 text-end">
        <button className="btn btn-success" onClick={handleConfirm} disabled={selectedLines.length === 0}>
        CHỌN ({selectedLines.length} Chuyền)
        </button>
      </div>

      {selectedTask && selectedLine && (
        <DetailPanel task={selectedTask} line={selectedLine} onClose={() => setSelectedTask(null)} />
      )}
    </section>
  );
}

export default LineSchedule;