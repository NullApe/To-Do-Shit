import React from 'react';
import { Task } from '@/types';

interface FilterControlsProps {
  categories: Task['category'][];
  selectedCategory: Task['category'] | 'All';
  setSelectedCategory: (category: Task['category'] | 'All') => void;
}

const FilterControls: React.FC<FilterControlsProps> = ({ categories, selectedCategory, setSelectedCategory }) => {
  const allCategories: (Task['category'] | 'All')[] = ['All', ...categories];

  return (
    <div className="p-4 bg-gray-800">
      <label htmlFor="category-filter" className="text-white mr-2">Filter by Category:</label>
      <select
        id="category-filter"
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value as Task['category'] | 'All')}
        className="bg-gray-700 text-white p-2 rounded"
      >
        {allCategories.map(category => (
          <option key={category} value={category}>{category}</option>
        ))}
      </select>
    </div>
  );
};

export default FilterControls;
