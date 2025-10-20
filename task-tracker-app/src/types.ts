
export interface Task {
  id: string;
  text: string;
  priority: 'Daily Reminders' | 'Top 5' | 'Urgent' | 'Hopper';
  dropDead: string; // ISO date format
  category: 'Content' | 'Ops' | 'Strategy' | 'Paid' | 'Other';
  notes: string;
  completed: boolean;
  workspace: 'Work' | 'Projects' | 'Personal';
}
