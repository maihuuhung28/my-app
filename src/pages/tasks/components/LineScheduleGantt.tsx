// components/LineScheduleGantt.tsx
import React, { useMemo } from "react";
import type { GanttTask, SewingLine } from "../data/LineSchedule.data";
import {
  addDays,
  dayOffset,
  formatShortDate,
} from "../utils/LineSchedule.utils";

const TIMELINE_DAYS = 76;
const DAY_WIDTH = 30;
const ROW_HEIGHT = 40;
const TIMELINE_START = new Date("2026-05-01T00:00:00");

interface LineScheduleGanttProps {
  lines: SewingLine[];
  getTasks: (lineId: string) => GanttTask[];
  selectedTask: GanttTask | null;
  onSelectTask: (task: GanttTask) => void;
}

export default function LineScheduleGantt({
  lines,
  getTasks,
  selectedTask,
  onSelectTask,
}: LineScheduleGanttProps) {
  const days = useMemo(
    () => Array.from({ length: TIMELINE_DAYS }, (_, i) => addDays(TIMELINE_START, i)),
    []
  );

  const timelineWidth = TIMELINE_DAYS * DAY_WIDTH;

  return (
    <div className="line-schedule__timeline">
      <div className="line-schedule__dates" style={{ width: timelineWidth }}>
        {days.map((day) => (
          <div
            key={day.toISOString()}
            className={day.getDay() === 0 ? "is-sunday" : undefined}
          >
            <span>{formatShortDate(day)}</span>
          </div>
        ))}
      </div>

      {/* ROWS */}
      <div className="line-schdule__rows" style={{ width: timelineWidth }}>
        {lines.map((line) => {
          const tasks = getTasks(line.id);

          return (
            <div
              key={line.id}
              className="line-schedule__timeline-row"
              style={{ height: ROW_HEIGHT }}
            >
              {/* GRID */}
              <div className="line-schedule__grid-days">
                {days.map((day) => (
                  <span
                    key={day.toISOString()}
                    className={day.getDay() === 0 ? "is-sunday" : undefined}
                  />
                ))}
              </div>

              {/* BARS */}
              {tasks.map((task) => {
                const left = Math.max(0, dayOffset(task.inlineDate)) * DAY_WIDTH;
                const width =
                  (dayOffset(task.finalOfflineDate) -
                    dayOffset(task.inlineDate) +
                    1) *
                  DAY_WIDTH;

                return (
                  <button
                    key={task.id}
                    className={`line-schedule__bar ${
                      selectedTask?.id === task.id ? "selected" : ""
                    }`}
                    style={{ left, width }}
                    onClick={() => onSelectTask(task)}
                  >
                    {task.style}
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}