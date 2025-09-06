import React from 'react';
import { BookOpen, Clock, Trophy, TrendingUp, Target, Calendar } from 'lucide-react';

interface DashboardStatsProps {
  onNavigateToCategories: () => void;
}

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  subtitle: string;
  color: string;
}

function StatCard({ icon, title, value, subtitle, color }: StatCardProps) {
  return (
    <div className="bg-[#1B263B] rounded-xl p-6 hover:bg-[#415A77] transition-all duration-300 hover:scale-105 hover:shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${color}`}>
          {icon}
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-[#E0E1DD]">{value}</p>
          <p className="text-sm text-[#778DA9]">{title}</p>
        </div>
      </div>
      <p className="text-xs text-[#778DA9]">{subtitle}</p>
    </div>
  );
}

interface ProgressRingProps {
  percentage: number;
  size: number;
  strokeWidth: number;
  color: string;
}

function ProgressRing({ percentage, size, strokeWidth, color }: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = `${circumference} ${circumference}`;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#415A77"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xl font-bold text-[#E0E1DD]">{percentage}%</span>
      </div>
    </div>
  );
}

export function DashboardStats({ onNavigateToCategories }: DashboardStatsProps) {
  const stats = [
    {
      icon: <BookOpen className="w-6 h-6 text-white" />,
      title: 'Courses Enrolled',
      value: '12',
      subtitle: '3 completed this month',
      color: 'bg-blue-500'
    },
    {
      icon: <Clock className="w-6 h-6 text-white" />,
      title: 'Study Hours',
      value: '47h',
      subtitle: '8h more than last week',
      color: 'bg-purple-500'
    },
    {
      icon: <Trophy className="w-6 h-6 text-white" />,
      title: 'Achievements',
      value: '23',
      subtitle: '5 new badges earned',
      color: 'bg-yellow-500'
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-white" />,
      title: 'Average Score',
      value: '87%',
      subtitle: '+5% from last month',
      color: 'bg-green-500'
    }
  ];

  const recentActivity = [
    { course: 'Ancient Egyptian Civilization', action: 'Completed Scene 5', time: '2 hours ago' },
    { course: 'Quantum Physics Fundamentals', action: 'Started new lesson', time: '1 day ago' },
    { course: 'Renaissance Art & Culture', action: 'Earned achievement', time: '2 days ago' },
    { course: 'Molecular Biology Basics', action: 'Completed quiz', time: '3 days ago' }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-[#1B263B] to-[#415A77] rounded-xl p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#E0E1DD] mb-2">Welcome back, Amr!</h1>
            <p className="text-[#778DA9] text-lg">Ready to continue your 3D learning journey?</p>
          </div>
          <div className="hidden md:block">
            <ProgressRing percentage={73} size={120} strokeWidth={8} color="#60A5FA" />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            icon={stat.icon}
            title={stat.title}
            value={stat.value}
            subtitle={stat.subtitle}
            color={stat.color}
          />
        ))}
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Progress */}
        <div className="bg-[#1B263B] rounded-xl p-6">
          <h3 className="text-xl font-semibold text-[#E0E1DD] mb-6 flex items-center">
            <Target className="w-5 h-5 mr-2" />
            Weekly Goals
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-[#778DA9]">Study Time</span>
                <span className="text-[#E0E1DD]">12h / 15h</span>
              </div>
              <div className="w-full bg-[#415A77] rounded-full h-2">
                <div className="h-2 rounded-full bg-blue-500 transition-all duration-500" style={{ width: '80%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-[#778DA9]">Lessons Completed</span>
                <span className="text-[#E0E1DD]">8 / 10</span>
              </div>
              <div className="w-full bg-[#415A77] rounded-full h-2">
                <div className="h-2 rounded-full bg-green-500 transition-all duration-500" style={{ width: '80%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-[#778DA9]">Quiz Scores</span>
                <span className="text-[#E0E1DD]">85% avg</span>
              </div>
              <div className="w-full bg-[#415A77] rounded-full h-2">
                <div className="h-2 rounded-full bg-purple-500 transition-all duration-500" style={{ width: '85%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-[#1B263B] rounded-xl p-6">
          <h3 className="text-xl font-semibold text-[#E0E1DD] mb-6 flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            Recent Activity
          </h3>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm text-[#E0E1DD] font-medium">{activity.course}</p>
                  <p className="text-xs text-[#778DA9]">{activity.action}</p>
                  <p className="text-xs text-[#778DA9] opacity-75">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-[#1B263B] rounded-xl p-6">
        <h3 className="text-xl font-semibold text-[#E0E1DD] mb-6">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            onClick={onNavigateToCategories}
            className="bg-[#415A77] hover:bg-[#778DA9] rounded-lg p-4 transition-colors text-left"
          >
            <BookOpen className="w-6 h-6 text-[#E0E1DD] mb-2" />
            <p className="text-[#E0E1DD] font-medium">Browse Courses</p>
            <p className="text-[#778DA9] text-sm">Explore new subjects</p>
          </button>
          <button className="bg-[#415A77] hover:bg-[#778DA9] rounded-lg p-4 transition-colors text-left">
            <Trophy className="w-6 h-6 text-[#E0E1DD] mb-2" />
            <p className="text-[#E0E1DD] font-medium">View Achievements</p>
            <p className="text-[#778DA9] text-sm">Check your progress</p>
          </button>
          <button className="bg-[#415A77] hover:bg-[#778DA9] rounded-lg p-4 transition-colors text-left">
            <TrendingUp className="w-6 h-6 text-[#E0E1DD] mb-2" />
            <p className="text-[#E0E1DD] font-medium">Study Plan</p>
            <p className="text-[#778DA9] text-sm">Customize your schedule</p>
          </button>
        </div>
      </div>
    </div>
  );
}