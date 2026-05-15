import type { SewingLine } from "../data/LineSchedule.data";
import { LEFT_GRID_WIDTH, ROW_HEIGHT } from "../utils/LineSchedule.utils";

interface LineScheduleLineListProps {
  lines: SewingLine[];
  selectedLines: string[];
  onToggleLine: (lineId: string) => void;
}

export function LineScheduleLineList({
  lines,
  selectedLines,
  onToggleLine,
}: LineScheduleLineListProps) {
  return (
    <div className="line-schedule__left" style={{ width: LEFT_GRID_WIDTH }}>
      <div className="line-schedule__left-head">
        <span>Pri Line</span>
        <span>Line</span>
        <span>Line Type</span>
      </div>

      {lines.map((line) => {
        const checked = selectedLines.includes(line.id);

        return (
          <div
            key={line.id}
            className={`line-schedule__line-row${
              checked ? " line-schedule__line-row--selected" : ""
            }`}
            style={{ height: ROW_HEIGHT }}
          >
            <label className="line-schedule__line-check">
              <input
                type="checkbox"
                checked={checked}
                onChange={() => onToggleLine(line.id)}
              />
              <span>{line.priLine}</span>
            </label>
            <b>{line.id}</b>
            <span>{line.lineType}</span>
          </div>
        );
      })}
    </div>
  );
}
