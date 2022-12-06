export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
}

export enum TaskStatus {
  Open = 'Open',
  In_Progress = 'In_Progress',
  Done = 'Done',
}
