import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Task } from '@/types';

interface TaskFormProps {
  onAddTask: (task: Omit<Task, 'id' | 'notes'>) => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ onAddTask }) => {
  const [text, setText] = useState('');
  const [priority, setPriority] = useState<'Top 5' | 'Urgent' | 'Hopper'>('Hopper');
  const [dropDead, setDropDead] = useState<Date | null>(null);
  const [category, setCategory] = useState<'Content' | 'Ops' | 'Strategy' | 'Paid' | 'Other'>('Other');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddTask({ text, priority, dropDead: dropDead?.toISOString() || '', category, completed: false });
    setText('');
    setPriority('Hopper');
    setDropDead(null);
    setCategory('Other');
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-gray-900 rounded-lg mb-4">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
        <div className="col-span-1 md:col-span-2">
          <label htmlFor="task-text" className="block text-sm font-medium text-gray-300 mb-1">Task</label>
          <input
            id="task-text"
            type="text"
            placeholder="Enter task description"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full p-2 bg-gray-800 text-white rounded"
          />
        </div>
        <div>
          <label htmlFor="task-priority" className="block text-sm font-medium text-gray-300 mb-1">Priority</label>
          <select id="task-priority" value={priority} onChange={(e) => setPriority(e.target.value as Task['priority'])} className="w-full p-2 bg-gray-800 text-white rounded">
            <option value="Hopper">Hopper</option>
            <option value="Urgent">Urgent</option>
            <option value="Top 5">Top 5</option>
          </select>
        </div>
        <div>
          <label htmlFor="task-dropdead" className="block text-sm font-medium text-gray-300 mb-1">Drop Dead</label>
          <DatePicker 
            id="task-dropdead"
            selected={dropDead}
            onChange={(date: Date | null) => setDropDead(date)}
            className="w-full p-2 bg-gray-800 text-white rounded"
            wrapperClassName="w-full"
          />
        </div>
        <div>
          <label htmlFor="task-category" className="block text-sm font-medium text-gray-300 mb-1">Category</label>
          <select id="task-category" value={category} onChange={(e) => setCategory(e.target.value as Task['category'])} className="w-full p-2 bg-gray-800 text-white rounded">
            <option value="Content">Content</option>
            <option value="Ops">Ops</option>
            <option value="Strategy">Strategy</option>
            <option value="Paid">Paid</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <button type="submit" className="p-2 bg-blue-600 text-white rounded hover:bg-blue-500">
          Add Task
        </button>
      </div>
    </form>
  );
};

export default TaskForm;