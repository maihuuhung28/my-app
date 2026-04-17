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
  specialNotes: string;
  materialStatus: string;
  eta: string;
  planStatus: string;
}

//Mock dữ liệu mẫu cho OrdersTable
export const orders: Order[] = [
  {
    id: 1,
    season: 'F5-TP',
    style: 'Style1-Buy-TP',
    buy: 'Buy 01',  
    color: 'Red',
    firstCrd: '2026-05-20',
    qtyOrder: 1000,
    balQty: 1000,
    smv: 0.4413,
    category: 'F5-TP',
    productType: 'JACKET (DOWN)',
    specialNotes: 'Print/EMB',
    materialStatus: 'DATE - OK',
    eta: '2026-04-10',
    planStatus: 'Already have'
  },
  {
    id: 2,
    season: 'F3-TP',
    style: 'Style2-Buy-DUP',
    buy: 'Buy 02',
    color: 'Blue',
    firstCrd: '2026-06-15',
    qtyOrder: 2500,
    balQty: 2500,
    smv: 0.5161,
    category: 'F5-BTP',
    productType: 'VEST',
    specialNotes: 'Quilting difficult',
    materialStatus: 'DATE - NOT YET',
    eta: '2026-04-15',
    planStatus: 'Not yet have'
  },
  {
    id: 3,
    season: 'F5-BTP',
    style: 'Style4-Buy-DUP',
    buy: 'Buy 03',
    color: 'Green',
    firstCrd: '2026-04-10',
    qtyOrder: 2500,
    balQty: 2500,
    smv: 0.5161,
    category: 'F5-TP',
    productType: 'VEST',
    specialNotes: 'Quilting difficult',
    materialStatus: 'DATE - OK',
    eta: '2026-04-15',
    planStatus: 'Already have'
  },
  {
    id: 4,
    season: 'F6-TP',
    style: 'Style5-Buy-PRO',
    buy: 'Buy 04',
    color: 'Yellow',
    firstCrd: '2026-07-01',
    qtyOrder: 3000,
    balQty: 3000,
    smv: 0.4850,
    category: 'F6-TP',
    productType: 'PANTS',
    specialNotes: 'Normal',
    materialStatus: 'DATE - OK',
    eta: '2026-05-01',
    planStatus: 'Have Partial: 1500pcs'
  },
  {
    id: 5,
    season: 'F6-BTP',
    style: 'Style6-Buy-NEW',
    buy: 'Buy 05',
    color: 'Black',
    firstCrd: '2026-07-10',
    qtyOrder: 5000,
    balQty: 5000,
    smv: 0.6200,
    category: 'F6-BTP',
    productType: 'JACKET (LIGHT)',
    specialNotes: 'Print/EMB difficult',
    materialStatus: 'DATE - NOT YET',
    eta: '2026-05-05',
    planStatus: 'Not yet have'
  },
  {
    id: 6,
    season: 'F5-TP',
    style: 'Style7-Buy-URG',
    buy: 'Buy 06',
    color: 'White',
    firstCrd: '2026-06-05',
    qtyOrder: 8000,
    balQty: 8000,
    smv: 0.3500,
    category: 'F5-TP',
    productType: 'T-SHIRT',
    specialNotes: 'Print/EMB',
    materialStatus: 'DATE - OK',
    eta: '2026-04-25',
    planStatus: 'Have Partial: 5000pcs'
  }
];