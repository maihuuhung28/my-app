export interface PlanTask {
  styleInfo: string;
  startDay: number;
  endDay: number;
  color: string;
}

export interface LinePlanning {
  priLine: number;
  lineName: string;
  lineType: string;
  tasks: PlanTask[];
}

export const planningData: LinePlanning[] = [
  {
    priLine: 1,
    lineName: 'EE01',
    lineType: 'MSL',
    tasks: [
      {
        styleInfo: 'Style1-Buy-TP/DUP/BTP',
        startDay: 1,
        endDay: 3,
        color: '#92D050' // Xanh lá (Sản xuất tốt)
      },
      {
        styleInfo: 'Style2-Buy-TP/DUP/BTP',
        startDay: 4,
        endDay: 10,
        color: '#00B0F0' // Xanh dương (Đang chạy)
      }
    ]
  },
  {
    priLine: 2,
    lineName: 'EE02',
    lineType: 'CSL',
    tasks: [
      {
        styleInfo: 'Style3-Buy03-New',
        startDay: 2,
        endDay: 5,
        color: '#FFC000' // Màu vàng (Hàng gấp/Cần lưu ý)
      },
      {
        styleInfo: 'Style4-Buy04-Urgent',
        startDay: 7,
        endDay: 9,
        color: '#ED7D31' // Màu cam (Hàng rất gấp)
      }
    ]
  },
  {
    priLine: 3,
    lineName: 'EE03',
    lineType: 'MSL',
    tasks: [
      {
        styleInfo: 'Style5-Full-Month',
        startDay: 1,
        endDay: 10,
        color: '#7030A0' // Màu tím (Mã hàng dài hạn)
      }
    ]
  },
  {
    priLine: 4,
    lineName: 'EE04',
    lineType: 'CSL',
    tasks: [
      {
        styleInfo: 'Style6-Trial',
        startDay: 5,
        endDay: 6,
        color: '#A5A5A5' // Màu xám (Hàng mẫu/Trial)
      }
    ]
  },
  {
    priLine: 5,
    lineName: 'EE05',
    lineType: 'MSL',
    tasks: [] 
  }
];