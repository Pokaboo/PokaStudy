export interface Task {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  color: string;
}

export interface CheckIn {
  id: string;
  taskId: string;
  taskName: string;
  date: string;   // YYYY-MM-DD
  time: string;   // HH:MM:SS
  datetime: string; // ISO
}
