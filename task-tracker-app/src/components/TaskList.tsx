import React, { useState } from 'react';
import { Task } from '@/types';
import TaskRow from './TaskRow';
import { FaPlus } from 'react-icons/fa';

interface TaskListProps {
  tasks: Task[];
  onSaveTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onEditNotes: (task: Task) => void;
  onToggleComplete: (taskId: string) => void;
  onMoveTask?: (taskId: string, newPriority: Task['priority']) => void;
  onAddTask: (task: Omit<Task, 'id' | 'notes' | 'workspace'>) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onSaveTask, onDeleteTask, onEditNotes, onToggleComplete, onMoveTask, onAddTask }) => {
  const [dragOverSection, setDragOverSection] = useState<string | null>(null);

  const activeTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);

  const dailyReminderTasks = activeTasks.filter(task => task.priority === 'Daily Reminders');
  const top5Tasks = activeTasks.filter(task => task.priority === 'Top 5');
  const urgentTasks = activeTasks.filter(task => task.priority === 'Urgent');
  const hopperTasks = activeTasks.filter(task => task.priority === 'Hopper');

  const handleAddTaskToSection = (priority: Task['priority']) => {
    onAddTask({
      text: '',
      priority,
      dropDead: '',
      category: 'Other',
      completed: false,
    });
  };

  const handleDragStart = () => {
    // Task ID is stored in dataTransfer in TaskRow component
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
    const isDropTarget = dragOverSection === 'Daily Reminders';
    const dropZoneClass = isDropTarget ? 'ring-2 ring-purple-500 bg-purple-900/40' : '';

    return (
      <div
        onDragOver={(e) => handleDragOver(e, 'Daily Reminders')}
        onDragLeave={handleDragLeave}
        onDrop={(e) => handleDrop(e, 'Daily Reminders')}
        className={`rounded-lg p-2 bg-gradient-to-r from-purple-900/30 to-blue-900/30 border-2 border-purple-500/50 transition-all ${dropZoneClass}`}
      >
        <div className="flex items-center justify-between mb-4 border-b-2 border-purple-500 pb-2">
          <h2 className="text-2xl font-bold text-white">{title}</h2>
          <button
            onClick={() => handleAddTaskToSection('Daily Reminders')}
            className="flex items-center gap-2 px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-500 transition-colors"
          >
            <FaPlus size={14} />
            <span className="text-sm">Add Task</span>
          </button>
        </div>

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
        <div className="flex items-center justify-between mb-4 border-b-2 border-gray-700 pb-2">
          <h2 className="text-2xl font-bold text-white">{title}</h2>
          <button
            onClick={() => handleAddTaskToSection(priority)}
            className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-500 transition-colors"
          >
            <FaPlus size={14} />
            <span className="text-sm">Add Task</span>
          </button>
        </div>

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
      {renderDailyRemindersSection('Daily Reminders', dailyReminderTasks)}
      {renderTaskSection('Top 5', top5Tasks, 'Top 5')}
      {renderTaskSection('Urgent', urgentTasks, 'Urgent')}
      {renderTaskSection('Hopper', hopperTasks, 'Hopper')}
      {renderTaskSection('Completed', completedTasks, 'Hopper')}
    </div>
  );
};

export default TaskList;
