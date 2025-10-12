import React from 'react';
import { Task } from '@/types';
import TaskRow from './TaskRow';

interface TaskListProps {
  tasks: Task[];
  onSaveTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onEditNotes: (task: Task) => void;
  onToggleComplete: (taskId: string) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onSaveTask, onDeleteTask, onEditNotes, onToggleComplete }) => {
  const activeTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);

  const top5Tasks = activeTasks.filter(task => task.priority === 'Top 5');
  const urgentTasks = activeTasks.filter(task => task.priority === 'Urgent');
  const hopperTasks = activeTasks.filter(task => task.priority === 'Hopper');

  const renderTaskSection = (title: string, tasks: Task[], isCompletedSection = false) => (
    <div>
      <h2 className="text-2xl font-bold text-white mb-4 border-b-2 border-gray-700 pb-2">{title}</h2>
      <table className="w-full text-left text-white table-fixed">
        <thead>
          <tr className="border-b border-gray-700">
            <th className="p-2 w-1/3">Task</th>
            <th className="p-2 w-1/6">Priority</th>
            <th className="p-2 w-1/6">Drop Dead</th>
            <th className="p-2 w-1/6">Category</th>
            <th className="p-2 w-1/6">Notes</th>
            <th className="p-2 w-auto"></th>
          </tr>
        </thead>
        <tbody>
          {tasks.map(task => (
            <TaskRow 
              key={task.id} 
              task={task} 
              onSave={onSaveTask} 
              onDelete={onDeleteTask} 
              onEditNotes={onEditNotes} 
              onToggleComplete={onToggleComplete} 
            />
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="space-y-8">
      {renderTaskSection('Top 5', top5Tasks)}
      {renderTaskSection('Urgent', urgentTasks)}
      {renderTaskSection('Hopper', hopperTasks)}
      {renderTaskSection('Completed', completedTasks, true)}
    </div>
  );
};

export default TaskList;
