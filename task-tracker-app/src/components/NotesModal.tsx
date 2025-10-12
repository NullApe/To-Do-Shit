import React, { useState, useEffect } from 'react';
import { Task } from '@/types';

interface NotesModalProps {
  task: Task | null;
  onClose: () => void;
  onSave: (task: Task) => void;
}

const NotesModal: React.FC<NotesModalProps> = ({ task, onClose, onSave }) => {
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
        <h2 className="text-2xl font-bold text-white mb-4">Edit Notes for "{task.text}"</h2>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full p-2 bg-gray-800 text-white rounded h-48"
        />
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

export default NotesModal;
