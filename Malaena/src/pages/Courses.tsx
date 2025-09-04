import { useParams, useNavigate } from 'react-router-dom';
import { CoursesGrid } from '../components/CoursesGrid';
import { coursesData } from '../data/coursesData';

export function Courses() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();

  const categoryData = categoryId ? coursesData[categoryId] : null;

  const handleBackToCategories = () => {
    navigate('/categories');
  };

  const handleCourseSelect = (courseId: string) => {
    navigate(`/lesson/${courseId}`);
  };

  if (!categoryData) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-[#778DA9]">Category not found</p>
      </div>
    );
  }

  return (
    <CoursesGrid
      categoryName={categoryData.name}
      courses={categoryData.courses}
      onBack={handleBackToCategories}
      onCourseSelect={handleCourseSelect}
    />
  );
}