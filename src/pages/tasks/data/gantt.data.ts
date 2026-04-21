export interface GanttTask {
  id: number;
  parentId: number;
  title: string;
  start: Date;
  end: Date;
  progress: number;
  color?: string;
}

export const ganttTasks: GanttTask[] = [
  {
    id: 1,
    parentId: 0,
    title: "1. EE01 - MSL",
    start: new Date(2026, 4, 20),
    end: new Date(2026, 4, 30),
    progress: 100,
    color: "#27ae60"
  },
  {
    id: 2,
    parentId: 0,
    title: "2. EE02 - CSL",
    start: new Date(2026, 3, 25),
    end: new Date(2026, 4, 15),
    progress: 65,
    color: "#f31212ff"
  },
  {
    id: 3,
    parentId: 0,
    title: "3. EE03 - MSL",
    start: new Date(2026, 4, 1),
    end: new Date(2026, 4, 22),
    progress: 25,
    color: "#00ff37ff"
  },
  {
    id: 4,
    parentId: 0,
    title: "4. EE04 - CSL",
    start: new Date(2026, 4, 5),
    end: new Date(2026, 4, 28),
    progress: 0,
    color: "#b65959ff"
  },
  {
    id: 5,
    parentId: 0,
    title: "5. EE05 - MSL",
    start: new Date(2026, 4, 10),
    end: new Date(2026, 4, 30),
    progress: 10,
    color: "#e74c3c"
  }
];