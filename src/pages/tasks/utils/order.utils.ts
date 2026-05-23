import type { Order } from "../data/order.data";

const DATE_FORMATTER = new Intl.DateTimeFormat("sv-SE", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

export const ORDER_CATEGORY_OPTIONS = [
  "F5-TP",
  "F5-DUP",
  "F3-TP",
  "F3-DUP",
  "SU-TP",
  "SU-BTP",
] as const;

export const MATERIAL_STATUS_OPTIONS = [
  "Arrived OK",
  "Not yet Arrived",
  "Multiple batches",
  "Partial Arrive",
] as const;



export const LINE_TYPE_LABELS = {
  Manual: "Manual",
  Conveyor: "Manual + Conveyor",
} as const;

const parseDate = (value: string | null | undefined) =>
  value ? new Date(`${value}T00:00:00`) : null;

const toIsoDate = (date: Date) => DATE_FORMATTER.format(date);

export const addCalendarDays = (isoDate: string, days: number) => {
  const baseDate = parseDate(isoDate);
  if (!baseDate) return null;

  const result = new Date(baseDate);
  result.setDate(result.getDate() + days);
  return toIsoDate(result);
};

export const getEarliestLineStartDate = (
  order: Pick<Order, "eta" | "earliestStartDate">
) => {
  if (order.earliestStartDate) return order.earliestStartDate;
  return order.eta ? addCalendarDays(order.eta, 15) : null;
};

//Tính số SMV
export const getSewingLineType = (smv: number) =>
  smv >= 80 ? LINE_TYPE_LABELS.Conveyor : LINE_TYPE_LABELS.Manual;

export const calculateTarget = (
  smv: number,
  sewingLineType: string = LINE_TYPE_LABELS.Manual
) => {
  if (!smv || smv <= 0) return 0;

  //Tính Target tự động [(Số công nhân * 60 *8) / SMV * 0.8]
  const workers = sewingLineType.includes("Conveyor") ? 35 : 28;
  // const efficiency = 0.8;
  // const minutesPerDay = 60 * 8;

  return Math.round((workers * 60) / smv * 0.8);
};

//Hàm tính số lượng chưa may xong (BalQty)
export const calculateBalQty = (
  orderQty: number,
  completedQty: number
): number => Math.max(0, orderQty - completedQty);