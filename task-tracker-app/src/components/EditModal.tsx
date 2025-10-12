import React, { useState, useEffect } from 'react';
import { Task } from '@/types';

interface EditModalProps {
  task: Task | null;
  onClose: () => void;
  onSave: (task: Task) => void;
}

const EditModal: React.FC<EditModalProps> = ({ task, onClose, onSave }) => {
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (task) {
      setNotes(task.notes || '');
    }
  }, [task]);

  if (!task) {
    return null;
  }

  const handleSave = () => {
    onSave({ ...task, notes });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-gray-900 p-6 rounded-lg shadow-xl w-full max-w-lg mx-4">
        <h2 className="text-2xl font-bold text-white mb-4">{task.text}</h2>
        <div className="space-y-4 text-gray-300">
          <p><span className="font-bold">Priority:</span> {task.priority}</p>
          <p><span className="font-bold">Category:</span> {task.category}</p>
          <p><span className="font-bold">Drop Dead:</span> {task.dropDead}</p>
        </div>
        <div className="mt-4">
          <label htmlFor="notes" className="block text-sm font-medium text-gray-300 mb-2">Notes</label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full p-2 bg-gray-800 text-white rounded h-32"
          />
        </div>
        <div className="mt-6 flex justify-end space-x-4">
          <button onClick={onClose} className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600">
            Close
          </button>
          <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500">
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditModal;
