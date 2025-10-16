import React, { useState } from 'react';
import { Task } from '@/types';
import TaskRow from './TaskRow';

interface TaskListProps {
  tasks: Task[];
  onSaveTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onEditNotes: (task: Task) => void;
  onToggleComplete: (taskId: string) => void;
  onMoveTask?: (taskId: string, newPriority: Task['priority']) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onSaveTask, onDeleteTask, onEditNotes, onToggleComplete, onMoveTask }) => {
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [dragOverSection, setDragOverSection] = useState<string | null>(null);

  const activeTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);

  // Separate daily reminders from regular tasks
  const dailyReminderTasks = tasks.filter(task => task.isDailyReminder);
  const regularTasks = activeTasks.filter(task => !task.isDailyReminder);

  const top5Tasks = regularTasks.filter(task => task.priority === 'Top 5');
  const urgentTasks = regularTasks.filter(task => task.priority === 'Urgent');
  const hopperTasks = regularTasks.filter(task => task.priority === 'Hopper');

  const handleDragStart = (taskId: string) => {
    setDraggedTaskId(taskId);
  };

  const handleDragOver = (e: React.DragEvent, priority: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverSection(priority);
  };

  const handleDragLeave = () => {
    setDragOverSection(null);
  };

  const handleDrop = (e: React.DragEvent, newPriority: Task['priority']) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain');
    setDragOverSection(null);
    setDraggedTaskId(null);

    if (taskId && onMoveTask) {
      onMoveTask(taskId, newPriority);
    }
  };

  const renderDailyRemindersSection = (title: string, sectionTasks: Task[]) => {
    return (
      <div className="rounded-lg p-2 bg-gradient-to-r from-purple-900/30 to-blue-900/30 border-2 border-purple-500/50">
        <h2 className="text-2xl font-bold text-white mb-4 border-b-2 border-purple-500 pb-2">{title}</h2>

        {/* Desktop Table View */}
        <table className="hidden md:table w-full text-left text-white table-fixed">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="p-2 w-12"></th>
              <th className="p-2 w-1/3">Task</th>
              <th className="p-2 w-1/6">Priority</th>
              <th className="p-2 w-1/6">Drop Dead</th>
              <th className="p-2 w-1/6">Category</th>
              <th className="p-2 w-1/6">Notes</th>
              <th className="p-2 w-auto"></th>
            </tr>
          </thead>
          <tbody>
            {sectionTasks.map(task => (
              <TaskRow
                key={task.id}
                task={task}
                onSave={onSaveTask}
                onDelete={onDeleteTask}
                onEditNotes={onEditNotes}
                onToggleComplete={onToggleComplete}
                onDragStart={handleDragStart}
              />
            ))}
          </tbody>
        </table>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-2">
          {sectionTasks.map(task => (
            <TaskRow
              key={task.id}
              task={task}
              onSave={onSaveTask}
              onDelete={onDeleteTask}
              onEditNotes={onEditNotes}
              onToggleComplete={onToggleComplete}
              onDragStart={handleDragStart}
            />
          ))}
        </div>
      </div>
    );
  };

  const renderTaskSection = (title: string, sectionTasks: Task[], priority: Task['priority']) => {
    const isDropTarget = dragOverSection === priority;
    const dropZoneClass = isDropTarget ? 'ring-2 ring-blue-500 bg-blue-900/20' : '';

    return (
      <div
        onDragOver={(e) => handleDragOver(e, priority)}
        onDragLeave={handleDragLeave}
        onDrop={(e) => handleDrop(e, priority)}
        className={`transition-all ${dropZoneClass} rounded-lg p-2`}
      >
        <h2 className="text-2xl font-bold text-white mb-4 border-b-2 border-gray-700 pb-2">{title}</h2>

        {/* Desktop Table View */}
        <table className="hidden md:table w-full text-left text-white table-fixed">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="p-2 w-12"></th>
              <th className="p-2 w-1/3">Task</th>
              <th className="p-2 w-1/6">Priority</th>
              <th className="p-2 w-1/6">Drop Dead</th>
              <th className="p-2 w-1/6">Category</th>
              <th className="p-2 w-1/6">Notes</th>
              <th className="p-2 w-auto"></th>
            </tr>
          </thead>
          <tbody>
            {sectionTasks.map(task => (
              <TaskRow
                key={task.id}
                task={task}
                onSave={onSaveTask}
                onDelete={onDeleteTask}
                onEditNotes={onEditNotes}
                onToggleComplete={onToggleComplete}
                onDragStart={handleDragStart}
              />
            ))}
          </tbody>
        </table>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-2">
          {sectionTasks.map(task => (
            <TaskRow
              key={task.id}
              task={task}
              onSave={onSaveTask}
              onDelete={onDeleteTask}
              onEditNotes={onEditNotes}
              onToggleComplete={onToggleComplete}
              onDragStart={handleDragStart}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {dailyReminderTasks.length > 0 && renderDailyRemindersSection('Daily Reminders', dailyReminderTasks)}
      {renderTaskSection('Top 5', top5Tasks, 'Top 5')}
      {renderTaskSection('Urgent', urgentTasks, 'Urgent')}
      {renderTaskSection('Hopper', hopperTasks, 'Hopper')}
      {renderTaskSection('Completed', completedTasks, 'Hopper')}
    </div>
  );
};

export default TaskList;
