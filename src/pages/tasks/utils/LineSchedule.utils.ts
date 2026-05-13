import type { GanttTask } from "../data/LineSchedule.data";

export const DAY_MS = 86_400_000;
export const TIMELINE_START = new Date("2026-05-01T00:00:00");

export type ScheduleStatus = "On Time" | "Delay";

export const addDays = (date: Date, days: number) =>
  new Date(date.getTime() + days * DAY_MS);

export const dayOffset = (iso: string) =>
  Math.round(
    (new Date(`${iso}T00:00:00`).getTime() - TIMELINE_START.getTime()) /
      DAY_MS
  );

export const formatShortDate = (iso: string | Date) => {
  const d = typeof iso === "string" ? new Date(iso) : iso;
  return `${String(d.getDate()).padStart(2, "0")}/${String(
    d.getMonth() + 1
  ).padStart(2, "0")}`;
};

export const formatFullDate = (iso: string | Date) => {
  const d = typeof iso === "string" ? new Date(iso) : iso;
  return `${formatShortDate(d)}/${d.getFullYear()}`;
};

export const getQvtDate = (task: GanttTask) =>
  addDays(new Date(`${task.crd}T00:00:00`), -5);

export const getScheduleStatus = (task: GanttTask): ScheduleStatus => {
  const finalOfflineDate = new Date(`${task.finalOfflineDate}T00:00:00`);
  const qvtDate = getQvtDate(task);
  return finalOfflineDate < qvtDate ? "On Time" : "Delay";
};