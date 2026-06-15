import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { calcProgress, type GanttTask, type SewingLine } from "../data/LineSchedule.data";
import { addDays, DAY_WIDTH, dayOffset, formatFullDate,  formatShortDate, getQvtDate, getScheduleStatus,  ROW_HEIGHT,  STATUS_COLOR, TIMELINE_DAYS, TIMELINE_START } from "../utils/LineSchedule.utils";

/* CONFIG */
const VIEWPORT_HEIGHT = 400;   // Chiều cao viewport
const BUFFER = 2;              // Số row buffer

/*PROPS*/
interface LineScheduleGanttProps {
  lines: SewingLine[];
  getTasks: (lineId: string) => GanttTask[];
  selectedTask: GanttTask | null;
  selectedLineIds?: string[];
  recommendedLineIds?: string[];
  onSelectTask: (task: GanttTask) => void;
}

/* GANTT BAR - Component */
const GanttBar = memo(function GanttBar({
  task,
  selected,
  onSelect,
}: {
  task: GanttTask;
  selected: boolean;
  onSelect: (task: GanttTask) => void;
}) {
  const startOffset = Math.max(0, dayOffset(task.inlineDate));
  const endOffset = Math.max(0, dayOffset(task.finalOfflineDate));

  const left = startOffset * DAY_WIDTH;
  const width = Math.max(
    DAY_WIDTH,
    (endOffset - startOffset + 1) * DAY_WIDTH
  );

  const scheduleStatus = getScheduleStatus(task);
  const isOnTime = scheduleStatus === "On Time";

  const barBorder = STATUS_COLOR[scheduleStatus];
  const barBg = isOnTime ? "#dcfce7" : "#fee2e2";
  const textColor = isOnTime ? "#14532d" : "#991b1b";
  const qvtDate = getQvtDate(task);

  const barStyle = useMemo(
    () => ({
      left,
      width: width - 4,
      borderColor: barBorder,
      background: barBg,
      color: textColor,
    }),
    [left, width, barBorder, barBg, textColor]
  );

  return (
    <button
      type="button"
      className={`line-schedule__bar${
        selected ? " line-schedule__bar--selected" : ""
      }${task.isNewPlan ? " line-schedule__bar--new" : ""}${
        task.isOverdue ? " line-schedule__bar--overdue" : ""
      }`}
      title={`${task.style} / ${task.buy} / ${
        task.category
      } | ${task.dutyQty.toLocaleString()} pcs | ${formatFullDate(
        task.inlineDate
      )} - ${formatFullDate(task.finalOfflineDate)} | ${scheduleStatus} | QVT: ${formatFullDate(qvtDate)}`}
      onClick={() => onSelect(task)}
      style={barStyle}
    >
      <span
        className="line-schedule__bar-progress"
        style={{
          width: `${calcProgress(task)}%`,
          background: `${barBorder}2f`,
        }}
      />
      {task.conversionTime === "Conv" && (
        <span className="line-schedule__conv" />
      )}
      <span className="line-schedule__bar-label">
        {task.style} / {task.buy} / {task.category}
      </span>
    </button>
  );
});

/* MAIN COMPONENT */
export default function LineScheduleGantt({
  lines,
  getTasks,
  selectedTask,
  selectedLineIds = [],
  recommendedLineIds = [],
  onSelectTask,
}: LineScheduleGanttProps) {

  /* Timeline Gantt */
  const days = useMemo(
    () =>
      Array.from({ length: TIMELINE_DAYS }, (_, i) =>
        addDays(TIMELINE_START, i)
      ),
    []
  );

  const timelineWidth = TIMELINE_DAYS * DAY_WIDTH;

  const dayCells = useMemo(
    () =>
      days.map((day) => (
        <div
          key={day.toISOString()}
          className={day.getDay() === 0 ? "is-sunday" : undefined}
        >
          <span>{formatShortDate(day)}</span>
        </div>
      )),
    [days]
  );

  /* Virtual Scroll */
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  const visibleCount = Math.ceil(VIEWPORT_HEIGHT / ROW_HEIGHT);

  const totalHeight = lines.length * ROW_HEIGHT;

  const [range, setRange] = useState(() => ({
    start: 0,
    end: Math.min(lines.length, visibleCount + BUFFER * 2),
  }));

  const computeRange = useCallback(
    (scrollTop: number) => {
      const start = Math.floor(scrollTop / ROW_HEIGHT);
      const end = Math.min(
        lines.length,
        start + visibleCount + BUFFER * 2
      );
      return { start, end };
    },
    [lines.length, visibleCount]
  );

    const onScroll = useCallback(
      (e: React.UIEvent<HTMLDivElement>) => {
        const scrollTop = e.currentTarget.scrollTop;

        // Tránh requestAnimationFrame chồng chéo
        if (rafRef.current != null) return;

        rafRef.current = requestAnimationFrame(() => {
          const nextRange = computeRange(scrollTop);

          setRange((prev) =>
            prev.start === nextRange.start && prev.end === nextRange.end
              ? prev
              : nextRange
          );

          rafRef.current = null;
        });
      },
      [computeRange]
    );

  // Cleanup khi unmount
  useEffect(() => {
    return () => {
      if (rafRef.current != null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  /* render các dòng đang visible + buffer */
  const visibleLines = useMemo(
    () => lines.slice(range.start, range.end),
    [lines, range]
  );

  /* Memo hóa tasks theo lineId cho các dòng đang hiển thị */
  const tasksByLineId = useMemo(() => {
    const map = new Map<string, GanttTask[]>();
    for (const line of visibleLines) {
      map.set(line.id, getTasks(line.id));
    }
    return map;
  }, [visibleLines, getTasks]);

  const handleSelectTask = useCallback(
    (task: GanttTask) => onSelectTask(task),
    [onSelectTask]
  );

  /* UI */
  return (
    <div className="line-schedule__timeline">
      {/* Header ngày */}
      <div className="line-schedule__dates" style={{ width: timelineWidth }}>
        {dayCells}
      </div>

      {/* Khu vực scroll - Body chính */}
      <div
        ref={containerRef}
        className="line-schedule__rows"
        style={{
          width: timelineWidth,
          height: VIEWPORT_HEIGHT,
          overflow: "auto",
          position: "relative",
        }}
        onScroll={onScroll}
      >
        <div style={{ height: totalHeight, position: "relative" }}>
          {visibleLines.map((line, index) => {
            const top = (range.start + index) * ROW_HEIGHT;

            return (
              <div
                key={line.id}
                className={`line-schedule__timeline-row${
                  selectedLineIds.includes(line.id)
                    ? " line-schedule__timeline-row--selected"
                    : ""
                }${
                  recommendedLineIds.includes(line.id)
                    ? " line-schedule__timeline-row--recommended"
                    : ""
                }`}
                style={{
                  height: ROW_HEIGHT,
                  position: "absolute",
                  top,
                  width: "100%",
                }}
              >
                {tasksByLineId.get(line.id)?.map((task) => (
                  <GanttBar
                    key={task.id}
                    task={task}
                    selected={selectedTask?.id === task.id}
                    onSelect={handleSelectTask}
                  />
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}