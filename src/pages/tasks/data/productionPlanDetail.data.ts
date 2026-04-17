// src/data/productionPlanDetail.data.ts
export interface ProductionPlanDetail {
  line: string;
  season: string;
  style: string;
  buy: string;
  category: string;
  orderQty: number;
  dutyQty: number;
  target: number;
  inlineDays: number;
  conversionTime: string;
  inlineDate: string | null;       
  estOfflineDate: string | null;    
  actualOfflineDate: string | null; 
  finalOfflineDate: string | null; 
  crd: string | null;
}

export const productionPlanDetailData = [
  {
    line: "EE01",
    season: "S26",
    style: "F2606LHBM418M",
    buy: "Buy-A",
    category: "TP",
    orderQty: 8500,
    dutyQty: 3200,
    target: 280,
    inlineDays: 12,
    conversionTime: "Conv",
    inlineDate: "2026-04-20",
    estOfflineDate: "2026-05-05",
    actualOfflineDate: null,
    finalOfflineDate: null,
    crd: "2026-05-15"
  },
  {
    line: "EE02",
    season: "S26",
    style: "F2606LHBM418M",
    buy: "Buy-A",
    category: "DUP",
    orderQty: 8500,
    dutyQty: 2800,
    target: 250,
    inlineDays: 12,
    conversionTime: "",
    inlineDate: "2026-04-22",
    estOfflineDate: "2026-05-07",
    actualOfflineDate: null,
    finalOfflineDate: null,
    crd: "2026-05-15"
  },
  {
    line: "EE03",
    season: "S26",
    style: "F2606LHAF512M",
    buy: "Buy-B",
    category: "TP",
    orderQty: 6200,
    dutyQty: 6200,
    target: 300,
    inlineDays: 21,
    conversionTime: "Conv",
    inlineDate: "2026-04-25",
    estOfflineDate: "2026-05-20",
    actualOfflineDate: "2026-05-18",
    finalOfflineDate: "2026-05-18",
    crd: "2026-05-25"
  }
];