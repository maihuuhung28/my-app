export type LineType = "MSL" | "CSL";

export type PlanStatus = "Already plan" | "Not yet plan" | "Plan Partial";

export interface GanttTask {
  id: number;
  parentId?: number;
  lineId: string;
  title: string;
  style: string;
  buy: string;
  category: "TP" | "DUP" | "BTP";
  orderQty: number;
  dutyQty: number;
  target: number;
  productionDays: number;
  conversionTime: "Conv" | "";
  inlineDate: string;
  estOfflineDate: string;
  actualOfflineDate?: string;
  finalOfflineDate: string;
  crd: string;
  season: string;
  planStatus: PlanStatus;
  isHighlighted?: boolean;
  isOverdue?: boolean;
}

export interface SewingLine {
  id: string;
  priLine: number;
  lineType: LineType;
  productType: string;
}

export const sewingLines: SewingLine[] = [
  { id: "EE01", priLine: 1, lineType: "MSL", productType: "JACKET (DOWN)" },
  { id: "EE02", priLine: 2, lineType: "CSL", productType: "JACKET (MIDWEIGHT)" },
  { id: "EE03", priLine: 3, lineType: "MSL", productType: "JACKET (FILLED HEAVYWEIGHT)" },
  { id: "EE04", priLine: 4, lineType: "MSL", productType: "JACKET (FILLED THIN)" },
  { id: "EE05", priLine: 5, lineType: "CSL", productType: "VEST (FILLED)" },
  { id: "C01", priLine: 6, lineType: "MSL", productType: "JACKET (DOWN)" },
  { id: "C02", priLine: 7, lineType: "MSL", productType: "JACKET" },
  { id: "C03", priLine: 8, lineType: "MSL", productType: "PANTS (1/1)" },
  { id: "E01", priLine: 9, lineType: "MSL", productType: "JACKET (FILLED HEAVYWEIGHT)" },
  { id: "E02", priLine:10, lineType: "MSL", productType: "JACKET (MIDWEIGHT)" },
];

