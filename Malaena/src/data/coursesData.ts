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
  
  interface CategoryData {
    [key: string]: {
      name: string;
      courses: Course[];
    };
  }
  
  export const coursesData: CategoryData = {
    history: {
      name: 'History',
      courses: [
        {
          id: '1',
          title: 'Ancient Egyptian Civilization',
          progress: 75,
          duration: '45 min',
          rating: 4.8,
          thumbnail: 'https://tse1.mm.bing.net/th/id/OIP.MKpzcB-8N2HxvQcRUUVbPAHaEK?rs=1&pid=ImgDetMain&o=7&rm=3',
          difficulty: 'Intermediate',
          scenes: 8
        },
        {
          id: '2',
          title: 'World War II Timeline',
          progress: 30,
          duration: '60 min',
          rating: 4.9,
          thumbnail: 'https://hips.hearstapps.com/pop.h-cdn.co/assets/16/27/1600x800/landscape-1467820472-wwii-index.jpg?resize=1200:*',
          difficulty: 'Advanced',
          scenes: 12
        },
        {
          id: '3',
          title: 'Renaissance Art & Culture',
          progress: 90,
          duration: '40 min',
          rating: 4.7,
          thumbnail: 'https://images.pexels.com/photos/164527/pexels-photo-164527.jpeg?auto=compress&cs=tinysrgb&w=400',
          difficulty: 'Beginner',
          scenes: 6
        },
        {
          id: '4',
          title: 'Industrial Revolution',
          progress: 0,
          duration: '50 min',
          rating: 4.6,
          thumbnail: 'https://images.pexels.com/photos/5427673/pexels-photo-5427673.jpeg?auto=compress&cs=tinysrgb&w=400',
          difficulty: 'Intermediate',
          scenes: 10
        }
      ]
    },
    science: {
      name: 'Science',
      courses: [
        {
          id: '5',
          title: 'Quantum Physics Fundamentals',
          progress: 60,
          duration: '55 min',
          rating: 4.9,
          thumbnail: 'https://images.pexels.com/photos/256262/pexels-photo-256262.jpeg?auto=compress&cs=tinysrgb&w=400',
          difficulty: 'Advanced',
          scenes: 15
        },
        {
          id: '6',
          title: 'Molecular Biology Basics',
          progress: 45,
          duration: '40 min',
          rating: 4.8,
          thumbnail: 'https://images.pexels.com/photos/2280549/pexels-photo-2280549.jpeg?auto=compress&cs=tinysrgb&w=400',
          difficulty: 'Intermediate',
          scenes: 9
        },
        {
          id: '7',
          title: 'Chemistry Lab Experiments',
          progress: 100,
          duration: '35 min',
          rating: 4.7,
          thumbnail: 'https://images.pexels.com/photos/2280571/pexels-photo-2280571.jpeg?auto=compress&cs=tinysrgb&w=400',
          difficulty: 'Beginner',
          scenes: 7
        },
        {
          id: '8',
          title: 'Solar System Exploration',
          progress: 20,
          duration: '65 min',
          rating: 4.9,
          thumbnail: 'https://images.pexels.com/photos/816608/pexels-photo-816608.jpeg?auto=compress&cs=tinysrgb&w=400',
          difficulty: 'Beginner',
          scenes: 11
        }
      ]
    },
    mathematics: {
      name: 'Mathematics',
      courses: [
        {
          id: '9',
          title: 'Calculus I - Limits & Derivatives',
          progress: 85,
          duration: '50 min',
          rating: 4.6,
          thumbnail: 'https://images.pexels.com/photos/6238095/pexels-photo-6238095.jpeg?auto=compress&cs=tinysrgb&w=400',
          difficulty: 'Advanced',
          scenes: 13
        },
        {
          id: '10',
          title: 'Linear Algebra Visualized',
          progress: 40,
          duration: '45 min',
          rating: 4.7,
          thumbnail: 'https://images.pexels.com/photos/3729557/pexels-photo-3729557.jpeg?auto=compress&cs=tinysrgb&w=400',
          difficulty: 'Intermediate',
          scenes: 10
        },
        {
          id: '11',
          title: 'Statistics & Probability',
          progress: 70,
          duration: '38 min',
          rating: 4.5,
          thumbnail: 'https://images.pexels.com/photos/590041/pexels-photo-590041.jpeg?auto=compress&cs=tinysrgb&w=400',
          difficulty: 'Intermediate',
          scenes: 8
        },
        {
          id: '12',
          title: '3D Geometry Fundamentals',
          progress: 95,
          duration: '42 min',
          rating: 4.8,
          thumbnail: 'https://images.pexels.com/photos/714699/pexels-photo-714699.jpeg?auto=compress&cs=tinysrgb&w=400',
          difficulty: 'Beginner',
          scenes: 9
        }
      ]
    },
    literature: {
      name: 'Literature',
      courses: [
        {
          id: '13',
          title: 'Shakespeare in 3D Theater',
          progress: 55,
          duration: '60 min',
          rating: 4.9,
          thumbnail: 'https://images.pexels.com/photos/289586/pexels-photo-289586.jpeg?auto=compress&cs=tinysrgb&w=400',
          difficulty: 'Advanced',
          scenes: 14
        },
        {
          id: '14',
          title: 'Modern Poetry Analysis',
          progress: 25,
          duration: '35 min',
          rating: 4.6,
          thumbnail: 'https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg?auto=compress&cs=tinysrgb&w=400',
          difficulty: 'Intermediate',
          scenes: 6
        },
        {
          id: '15',
          title: 'World Literature Journey',
          progress: 80,
          duration: '55 min',
          rating: 4.8,
          thumbnail: 'https://images.pexels.com/photos/1130980/pexels-photo-1130980.jpeg?auto=compress&cs=tinysrgb&w=400',
          difficulty: 'Beginner',
          scenes: 12
        },
        {
          id: '16',
          title: 'Creative Writing Workshop',
          progress: 10,
          duration: '40 min',
          rating: 4.7,
          thumbnail: 'https://images.pexels.com/photos/261763/pexels-photo-261763.jpeg?auto=compress&cs=tinysrgb&w=400',
          difficulty: 'Intermediate',
          scenes: 8
        }
      ]
    },
    physics: {
      name: 'Physics',
      courses: [
        {
          id: '17',
          title: 'Newton\'s Laws in Action',
          progress: 65,
          duration: '48 min',
          rating: 4.8,
          thumbnail: 'https://images.pexels.com/photos/220201/pexels-photo-220201.jpeg?auto=compress&cs=tinysrgb&w=400',
          difficulty: 'Intermediate',
          scenes: 11
        },
        {
          id: '18',
          title: 'Electromagnetic Fields',
          progress: 35,
          duration: '52 min',
          rating: 4.7,
          thumbnail: 'https://images.pexels.com/photos/355948/pexels-photo-355948.jpeg?auto=compress&cs=tinysrgb&w=400',
          difficulty: 'Advanced',
          scenes: 13
        }
      ]
    },
    chemistry: {
      name: 'Chemistry',
      courses: [
        {
          id: '19',
          title: 'Molecular Structures 3D',
          progress: 50,
          duration: '43 min',
          rating: 4.6,
          thumbnail: 'https://images.pexels.com/photos/2280571/pexels-photo-2280571.jpeg?auto=compress&cs=tinysrgb&w=400',
          difficulty: 'Intermediate',
          scenes: 9
        },
        {
          id: '20',
          title: 'Chemical Reactions Lab',
          progress: 15,
          duration: '38 min',
          rating: 4.8,
          thumbnail: 'https://images.pexels.com/photos/954585/pexels-photo-954585.jpeg?auto=compress&cs=tinysrgb&w=400',
          difficulty: 'Beginner',
          scenes: 7
        }
      ]
    }
  };