import { ganttTasks, type GanttTask } from "../data/LineSchedule.data";
import type { Order } from "../data/order.data";
import type { ProductionPlan } from "../types/productionPlan.types";

const DAY_MS = 86_400_000;

const toDateOnly = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

const parseDate = (value: string | null | undefined) =>
  value ? toDateOnly(new Date(value)) : null;

export const toIsoDate = (date: Date) => date.toISOString().slice(0, 10);

export const addWorkingDays = (startDate: Date, days: number) => {
  const currentDate = toDateOnly(startDate);
  const direction = days >= 0 ? 1 : -1;
  let daysAdded = 0;

  while (Math.abs(daysAdded) < Math.abs(days)) {
    currentDate.setDate(currentDate.getDate() + direction);
    if (currentDate.getDay() !== 0) {
      daysAdded += direction;
    }
  }

  return currentDate;
};

export const calculateProductionDays = (plan: Pick<ProductionPlan, "dutyQty" | "target">) => {
  if (!plan.dutyQty || !plan.target || plan.target <= 0) return 0;
  return Math.ceil(plan.dutyQty / plan.target);
};

export const countWorkingDaysBetweenDates = (
  startDateValue: string | null | undefined,
  endDateValue: string | null | undefined
) => {
  const startDate = parseDate(startDateValue);
  const endDate = parseDate(endDateValue);

  if (!startDate || !endDate || startDate > endDate) return 0;

  const currentDate = new Date(startDate);
  let totalDays = 0;

  while (currentDate <= endDate) {
    if (currentDate.getDay() !== 0) {
      totalDays += 1;
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return totalDays;
};

export const calculateEstOfflineDate = (plan: ProductionPlan) => {
  const inlineDate = parseDate(plan.inlineDate);
  if (!inlineDate) return null;

  const conversionDays = plan.conversionTime === "Conv" ? 3 : 0;
  return addWorkingDays(
    inlineDate,
    calculateProductionDays(plan) + conversionDays
  );
};

export const calculateFinalOfflineDate = (plan: ProductionPlan) => {
  const actualOfflineDate = parseDate(plan.actualOfflineDate);
  return actualOfflineDate ?? calculateEstOfflineDate(plan);
};

export const calculateInlineDays = (plan: ProductionPlan) => {
  const finalOfflineDate = calculateFinalOfflineDate(plan);
  return countWorkingDaysBetweenDates(
    plan.inlineDate,
    finalOfflineDate ? toIsoDate(finalOfflineDate) : null
  );
};

export const getQvtDateForOrder = (order: Pick<Order, "firstCrd" | "qvtDate">) => {
  if (order.qvtDate) return order.qvtDate;

  const firstCrd = parseDate(order.firstCrd);
  if (!firstCrd) return order.firstCrd;

  return toIsoDate(addWorkingDays(firstCrd, -5));
};

const getTaskEndDate = (task: Pick<GanttTask, "actualOfflineDate" | "finalOfflineDate">) =>
  parseDate(task.actualOfflineDate || task.finalOfflineDate);

const getPlanEndDate = (plan: ProductionPlan) => calculateFinalOfflineDate(plan);

export const getNextInlineDateForLine = (
  lineId: string,
  plans: ProductionPlan[]
) => {
  const endDates = [
    ...ganttTasks
      .filter((task) => task.lineId === lineId)
      .map(getTaskEndDate)
      .filter((date): date is Date => Boolean(date)),
    ...plans
      .filter((plan) => plan.line === lineId)
      .map(getPlanEndDate)
      .filter((date): date is Date => Boolean(date)),
  ];

  if (endDates.length === 0) return null;

  const latestEndDate = new Date(
    Math.max(...endDates.map((date) => date.getTime()))
  );

  return toIsoDate(addWorkingDays(latestEndDate, 1));
};

export const planToGanttTask = (plan: ProductionPlan): GanttTask | null => {
  if (!plan.inlineDate) return null;

  const estOfflineDate = calculateEstOfflineDate(plan);
  const finalOfflineDate = calculateFinalOfflineDate(plan);
  if (!estOfflineDate || !finalOfflineDate) return null;

  return {
    id: plan.id,
    planId: plan.id,
    lineId: plan.line,
    title: `${plan.style} / ${plan.buy} / ${plan.category}`,
    style: plan.style,
    buy: plan.buy,
    category: plan.category,
    orderQty: plan.orderQty,
    dutyQty: plan.dutyQty,
    target: plan.target,
    productionDays: calculateProductionDays(plan),
    conversionTime: plan.conversionTime,
    inlineDate: plan.inlineDate,
    estOfflineDate: toIsoDate(estOfflineDate),
    actualOfflineDate: plan.actualOfflineDate || undefined,
    finalOfflineDate: toIsoDate(finalOfflineDate),
    crd: plan.crd,
    season: plan.season,
    planStatus: plan.status === "Confirmed" ? "Already plan" : "Plan Partial",
    isNewPlan: true,
    isOverdue: finalOfflineDate.getTime() > new Date(`${plan.crd}T00:00:00`).getTime() - 5 * DAY_MS,
  };
};

export const getOrderPlanStatus = (
  orderId: number,
  plans: ProductionPlan[]
) => {
  const orderPlans = plans.filter((plan) => plan.orderId === orderId);
  if (orderPlans.length === 0) return "Not yet plan";
  if (orderPlans.every((plan) => plan.status === "Confirmed")) {
    return "Already plan";
  }
  return "Plan Partial";
};
