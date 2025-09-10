import { Edit2, Github, Linkedin, Twitter, BookOpen } from 'lucide-react';

export default function Profile() {
  const user = {
    name: "Amr Khaled",
    email: "amr@example.com",
    age: 22,
    role: "Student",
    joined: "2024-01-01",
    avatar: "https://images.unsplash.com/photo-1623582854588-d60de57fa33f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fGF2YXRhcnN8ZW58MHx8MHx8fDA%3D",
    skills: ["JavaScript", "React", "Tailwind CSS", "Python", "C++"],
    social: {
      github: "https://github.com/amrkhaled",
      linkedin: "https://linkedin.com/in/amrkhaled",
      twitter: "https://twitter.com/amrkhaled",
    },
    recentActivity: [
      { title: "Completed React Course", date: "2025-08-05" },
      { title: "Published Blog on AI", date: "2025-07-28" },
      { title: "Joined Open Source Project", date: "2025-07-15" },
    ],
  };

  return (
      <div className="p-6 bg-[#0F1C2E] min-h-screen text-[#E0E1DD] flex flex-col items-center space-y-8">

        {/* Profile Card */}
        <div className="relative bg-[#1B263B] p-8 rounded-3xl shadow-xl flex flex-col lg:flex-row items-center lg:items-start gap-10 w-full max-w-5xl border border-[#415A77] hover:shadow-2xl transition-shadow duration-300">

          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <img
                src={user.avatar}
                alt={user.name}
                className="w-36 h-36 rounded-full object-cover border-4 border-[#415A77] shadow-md"
            />
            {/* Edit Icon */}
            <button className="absolute bottom-0 right-0 bg-[#415A77] hover:bg-[#778DA9] p-2 rounded-full shadow-md transition-transform transform hover:scale-110">
              <Edit2 className="w-5 h-5 text-[#E0E1DD]" />
            </button>
          </div>

          {/* User Info */}
          <div className="flex-1 space-y-4">
            <div className="flex justify-between items-center">
              <h1 className="text-4xl font-extrabold">{user.name}</h1>
              <button className="bg-[#415A77] hover:bg-[#778DA9] p-2 rounded-full shadow-md transition-transform transform hover:scale-110">
                <Edit2 className="w-5 h-5 text-[#E0E1DD]" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <p><span className="font-semibold text-[#778DA9]">Email:</span> {user.email}</p>
              <p><span className="font-semibold text-[#778DA9]">Age:</span> {user.age}</p>
              <p><span className="font-semibold text-[#778DA9]">Role:</span> {user.role}</p>
              <p><span className="font-semibold text-[#778DA9]">Member Since:</span> {user.joined}</p>
            </div>

            {/* Social Links */}
            <div className="flex space-x-4 mt-2">
              <a href={user.social.github} target="_blank" className="p-2 bg-[#415A77] hover:bg-[#778DA9] rounded-full transition transform hover:scale-110">
                <Github className="w-5 h-5 text-[#E0E1DD]" />
              </a>
              <a href={user.social.linkedin} target="_blank" className="p-2 bg-[#415A77] hover:bg-[#778DA9] rounded-full transition transform hover:scale-110">
                <Linkedin className="w-5 h-5 text-[#E0E1DD]" />
              </a>
              <a href={user.social.twitter} target="_blank" className="p-2 bg-[#415A77] hover:bg-[#778DA9] rounded-full transition transform hover:scale-110">
                <Twitter className="w-5 h-5 text-[#E0E1DD]" />
              </a>
            </div>

            {/* Skills */}
            <div className="mt-4">
              <h2 className="text-xl font-bold mb-2">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {user.skills.map((skill) => (
                    <span key={skill} className="bg-[#415A77] px-3 py-1 rounded-full text-sm font-semibold hover:bg-[#778DA9] transition">
                  {skill}
                </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* About Section */}
        <div className="bg-[#1B263B] p-6 rounded-3xl shadow-xl w-full max-w-5xl border border-[#415A77] hover:shadow-2xl transition-shadow duration-300">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">About</h2>
            <button className="bg-[#415A77] hover:bg-[#778DA9] p-2 rounded-full shadow-md transition-transform transform hover:scale-110">
              <Edit2 className="w-5 h-5 text-[#E0E1DD]" />
            </button>
          </div>
          <p className="text-[#778DA9] leading-relaxed">
            This is your profile page. You can add more user details here like contact information, achievements, enrolled courses, or any other relevant data. Everything is editable using the edit buttons.
          </p>
        </div>

        {/* Recent Activity Section */}
        <div className="bg-[#1B263B] p-6 rounded-3xl shadow-xl w-full max-w-5xl border border-[#415A77] hover:shadow-2xl transition-shadow duration-300">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Recent Activity</h2>
            <button className="bg-[#415A77] hover:bg-[#778DA9] p-2 rounded-full shadow-md transition-transform transform hover:scale-110">
              <BookOpen className="w-5 h-5 text-[#E0E1DD]" />
            </button>
          </div>
          <ul className="space-y-3">
            {user.recentActivity.map((activity, index) => (
                <li key={index} className="bg-[#415A77] p-4 rounded-xl hover:bg-[#778DA9] transition flex justify-between items-center">
                  <span>{activity.title}</span>
                  <span className="text-sm text-[#E0E1DD]/70">{activity.date}</span>
                </li>
            ))}
          </ul>
        </div>

      </div>
  );
}