export const ganttTasks: GanttTask[] = [
  //EE01
  {
    id: 101, lineId: "EE01",
    title: "F2606LHBM418M – AW26 / OSLO / TP",
    style: "F2606LHBM418M", buy: "OSLO", category: "TP",
    season: "AW26", orderQty: 5000, dutyQty: 3000, target: 350,
    productionDays: 9, conversionTime: "",
    inlineDate: "2026-05-12",
    estOfflineDate: "2026-05-23",
    finalOfflineDate:"2026-05-23",
    crd: "2026-05-28",
    planStatus: "Already plan",
  },
  {
    id: 102, lineId: "EE01",
    title: "F2606LHAF512M – AW26 / OSLO / TP",
    style: "F2606LHAF512M", buy: "OSLO", category: "TP",
    season: "AW26", orderQty: 4200, dutyQty: 4200, target: 340,
    productionDays: 13, conversionTime: "Conv",
    inlineDate: "2026-05-26",
    estOfflineDate: "2026-06-11",
    finalOfflineDate:"2026-06-11",
    crd: "2026-06-18",
    planStatus: "Already plan",
  },
  {
    id: 103, lineId: "EE01",
    title: "F2607GHTT600M – AW26 / PARIS / TP",
    style: "F2607GHTT600M", buy: "PARIS", category: "TP",
    season: "AW26", orderQty: 6800, dutyQty: 3400, target: 360,
    productionDays: 10, conversionTime: "",
    inlineDate: "2026-06-13",
    estOfflineDate: "2026-06-26",
    finalOfflineDate:"2026-06-26",
    crd: "2026-07-05",
    planStatus: "Already plan",
    isHighlighted: true,
  },
  //EE02
  {
    id: 201, lineId: "EE02",
    title: "F2606LHBJ522M – AW26 / OSLO / DUP",
    style: "F2606LHBJ522M", buy: "OSLO", category: "DUP",
    season: "AW26", orderQty: 3000, dutyQty: 1800, target: 290,
    productionDays: 7, conversionTime: "",
    inlineDate: "2026-05-08",
    estOfflineDate: "2026-05-16",
    finalOfflineDate:"2026-05-16",
    crd: "2026-05-20",
    planStatus: "Not yet plan",
  },
  //EE03
  {
    id: 301, lineId: "EE03",
    title: "S2606GHTT400M – AW26 / BERLIN / BTP",
    style: "S2606GHTT400M", buy: "BERLIN", category: "BTP",
    season: "AW26", orderQty: 7200, dutyQty: 7200, target: 400,
    productionDays: 18, conversionTime: "",
    inlineDate: "2026-05-06",
    estOfflineDate: "2026-05-30",
    finalOfflineDate:"2026-05-30",
    crd: "2026-06-10",
    planStatus: "Already plan",
  },
  //EE04
  {
    id: 401, lineId: "EE04",
    title: "F2607KXTT720M – AW26 / TOKYO / TP",
    style: "F2607KXTT720M", buy: "TOKYO", category: "TP",
    season: "AW26", orderQty: 4500, dutyQty: 4500, target: 320,
    productionDays: 15, conversionTime: "",
    inlineDate: "2026-06-10",
    estOfflineDate: "2026-07-01",
    finalOfflineDate:"2026-07-01",
    crd: "2026-07-15",
    planStatus: "Not yet plan",
  },
  //EE05
  {
    id: 501, lineId: "EE05",
    title: "F2606VSTF200M – AW26 / NYC / TP",
    style: "F2606VSTF200M", buy: "NYC", category: "TP",
    season: "AW26", orderQty: 3000, dutyQty: 1500, target: 280,
    productionDays: 6, conversionTime: "",
    inlineDate: "2026-05-14",
    estOfflineDate: "2026-05-22",
    finalOfflineDate:"2026-05-22",
    crd: "2026-06-01",
    planStatus: "Plan Partial",
  },
  //C01
  {
    id: 601, lineId: "C01",
    title: "F2606DWJK350M – AW26 / OSLO / TP",
    style: "F2606DWJK350M", buy: "OSLO", category: "TP",
    season: "AW26", orderQty: 4000, dutyQty: 4000, target: 330,
    productionDays: 13, conversionTime: "",
    inlineDate: "2026-05-05",
    estOfflineDate: "2026-05-22",
    finalOfflineDate:"2026-05-22",
    crd: "2026-05-30",
    planStatus: "Already plan",
  },
  //E01
  {
    id: 701, lineId: "E01",
    title: "F2606FHJK480M - AW26 / BERLIN / TP",
    style: "F2606FHJK480M", buy: "BERLIN", category: "TP",
    season: "AW26", orderQty: 5500, dutyQty: 2750, target: 360,
    productionDays: 8, conversionTime: "Conv",
    inlineDate: "2026-05-10",
    estOfflineDate: "2026-05-22",
    finalOfflineDate:"2026-05-22",
    crd: "2026-06-05",
    planStatus: "Already plan",
    isHighlighted: true,
  },
  {
    id: 702, lineId: "E01",
    title: "F2606FHJK480M – AW26 / BERLIN / DUP",
    style: "F2606FHJK480M", buy: "BERLIN", category: "DUP",
    season: "AW26", orderQty: 5000, dutyQty: 2750, target: 350,
    productionDays: 8, conversionTime: "",
    inlineDate: "2026-05-25",
    estOfflineDate: "2026-06-05",
    finalOfflineDate:"2026-06-05",
    crd: "2026-06-05",
    planStatus: "Already plan",
    isOverdue: true,
  },
];

export function getTasksByLine(lineId: string): GanttTask[] {
  return ganttTasks.filter(t => t.lineId === lineId);
}

export function calcProgress(task: GanttTask): number {
  const start = new Date(task.inlineDate).getTime();
  const end = new Date(task.finalOfflineDate).getTime();
  const today = Date.now();
  if (today < start) return 0;
  if (today > end) return 100;
  return Math.round(((today - start) / (end - start)) * 100);
}