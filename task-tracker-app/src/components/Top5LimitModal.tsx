import React, { useState } from 'react';
import { Task } from '@/types';

interface Top5LimitModalProps {
  onClose: () => void;
  onMoveToUrgent: () => void;
  onReplace: (taskId: string) => void;
  top5Tasks: Task[];
}

const Top5LimitModal: React.FC<Top5LimitModalProps> = ({ onClose, onMoveToUrgent, onReplace, top5Tasks }) => {
  const [selectedTaskToReplace, setSelectedTaskToReplace] = useState<string | null>(null);

  const handleReplace = () => {
    if (selectedTaskToReplace) {
      onReplace(selectedTaskToReplace);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-gray-900 p-6 rounded-lg shadow-xl w-full max-w-lg mx-4">
        <h2 className="text-2xl font-bold text-white mb-4">Top 5 Task Limit Reached</h2>
        <p className="text-gray-300 mb-6">You can only have 5 tasks in 'Top 5'. What would you like to do?</p>
        <div className="space-y-4">
          <button onClick={onMoveToUrgent} className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500">
            Move New Task to Urgent
          </button>
          <div>
            <h3 className="text-lg font-bold text-white mb-2">Or Replace an Existing Task:</h3>
            <div className="space-y-2">
              {top5Tasks.map(task => (
                <div key={task.id} className={`flex items-center p-2 rounded cursor-pointer ${selectedTaskToReplace === task.id ? 'bg-blue-500' : 'bg-gray-800'}`} onClick={() => setSelectedTaskToReplace(task.id)}>
                  <input type="radio" name="replace-task" value={task.id} checked={selectedTaskToReplace === task.id} onChange={() => setSelectedTaskToReplace(task.id)} className="mr-2" />
                  <label htmlFor={task.id} className="text-white">{task.text}</label>
                </div>
              ))}
            </div>
            <button onClick={handleReplace} disabled={!selectedTaskToReplace} className="w-full mt-4 px-4 py-2 bg-red-600 text-white rounded disabled:bg-gray-500 hover:bg-red-500">
              Replace Selected Task
            </button>
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <button onClick={onClose} className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default Top5LimitModal;
