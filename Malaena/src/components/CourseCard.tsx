import { Clock, Play, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CourseCardProps {
  id: string;
  title: string;
  progress: number;
  duration: string;
  thumbnail: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  scenes: number;
}

export function CourseCard({ 
  id, 
  title, 
  progress, 
  duration, 
  thumbnail, 
  difficulty,
  scenes
}: CourseCardProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/lesson/${id}`);
  };

  const getProgressColor = (progress: number) => {
    if (progress === 100) return 'bg-green-500';
    if (progress >= 70) return 'bg-blue-500';
    if (progress >= 40) return 'bg-yellow-500';
    return 'bg-gray-500';
  };

  const getProgressText = (progress: number) => {
    if (progress === 0) return 'Not Started';
    if (progress === 100) return 'Completed';
    return `${progress}% Complete`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div
      onClick={handleClick}
      className="bg-[#1B263B] rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl group cursor-pointer"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={thumbnail}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 backdrop-blur-sm bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="bg-white/20 rounded-full p-4">
            <Play className="w-10 h-10 text-white" />
          </div>
        </div>
        {progress === 100 && (
          <div className="absolute top-3 left-3 bg-green-500 rounded-full p-1">
            <CheckCircle className="w-4 h-4 text-white" />
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(difficulty)}`}>
            {difficulty}
          </span>
          <span className="text-xs text-[#778DA9]">{scenes} scenes</span>
        </div>

        <h3 className="text-lg font-semibold mb-2 text-[#E0E1DD] line-clamp-2 group-hover:text-white transition-colors">
          {title}
        </h3>

        <div className="flex items-center text-sm text-[#778DA9] mb-3">
          <Clock className="w-4 h-4 mr-1" />
          {duration}
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-[#778DA9]">Progress</span>
            <span className={`font-medium ${
              progress === 100 ? 'text-green-400' : 
              progress > 0 ? 'text-blue-400' : 'text-gray-400'
            }`}>
              {getProgressText(progress)}
            </span>
          </div>

          <div className="w-full bg-[#415A77] rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-500 ${getProgressColor(progress)}`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
