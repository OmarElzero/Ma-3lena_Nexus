import React from 'react';
import { CategoryCard } from './CategoryCard';
import { BookOpen } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  icon: React.ReactNode;
  courseCount: number;
  completedCourses: number;
}

interface CategoriesGridProps {
  onCategorySelect: (categoryId: string) => void;
}

export function CategoriesGrid({ onCategorySelect }: CategoriesGridProps) {
  const categories: Category[] = [
    {
      id: 'history',
      name: 'History',
      icon: <BookOpen className="w-8 h-8" />,
      courseCount: 12,
      completedCourses: 8
    },
    {
      id: 'science',
      name: 'Science',
      icon: <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-600"></div>,
      courseCount: 18,
      completedCourses: 5
    },
    {
      id: 'mathematics',
      name: 'Mathematics',
      icon: <div className="w-8 h-8 flex items-center justify-center text-2xl font-bold">π</div>,
      courseCount: 15,
      completedCourses: 12
    },
    {
      id: 'literature',
      name: 'Literature',
      icon: <div className="w-8 h-8 flex items-center justify-center text-xl">📚</div>,
      courseCount: 10,
      completedCourses: 3
    },
    {
      id: 'physics',
      name: 'Physics',
      icon: <div className="w-8 h-8 flex items-center justify-center text-xl">⚛️</div>,
      courseCount: 14,
      completedCourses: 7
    },
    {
      id: 'chemistry',
      name: 'Chemistry',
      icon: <div className="w-8 h-8 flex items-center justify-center text-xl">🧪</div>,
      courseCount: 11,
      completedCourses: 4
    }
  ];

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2 text-[#E0E1DD]">Welcome back!</h2>
        <p className="text-[#778DA9]">Choose a subject to continue your 3D learning journey</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <CategoryCard
            key={category.id}
            id={category.id}
            name={category.name}
            icon={category.icon}
            courseCount={category.courseCount}
            completedCourses={category.completedCourses}
            onClick={onCategorySelect}
          />
        ))}
      </div>
    </div>
  );
}