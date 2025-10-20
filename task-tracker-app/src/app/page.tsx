
'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { Task } from '@/types';
import TaskList from '@/components/TaskList';
import FilterControls from '@/components/FilterControls';
import Top5LimitModal from '@/components/Top5LimitModal';
import NotesModal from '@/components/NotesModal';
import DeleteConfirmModal from '@/components/DeleteConfirmModal';

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState<'Work' | 'Projects' | 'Personal'>('Work');
  const [selectedCategory, setSelectedCategory] = useState<'All' | Task['category']>('All');
  const [showTop5LimitModal, setShowTop5LimitModal] = useState(false);
  const [pendingTask, setPendingTask] = useState<Omit<Task, 'id' | 'notes'> | null>(null);
  const [pendingTaskId, setPendingTaskId] = useState<string | null>(null);
  const [editingNotesTask, setEditingNotesTask] = useState<Task | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

  const fetchTasks = useCallback(async () => {
    console.log('Fetching tasks for workspace:', selectedWorkspace);
    const res = await fetch(`/api/tasks?workspace=${selectedWorkspace}`);
    const data = await res.json();
    console.log('Fetched data:', data);
    const tasksArray = (data && typeof data === 'object' ? Object.values(data) : []) as Task[];
    console.log('Tasks array:', tasksArray);
    setTasks(tasksArray);
  }, [selectedWorkspace]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const categories: Task['category'][] = ['Content', 'Ops', 'Strategy', 'Paid', 'Other'];


  const handleAddTask = async (taskData: Omit<Task, 'id' | 'notes' | 'workspace'>) => {
    console.log('Adding task:', taskData);
    const top5Tasks = tasks.filter(t => t.priority === 'Top 5' && !t.completed);
    if (taskData.priority === 'Top 5' && top5Tasks.length >= 5) {
      setPendingTask({ ...taskData, workspace: selectedWorkspace });
      setShowTop5LimitModal(true);
    } else {
      const taskToSave = { ...taskData, workspace: selectedWorkspace, notes: '', completed: false };
      console.log('Sending task to API:', taskToSave);
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task: taskToSave }),
      });
      const result = await response.json();
      console.log('API response:', result);
      await fetchTasks();
    }
  };

  const handleMoveToUrgent = async () => {
    if (pendingTask) {
      if (pendingTaskId) {
        // Updating an existing task
        await fetch(`/api/tasks/${pendingTaskId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ task: { ...pendingTask, id: pendingTaskId, priority: 'Urgent', notes: tasks.find(t => t.id === pendingTaskId)?.notes || '' } }),
        });
      } else {
        // Creating a new task
        await fetch('/api/tasks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ task: { ...pendingTask, priority: 'Urgent', notes: '', completed: false } }),
        });
      }
      await fetchTasks();
      setShowTop5LimitModal(false);
      setPendingTask(null);
      setPendingTaskId(null);
    }
  };

  const handleReplaceTask = async (taskIdToReplace: string) => {
    if (pendingTask) {
      const taskToUpdate = tasks.find(t => t.id === taskIdToReplace);
      if (taskToUpdate) {
        await fetch(`/api/tasks/${taskIdToReplace}`,
          {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ task: { ...taskToUpdate, priority: 'Urgent' } }),
          }
        );
      }

      if (pendingTaskId) {
        // Updating an existing task - move it to Top 5
        await fetch(`/api/tasks/${pendingTaskId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ task: { ...pendingTask, id: pendingTaskId, notes: tasks.find(t => t.id === pendingTaskId)?.notes || '' } }),
        });
      } else {
        // Creating a new task
        await fetch('/api/tasks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ task: { ...pendingTask, notes: '', completed: false } }),
        });
      }

      await fetchTasks();
      setShowTop5LimitModal(false);
      setPendingTask(null);
      setPendingTaskId(null);
    }
  };

  const handleSaveTask = async (updatedTask: Task) => {
    const originalTask = tasks.find(t => t.id === updatedTask.id);
    const currentTop5Tasks = tasks.filter(t => t.priority === 'Top 5' && t.id !== updatedTask.id && !t.completed);

    // Check if task is being moved INTO Top 5 from another priority and Top 5 is currently full
    if (originalTask &&
        originalTask.priority !== 'Top 5' &&
        updatedTask.priority === 'Top 5' &&
        currentTop5Tasks.length >= 5) {
      // Show the Top 5 limit modal
      setPendingTask({
        text: updatedTask.text,
        priority: updatedTask.priority,
        dropDead: updatedTask.dropDead,
        category: updatedTask.category,
        workspace: updatedTask.workspace,
        completed: updatedTask.completed
      });
      setPendingTaskId(updatedTask.id);
      setShowTop5LimitModal(true);
      // Revert the task change in local state
      return;
    }

    await fetch(`/api/tasks/${updatedTask.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ task: updatedTask }),
    });
    setTasks(tasks.map(task => (task.id === updatedTask.id ? updatedTask : task)));
    setEditingNotesTask(null);
  };

  const handleDeleteTask = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      setTaskToDelete(task);
    }
  };

  const confirmDeleteTask = async () => {
    if (taskToDelete) {
      await fetch(`/api/tasks/${taskToDelete.id}?workspace=${selectedWorkspace}`, {
        method: 'DELETE',
      });
      setTasks(tasks.filter(task => task.id !== taskToDelete.id));
      setTaskToDelete(null);
    }
  };

  const handleToggleComplete = async (taskId: string) => {
    const taskToUpdate = tasks.find(task => task.id === taskId);
    if (taskToUpdate) {
      const updatedTask = { ...taskToUpdate, completed: !taskToUpdate.completed };
      await fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task: updatedTask }),
      });
      setTasks(tasks.map(task =>
        task.id === taskId ? updatedTask : task
      ));
    }
  };

  const handleMoveTask = async (taskId: string, newPriority: Task['priority']) => {
    const taskToUpdate = tasks.find(task => task.id === taskId);
    if (taskToUpdate && taskToUpdate.priority !== newPriority) {
      const updatedTask = { ...taskToUpdate, priority: newPriority };
      await handleSaveTask(updatedTask);
    }
  };

  const handleEditNotes = (task: Task) => {
    setEditingNotesTask(task);
  };

  const filteredTasks = useMemo(() => {
    if (selectedCategory === 'All') {
      return tasks;
    }
    return tasks.filter(task => task.category === selectedCategory);
  }, [tasks, selectedCategory]);

  return (
    <main className="bg-gray-900 text-white min-h-screen p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-center">Task Tracker</h1>

        {/* Workspace Tabs */}
        <div className="flex justify-center mb-6 gap-2">
          {(['Work', 'Projects', 'Personal'] as const).map((workspace) => (
            <button
              key={workspace}
              onClick={() => setSelectedWorkspace(workspace)}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                selectedWorkspace === workspace
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {workspace}
            </button>
          ))}
        </div>

        <FilterControls
          categories={categories}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />
        <div className="mt-8">
          <TaskList tasks={filteredTasks} onSaveTask={handleSaveTask} onDeleteTask={handleDeleteTask} onEditNotes={handleEditNotes} onToggleComplete={handleToggleComplete} onMoveTask={handleMoveTask} onAddTask={handleAddTask} />
        </div>
        {showTop5LimitModal && (
          <Top5LimitModal
            onClose={() => setShowTop5LimitModal(false)}
            onMoveToUrgent={handleMoveToUrgent}
            onReplace={handleReplaceTask}
            top5Tasks={tasks.filter(t => t.priority === 'Top 5' && !t.completed)}
          />
        )}
        {editingNotesTask && (
          <NotesModal
            task={editingNotesTask}
            onClose={() => setEditingNotesTask(null)}
            onSave={handleSaveTask}
          />
        )}
        {taskToDelete && (
          <DeleteConfirmModal
            task={taskToDelete}
            onClose={() => setTaskToDelete(null)}
            onConfirm={confirmDeleteTask}
          />
        )}
      </div>
    </main>
  );
}