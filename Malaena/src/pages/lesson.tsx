import { useParams, useNavigate } from 'react-router-dom';
import { LessonViewer } from '../components/lesson/LessonViewer';
import { lessonsData } from '../data/lessonsData';

export function Lesson() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();

  const lessonData = courseId ? lessonsData[courseId] : null;

  const handleBack = () => {
    navigate(-1);
    
  };

  if (!lessonData) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-[#778DA9]">Lesson not found</p>
      </div>
    );
  }

  return (
    <LessonViewer
      lessonTitle={lessonData.title}
      scenes={lessonData.scenes}
      onBack={handleBack}
    />
  );
}