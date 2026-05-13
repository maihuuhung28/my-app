import type { GanttTask, SewingLine } from "../data/LineSchedule.data";
import {
  formatFullDate,
  getQvtDate,
  getScheduleStatus,
  STATUS_BADGE_CLASS,
  type ScheduleStatus,
} from "../utils/LineSchedule.utils";

interface LineScheduleDetailPanelProps {
  task: GanttTask;
  line: SewingLine;
  onClose: () => void;
}

function StatusBadge({ status }: { status: ScheduleStatus }) {
  return (
    <span className={`badge line-schedule__status ${STATUS_BADGE_CLASS[status]}`}>
      {status}
    </span>
  );
}

export function LineScheduleDetailPanel({
  task,
  line,
  onClose,
}: LineScheduleDetailPanelProps) {
  const scheduleStatus = getScheduleStatus(task);
  const qvtDate = getQvtDate(task);

  return (
    <aside className="line-schedule__detail">
      <div className="line-schedule__detail-head">
        <strong>{task.style}</strong>
        <button type="button" onClick={onClose}>
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
          <StatusBadge status={scheduleStatus} />
        </b>
        <span>Duty Qty</span>
        <b>{task.dutyQty.toLocaleString()}</b>
        <span>Target</span>
        <b>{task.target.toLocaleString()} pcs/day</b>
        <span>Production Days</span>
        <b>{task.productionDays}</b>
        <span>Inline</span>
        <b>{formatFullDate(task.inlineDate)}</b>
        <span>FinalOffLine</span>
        <b>{formatFullDate(task.finalOfflineDate)}</b>
        <span>QVT Date</span>
        <b>{formatFullDate(qvtDate)}</b>
        <span>CRD</span>
        <b>{formatFullDate(task.crd)}</b>
      </div>
    </aside>
  );
}
