import { CourseCard } from './CourseCard';
import { ChevronLeft } from 'lucide-react';

interface Course {
  id: string;
  title: string;
  progress: number;
  duration: string;
  rating: number;
  thumbnail: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  scenes: number;
}

interface CoursesGridProps {
  categoryName: string;
  courses: Course[];
  onBack: () => void;
  onCourseSelect: (courseId: string) => void;
}

export function CoursesGrid({ categoryName, courses, onBack, onCourseSelect }: CoursesGridProps) {
  return (
    <div>
      <div className="flex items-center mb-8">
        <button
          onClick={onBack}
          className="mr-4 p-2 rounded-lg hover:bg-[#415A77] transition-colors"
          title="Go back"
        >
          <ChevronLeft className="w-5 h-5 text-[#E0E1DD]" />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-[#E0E1DD]">{categoryName} Courses</h2>
          <p className="text-[#778DA9]">{courses.length} courses available</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {courses.map((course) => (
          <CourseCard
            key={course.id}
            id={course.id}
            title={course.title}
            progress={course.progress}
            duration={course.duration}
            rating={course.rating}
            thumbnail={course.thumbnail}
            difficulty={course.difficulty}
            scenes={course.scenes}
            onClick={onCourseSelect}
          />
        ))}
      </div>
    </div>
  );
}