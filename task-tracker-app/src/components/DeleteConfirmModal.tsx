import React from 'react';
import { Task } from '@/types';

interface DeleteConfirmModalProps {
  task: Task;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({ task, onClose, onConfirm }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-gray-900 p-6 rounded-lg shadow-xl w-full max-w-md mx-4">
        <h2 className="text-2xl font-bold text-white mb-4">Delete Task?</h2>
        <p className="text-gray-300 mb-2">Are you sure you want to delete this task?</p>
        <div className="bg-gray-800 p-3 rounded mb-6">
          <p className="text-white font-semibold">{task.text}</p>
          <p className="text-gray-400 text-sm mt-1">
            {task.category} • {task.priority}
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-500 cursor-pointer"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
