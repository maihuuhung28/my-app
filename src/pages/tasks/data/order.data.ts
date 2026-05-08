
export interface Order {
  id: number;
  season: string;
  style: string;
  buy: string;
  color: string;
  firstCrd: string;
  qtyOrder: number;
  balQty: number;
  smv: number;
  category: string;
  productType: string;
  materialStatus: string;
  eta: string;
  planStatus: string;

  // trường hỗ trợ cho Bảng 2
  earliestStartDate?: string;
  groupedBy?: string;
  sewingLineType?: string;
  qvtDate?: string;
}

// Mock data (Từ cột Season đến SMW)
export const orders: Order[] = [
  {
    id: 1,
    season: 'F5-TP',
    style: 'F2606LHBM418M',
    buy: 'Buy-A',
    color: 'Green',
    firstCrd: '2026-05-20',
    qtyOrder: 8500,
    balQty: 8500,
    smv: 0.4413,
    category: 'F5-TP',
    productType: 'JACKET (DOWN)',
    materialStatus: 'DATE - OK',
    eta: '2026-04-10',
    planStatus: 'Done',
    earliestStartDate: '2026-04-22',
    groupedBy: 'S26-TT400M',
    sewingLineType: 'Manual + Conveyor',
    qvtDate: '2026-05-15'
  },
  {
    id: 2,
    season: 'F3-TP',
    style: 'F2606LHAF512M',
    buy: 'Buy-B',
    color: 'Blue',
    firstCrd: '2026-06-15',
    qtyOrder: 7200,
    balQty: 7200,
    smv: 0.5161,
    category: 'F3-TP',
    productType: 'VEST',
    materialStatus: 'DATE - OK',
    eta: '2026-04-15',
    planStatus: 'Pending',
    earliestStartDate: '2026-04-25',
    groupedBy: 'S26-TT400M',
    sewingLineType: 'Manual',
    qvtDate: '2026-06-10'
  },
  {
    id: 3,
    season: 'F5-DUP',
    style: 'F2606LHBJ522M',
    buy: 'Buy-C',
    color: 'Green',
    firstCrd: '2026-05-25',
    qtyOrder: 6500,
    balQty: 6500,
    smv: 0.3920,
    category: 'F5-DUP',
    productType: 'JACKET (FILLED HEAVYWEIGHT)',
    materialStatus: 'DATE - OK',
    eta: '2026-04-12',
    planStatus: 'Done',
    earliestStartDate: '2026-04-20',
    groupedBy: 'S26-JKT500M',
    sewingLineType: 'Manual + Conveyor',
    qvtDate: '2026-05-20'
  },
  {
    id: 4,
    season: 'F6-TP',
    style: 'S2607JKT009',
    buy: 'Buy-D',
    color: 'Yellow',
    firstCrd: '2026-07-01',
    qtyOrder: 4800,
    balQty: 4800,
    smv: 0.4850,
    category: 'F6-TP',
    productType: 'PANTS',
    materialStatus: 'DATE - OK',
    eta: '2026-05-01',
    planStatus: 'Partial',
    earliestStartDate: '2026-05-05',
    groupedBy: 'S26-PNT300M',
    sewingLineType: 'Manual',
    qvtDate: '2026-06-26'
  },
  {
    id: 5,
    season: 'F6-BTP',
    style: 'S2701JKT001',
    buy: 'Buy-E',
    color: 'Black',
    firstCrd: '2026-07-10',
    qtyOrder: 11000,
    balQty: 11000,
    smv: 0.6200,
    category: 'F6-BTP',
    productType: 'JACKET (LIGHT)',
    materialStatus: 'DATE - OK',
    eta: '2026-05-05',
    planStatus: 'Pending',
    earliestStartDate: '2026-04-25',
    groupedBy: 'S27-JKT100M',
    sewingLineType: 'Manual + Conveyor',
    qvtDate: '2026-07-05'
  },
  {
    id: 6,
    season: 'F5-TP',
    style: 'F2608VST015',
    buy: 'Buy-F',
    color: 'White',
    firstCrd: '2026-06-05',
    qtyOrder: 9300,
    balQty: 9300,
    smv: 0.3500,
    category: 'F5-TP',
    productType: 'VEST',
    materialStatus: 'DATE - OK',
    eta: '2026-04-25',
    planStatus: 'Partial',
    earliestStartDate: '2026-04-28',
    groupedBy: 'S26-VST200M',
    sewingLineType: 'Manual',
    qvtDate: '2026-05-31'
  },
  {
    id: 7,
    season: 'S27',
    style: 'S2702PNT003',
    buy: 'Buy-G',
    color: 'Navy',
    firstCrd: '2026-08-01',
    qtyOrder: 5400,
    balQty: 5400,
    smv: 0.4100,
    category: 'F6-TP',
    productType: 'PANTS (1/1)',
    materialStatus: 'DATE - OK',
    eta: '2026-05-20',
    planStatus: 'Done',
    earliestStartDate: '2026-05-25',
    groupedBy: 'S27-PNT300M',
    sewingLineType: 'Manual + Conveyor',
    qvtDate: '2026-07-27'
  },
  {
    id: 8,
    season: 'F5-DUP',
    style: 'F2609JKT022',
    buy: 'Buy-H',
    color: 'Grey',
    firstCrd: '2026-05-30',
    qtyOrder: 8800,
    balQty: 8800,
    smv: 0.4550,
    category: 'F5-DUP',
    productType: 'JACKET (DUP)',
    materialStatus: 'DATE - OK',
    eta: '2026-04-18',
    planStatus: 'Partial',
    earliestStartDate: '2026-04-30',
    groupedBy: 'S26-JKT500M',
    sewingLineType: 'Manual',
    qvtDate: '2026-05-25'
  },
  {
    id: 9,
    season: 'S26',
    style: 'F2610VST030',
    buy: 'Buy-I',
    color: 'Pink',
    firstCrd: '2026-06-20',
    qtyOrder: 6700,
    balQty: 600,
    smv: 0.3800,
    category: 'F5-BTP',
    productType: 'VEST (FILLED)',
    materialStatus: 'DATE - OK',
    eta: '2026-04-22',
    planStatus: 'Done',
    earliestStartDate: '2026-04-26',
    groupedBy: 'S26-VST200M',
    sewingLineType: 'Manual + Conveyor',
    qvtDate: '2026-06-15'
  },
  {
    id: 10,
    season: 'F6-TP',
    style: 'S2607PNT045',
    buy: 'Buy-J',
    color: '',
    firstCrd: '2026-07-15',
    qtyOrder: 7600,
    balQty: 7600,
    smv: 0.5200,
    category: 'F6-TP',
    productType: 'PANTS',
    materialStatus: 'DATE - OK',
    eta: '2026-05-10',
    planStatus: 'Pending',
    earliestStartDate: '2026-05-15',
    groupedBy: 'S26-PNT300M',
    sewingLineType: 'Manual',
    qvtDate: '2026-07-10'
  }
];