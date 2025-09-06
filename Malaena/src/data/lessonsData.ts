interface Scene {
    id: number;
    title: string;
    content: string;
    sceneType: 'pyramid' | 'atom' | 'dna' | 'solar-system';
  }
  
  interface Lesson {
    id: string;
    title: string;
    scenes: Scene[];
  }
  
  export const lessonsData: Record<string, Lesson> = {
    '1': {
      id: '1',
      title: 'Ancient Egyptian Civilization',
      scenes: [
        {
          id: 1,
          title: 'Introduction to Ancient Egypt',
          content: 'Ancient Egypt was one of the world\'s greatest civilizations, flourishing along the Nile River for over 3,000 years. The civilization is famous for its monumental architecture, including the iconic pyramids that still stand today as testaments to their engineering prowess.',
          sceneType: 'pyramid'
        },
        {
          id: 2,
          title: 'The Great Pyramid Construction',
          content: 'The Great Pyramid of Giza, built around 2580-2560 BCE, was constructed using over 2.3 million stone blocks. Each block weighed between 2.5 to 15 tons. The precision of its construction continues to amaze engineers and archaeologists today.',
          sceneType: 'dna'
        },
        {
          id: 3,
          title: 'Egyptian Society and Culture',
          content: 'Egyptian society was highly stratified, with the Pharaoh at the top, followed by nobles, priests, scribes, craftsmen, and farmers. The Egyptians developed one of the first writing systems, hieroglyphics, and made significant advances in medicine, mathematics, and astronomy.',
          sceneType: 'dna'
        }
      ]
    },
    '5': {
      id: '5',
      title: 'Quantum Physics Fundamentals',
      scenes: [
        {
          id: 1,
          title: 'Introduction to Atomic Structure',
          content: 'Atoms are the fundamental building blocks of matter. They consist of a nucleus containing protons and neutrons, surrounded by electrons in orbital shells. Understanding atomic structure is crucial for comprehending quantum mechanics.',
          sceneType: 'dna'
        },
        {
          id: 2,
          title: 'Electron Orbitals and Energy Levels',
          content: 'Electrons exist in specific energy levels or orbitals around the nucleus. These orbitals have distinct shapes and energy states. When electrons jump between energy levels, they emit or absorb photons of specific wavelengths.',
          sceneType: 'dna'
        },
        {
          id: 3,
          title: 'Quantum Mechanics Principles',
          content: 'Quantum mechanics describes the behavior of matter and energy at the atomic and subatomic level. Key principles include wave-particle duality, uncertainty principle, and quantum superposition, which challenge our classical understanding of physics.',
          sceneType: 'dna'
        }
      ]
    },
    '6': {
      id: '6',
      title: 'Molecular Biology Basics',
      scenes: [
        {
          id: 1,
          title: 'DNA Structure and Function',
          content: 'DNA, or deoxyribonucleic acid, is the hereditary material in all living organisms. It consists of two complementary strands forming a double helix structure, with four bases: adenine, thymine, guanine, and cytosine.',
          sceneType: 'dna'
        },
        {
          id: 2,
          title: 'DNA Replication Process',
          content: 'DNA replication is the process by which DNA makes a copy of itself during cell division. The double helix unwinds, and each strand serves as a template for creating a new complementary strand, ensuring genetic information is passed to daughter cells.',
          sceneType: 'dna'
        },
        {
          id: 3,
          title: 'Genetic Code and Protein Synthesis',
          content: 'The genetic code in DNA is transcribed into RNA and then translated into proteins. This process involves transcription in the nucleus and translation at ribosomes, where amino acids are assembled according to the genetic instructions.',
          sceneType: 'dna'
        }
      ]
    },
    '8': {
      id: '8',
      title: 'Solar System Exploration',
      scenes: [
        {
          id: 1,
          title: 'Our Solar System Overview',
          content: 'Our solar system consists of the Sun, eight planets, their moons, and countless smaller objects like asteroids and comets. It formed approximately 4.6 billion years ago from a collapsing cloud of gas and dust.',
          sceneType: 'solar-system'
        },
        {
          id: 2,
          title: 'Planetary Formation and Characteristics',
          content: 'The planets formed through accretion of material in the early solar system. Inner planets are rocky and small, while outer planets are gas giants. Each planet has unique characteristics shaped by its distance from the Sun and composition.',
          sceneType: 'solar-system'
        },
        {
          id: 3,
          title: 'Space Exploration and Discovery',
          content: 'Human space exploration has revealed incredible details about our solar system. From the Apollo moon landings to Mars rovers and deep space probes, we continue to discover new information about planetary systems and the possibility of life beyond Earth.',
          sceneType: 'solar-system'
        }
      ]
    }
  };