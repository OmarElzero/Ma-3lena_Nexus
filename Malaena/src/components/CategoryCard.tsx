interface CategoryCardProps {
  id: string;
  name: string;
  icon: React.ReactNode;
  courseCount: number;
  completedCourses: number;
  onClick: (id: string) => void;
}
export function CategoryCard({ id, name, icon, courseCount, completedCourses, onClick }: CategoryCardProps) {
  const completionPercentage = Math.round((completedCourses / courseCount) * 100);

  return (
    <button
      onClick={() => onClick(id)}
      className="bg-[#1B263B] rounded-xl p-6 hover:bg-[#415A77] transition-all duration-300 hover:scale-105 hover:shadow-xl group w-full"
    >
      <div className="flex flex-col items-center text-center">
        <div className="mb-4 p-4 rounded-full bg-[#415A77] group-hover:bg-[#778DA9] transition-colors">
          {icon}
        </div>
        <h3 className="text-xl font-semibold mb-2 text-[#E0E1DD]">{name}</h3>
        <p className="text-[#778DA9] text-sm mb-3">
          {courseCount} courses available
        </p>
        <div className="w-full">
          <div className="flex justify-between text-xs text-[#778DA9] mb-1">
            <span>Progress</span>
            <span>{completionPercentage}%</span>
          </div>
          <div className="w-full bg-[#0D1B2A] rounded-full h-2">
            <div
              className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-500"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
          <p className="text-xs text-[#778DA9] mt-1">
            {completedCourses} of {courseCount} completed
          </p>
        </div>
      </div>
    </button>
  );
}