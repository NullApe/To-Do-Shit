import React, { useState, useEffect, useCallback } from 'react';
import DatePicker from 'react-datepicker';
import { Task } from '@/types';
import { FaTrash, FaCheck, FaEllipsisV, FaGripVertical } from 'react-icons/fa';
import { debounce } from 'lodash';

interface TaskRowProps {
  task: Task;
  onSave: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onEditNotes: (task: Task) => void;
  onToggleComplete: (taskId: string) => void;
  onDragStart?: (taskId: string) => void;
}

const TaskRow: React.FC<TaskRowProps> = ({ task, onSave, onDelete, onEditNotes, onToggleComplete, onDragStart }) => {
  const [editableTask, setEditableTask] = useState<Task>(task);
  const [showDetails, setShowDetails] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', task.id);
    if (onDragStart) {
      onDragStart(task.id);
    }
  };

  const debouncedSaveRef = useCallback(() => {
    return debounce((newTask: Task) => {
      onSave(newTask);
    }, 500);
  }, [onSave]);

  const debouncedSave = debouncedSaveRef();

  useEffect(() => {
    setEditableTask(task);
  }, [task]);

  useEffect(() => {
    if (editableTask !== task) {
      debouncedSave(editableTask);
    }
    return () => {
      debouncedSave.cancel();
    };
  }, [editableTask, task]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditableTask(prevTask => ({ ...prevTask, [name]: value }));
  };

  const handleDateChange = (date: Date | null) => {
    if (date) {
      setEditableTask(prevTask => ({ ...prevTask, dropDead: date.toISOString() }));
    }
  };

  const truncateNotes = (notes: string) => {
    if (notes.length > 20) {
      return notes.substring(0, 20) + '...';
    }
    return notes;
  };

  const handleToggleCompleteWithAnimation = () => {
    if (!task.completed) {
      // Only animate when completing (not uncompleting)
      setIsCompleting(true);
      setTimeout(() => {
        onToggleComplete(task.id);
      }, 800); // Wait for animation to finish before updating state
    } else {
      // If uncompleting, no animation needed
      onToggleComplete(task.id);
    }
  };

  return (
    <>
      {/* Desktop View - Table Row */}
      <tr
        className={`hidden md:table-row border-b border-gray-800 transition-all duration-700 ${
          task.completed ? 'bg-gray-800 opacity-50' : 'hover:bg-gray-700'
        } ${
          isCompleting ? 'opacity-0 translate-x-12 scale-75 bg-green-500/20' : ''
        }`}
      >
        <td className="p-1">
          <div
            draggable={!task.completed}
            onDragStart={handleDragStart}
            className={`flex items-center justify-center ${
              task.completed
                ? 'cursor-not-allowed opacity-50'
                : 'cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-200'
            }`}
          >
            <FaGripVertical />
          </div>
        </td>
        <td className="p-1"><input name="text" value={editableTask.text} onChange={handleChange} className="bg-gray-700 p-1 rounded w-full" /></td>
        <td className="p-1">
          <select name="priority" value={editableTask.priority} onChange={handleChange} className="bg-gray-700 p-1 rounded w-full">
            <option value="Daily Reminders">Daily Reminders</option>
            <option value="Top 5">Top 5</option>
            <option value="Urgent">Urgent</option>
            <option value="Hopper">Hopper</option>
          </select>
        </td>
        <td className="p-1">
          <DatePicker selected={editableTask.dropDead ? new Date(editableTask.dropDead) : null} onChange={handleDateChange} className="bg-gray-700 p-1 rounded w-full" />
        </td>
        <td className="p-1">
          <select name="category" value={editableTask.category} onChange={handleChange} className="bg-gray-700 p-1 rounded w-full">
            <option value="Content">Content</option>
            <option value="Ops">Ops</option>
            <option value="Strategy">Strategy</option>
            <option value="Paid">Paid</option>
            <option value="Other">Other</option>
          </select>
        </td>
        <td onClick={() => onEditNotes(task)} className="p-1 cursor-pointer hover:bg-gray-600">
          {truncateNotes(editableTask.notes)}
        </td>
        <td className="p-1">
          <div className="flex items-center justify-center gap-1">
            <button
              onClick={handleToggleCompleteWithAnimation}
              className="p-2 rounded hover:bg-green-600/20 text-green-500 hover:text-green-400 transition-colors"
              title="Complete task"
            >
              <FaCheck size={16} />
            </button>
            <button
              onClick={() => onDelete(task.id)}
              className="p-2 rounded hover:bg-red-600/20 text-red-500 hover:text-red-400 transition-colors"
              title="Delete task"
            >
              <FaTrash size={14} />
            </button>
          </div>
        </td>
      </tr>

      {/* Mobile View - Card Layout */}
      <div
        className={`md:hidden mb-2 p-3 rounded-lg transition-all duration-700 ${
          task.completed ? 'bg-gray-800 opacity-50' : 'bg-gray-800'
        } ${
          isCompleting ? 'opacity-0 translate-x-12 scale-75 bg-green-500/20' : ''
        }`}
      >
        <div className="flex items-center justify-between gap-2">
          <div
            draggable={!task.completed}
            onDragStart={handleDragStart}
            className={`${
              task.completed
                ? 'cursor-not-allowed opacity-50'
                : 'cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-200'
            }`}
          >
            <FaGripVertical size={20} />
          </div>
          <div className="flex-1">
            <input
              name="text"
              value={editableTask.text}
              onChange={handleChange}
              className={`bg-gray-700 p-2 rounded w-full text-sm ${task.completed ? 'line-through' : ''}`}
            />
          </div>
          <button
            onClick={handleToggleCompleteWithAnimation}
            className="p-2 rounded hover:bg-green-600/20 text-green-500 hover:text-green-400 transition-colors"
            title="Complete task"
          >
            <FaCheck size={18} />
          </button>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="p-2 rounded hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
            title="Show details"
          >
            <FaEllipsisV size={18} />
          </button>
        </div>

        {/* Expandable Details */}
        {showDetails && (
          <div className="mt-3 space-y-2 pt-3 border-t border-gray-700">
            <div>
              <label className="text-xs text-gray-400 block mb-1">Priority</label>
              <select name="priority" value={editableTask.priority} onChange={handleChange} className="bg-gray-700 p-2 rounded w-full text-sm">
                <option value="Daily Reminders">Daily Reminders</option>
                <option value="Top 5">Top 5</option>
                <option value="Urgent">Urgent</option>
                <option value="Hopper">Hopper</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">Drop Dead</label>
              <DatePicker
                selected={editableTask.dropDead ? new Date(editableTask.dropDead) : null}
                onChange={handleDateChange}
                className="bg-gray-700 p-2 rounded w-full text-sm"
                wrapperClassName="w-full"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">Category</label>
              <select name="category" value={editableTask.category} onChange={handleChange} className="bg-gray-700 p-2 rounded w-full text-sm">
                <option value="Content">Content</option>
                <option value="Ops">Ops</option>
                <option value="Strategy">Strategy</option>
                <option value="Paid">Paid</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">Notes</label>
              <button
                onClick={() => onEditNotes(task)}
                className="bg-gray-700 p-2 rounded w-full text-sm text-left hover:bg-gray-600"
              >
                {editableTask.notes || 'Add notes...'}
              </button>
            </div>
            <div className="pt-2">
              <button
                onClick={() => onDelete(task.id)}
                className="w-full p-2 rounded bg-red-600/10 hover:bg-red-600/20 text-red-500 hover:text-red-400 text-sm flex items-center justify-center gap-2 transition-colors"
              >
                <FaTrash size={14} /> Delete Task
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default TaskRow;
