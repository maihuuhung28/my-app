// LineSchedule.data.ts

export const PLANNING_COLORS = {
  ontime: '#27ae60', // Xanh lá: Kịp hàng
  late: '#e74c3c',   // Đỏ: Trễ vật tư
};

export interface ScheduleTask {
  Style: string;
  Quantity: number;
  startDay: number; 
  duration: number; 
  QVTDate: Date; // Ngày vật tư về (Căn cứ để check Đỏ/Xanh)
}

export interface LineData {
  PRI: number;
  LineName: string;
  LineType: string;
  ScheduleTasks: ScheduleTask[];
}

export const lineScheduleData: LineData[] = [
  {
    PRI: 1, LineName: 'EE01', LineType: 'MSL',
    ScheduleTasks: [
      { Style: 'S26-TT400M', Quantity: 500, startDay: 5, duration: 5, QVTDate: new Date(2026, 3, 3) }, // XANH
      { Style: 'F26-LHBM41', Quantity: 1200, startDay: 12, duration: 8, QVTDate: new Date(2026, 3, 15) }, // ĐỎ
    ]
  },
  {
    PRI: 2, LineName: 'EE02', LineType: 'CSL',
    ScheduleTasks: [
      { Style: 'F26-LHBJ52', Quantity: 850, startDay: 2, duration: 12, QVTDate: new Date(2026, 3, 1) }, // XANH
    ]
  }
];