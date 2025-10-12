'use client';

import { useState, useMemo } from 'react';
import { Task } from '@/types';
import TaskForm from '@/components/TaskForm';
import TaskList from '@/components/TaskList';
import FilterControls from '@/components/FilterControls';
import Top5LimitModal from '@/components/Top5LimitModal';
import NotesModal from '@/components/NotesModal';

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<'All' | Task['category']>('All');
  const [showTop5LimitModal, setShowTop5LimitModal] = useState(false);
  const [pendingTask, setPendingTask] = useState<Omit<Task, 'id' | 'notes'> | null>(null);
  const [idCounter, setIdCounter] = useState(0);
  const [editingNotesTask, setEditingNotesTask] = useState<Task | null>(null);

  const categories: Task['category'][] = ['Content', 'Ops', 'Strategy', 'Paid', 'Other'];

  const handleAddTask = (taskData: Omit<Task, 'id' | 'notes'>) => {
    const top5Tasks = tasks.filter(t => t.priority === 'Top 5');
    if (taskData.priority === 'Top 5' && top5Tasks.length >= 5) {
      setPendingTask(taskData);
      setShowTop5LimitModal(true);
    } else {
      const newTask: Task = { ...taskData, id: idCounter.toString(), notes: '', completed: false };
      setIdCounter(idCounter + 1);
      setTasks([...tasks, newTask]);
    }
  };

  const handleMoveToUrgent = () => {
    if (pendingTask) {
      const newTask: Task = { ...pendingTask, priority: 'Urgent', id: idCounter.toString(), notes: '', completed: false };
      setIdCounter(idCounter + 1);
      setTasks([...tasks, newTask]);
      setShowTop5LimitModal(false);
      setPendingTask(null);
    }
  };

  const handleReplaceTask = (taskIdToReplace: string) => {
    if (pendingTask) {
      const newTask: Task = { ...pendingTask, id: idCounter.toString(), notes: '', completed: false };
      setIdCounter(idCounter + 1);
      const updatedTasks = tasks.map(t => 
        t.id === taskIdToReplace ? { ...t, priority: 'Urgent' } : t
      );
      setTasks([...updatedTasks, newTask]);
      setShowTop5LimitModal(false);
      setPendingTask(null);
    }
  };

  const handleSaveTask = (updatedTask: Task) => {
    setTasks(tasks.map(task => (task.id === updatedTask.id ? updatedTask : task)));
    setEditingNotesTask(null);
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const handleToggleComplete = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
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
        <FilterControls 
          categories={categories} 
          selectedCategory={selectedCategory} 
          setSelectedCategory={setSelectedCategory} 
        />
        <div className="mt-6">
          <TaskForm onAddTask={handleAddTask} />
        </div>
        <div className="mt-8">
          <TaskList tasks={filteredTasks} onSaveTask={handleSaveTask} onDeleteTask={handleDeleteTask} onEditNotes={handleEditNotes} onToggleComplete={handleToggleComplete} />
        </div>
        {showTop5LimitModal && (
          <Top5LimitModal 
            onClose={() => setShowTop5LimitModal(false)}
            onMoveToUrgent={handleMoveToUrgent}
            onReplace={handleReplaceTask}
            top5Tasks={tasks.filter(t => t.priority === 'Top 5')}
          />
        )}
        {editingNotesTask && (
          <NotesModal 
            task={editingNotesTask}
            onClose={() => setEditingNotesTask(null)}
            onSave={handleSaveTask}
          />
        )}
      </div>
    </main>
  );
}