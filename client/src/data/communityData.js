// Dummy data for communities based on the Community model
export const communities = [
  {
    _id: "comm001",
    name: "Physics Enthusiasts",
    slug: "physics-enthusiasts",
    description: "A community for students passionate about physics. Discuss theories, experiments, and concepts from classical mechanics to quantum physics.",
    shortDescription: "Explore the fascinating world of physics together",
    grade: "12",
    subject: "Physics",
    categories: ["science", "physics", "academics"],
    avatar: "https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=800&auto=format&fit=crop",
    banner: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=1600&auto=format&fit=crop",
    stats: {
      memberCount: 156,
      postCount: 75,
      dailyActiveUsers: 42
    },
    metadata: {
      trendingScore: 92,
      popularityRank: 2
    },
    isVerified: true,
    featuredPosts: [
      {
        _id: "post001",
        title: "Understanding Quantum Entanglement",
        author: "Priya Sharma",
        content: "Quantum entanglement occurs when...",
        likes: 45,
        comments: 23,
        createdAt: "2025-04-10T14:30:00Z"
      }
    ]
  },
  {
    _id: "comm002",
    name: "Math Problem Solvers",
    slug: "math-problem-solvers",
    description: "Stuck on a tough math problem? Join our community where students help each other tackle challenging mathematics from algebra to calculus.",
    shortDescription: "Collaborative mathematics problem solving",
    grade: "11",
    subject: "Mathematics",
    categories: ["math", "problem-solving", "academics"],
    avatar: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&auto=format&fit=crop",
    banner: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=1600&auto=format&fit=crop",
    stats: {
      memberCount: 213,
      postCount: 128,
      dailyActiveUsers: 67
    },
    metadata: {
      trendingScore: 88,
      popularityRank: 3
    },
    isVerified: true,
    featuredPosts: [
      {
        _id: "post002",
        title: "Solving Differential Equations Made Simple",
        author: "Rahul Verma",
        content: "Here's a step-by-step approach...",
        likes: 62,
        comments: 31,
        createdAt: "2025-04-15T09:45:00Z"
      }
    ]
  },
  {
    _id: "comm003",
    name: "Chemistry Lab",
    slug: "chemistry-lab",
    description: "Discuss chemical reactions, molecular structures, periodic table trends, and lab experiment tips with fellow chemistry students.",
    shortDescription: "Your virtual chemistry laboratory community",
    grade: "12",
    subject: "Chemistry",
    categories: ["science", "chemistry", "academics", "lab"],
    avatar: "https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?w=800&auto=format&fit=crop",
    banner: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=1600&auto=format&fit=crop",
    stats: {
      memberCount: 143,
      postCount: 89,
      dailyActiveUsers: 38
    },
    metadata: {
      trendingScore: 78,
      popularityRank: 5
    },
    isVerified: true,
    featuredPosts: [
      {
        _id: "post003",
        title: "Understanding Redox Reactions",
        author: "Ananya Gupta",
        content: "Reduction-oxidation reactions involve...",
        likes: 31,
        comments: 19,
        createdAt: "2025-04-14T11:20:00Z"
      }
    ]
  },
  {
    _id: "comm004",
    name: "Computer Science Hub",
    slug: "computer-science-hub",
    description: "A community for coding enthusiasts. Share programming tips, discuss algorithms, ask for help with code, and showcase your projects.",
    shortDescription: "Code, collaborate, and learn together",
    grade: "college",
    subject: "Computer Science",
    categories: ["programming", "technology", "coding", "compsci"],
    avatar: "https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?w=800&auto=format&fit=crop",
    banner: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=1600&auto=format&fit=crop",
    stats: {
      memberCount: 289,
      postCount: 176,
      dailyActiveUsers: 94
    },
    metadata: {
      trendingScore: 97,
      popularityRank: 1
    },
    isVerified: true,
    featuredPosts: [
      {
        _id: "post004",
        title: "Introduction to Graph Algorithms",
        author: "Dev Patel",
        content: "Graph algorithms are fundamental to...",
        likes: 78,
        comments: 42,
        createdAt: "2025-04-21T15:10:00Z"
      }
    ]
  },
  {
    _id: "comm005",
    name: "Literature Circle",
    slug: "literature-circle",
    description: "Discuss classic and contemporary literature, poetry analysis, writing techniques, and share your own creative writing with peers.",
    shortDescription: "For the love of literature and writing",
    grade: "11",
    subject: "English Literature",
    categories: ["literature", "writing", "humanities"],
    avatar: "https://images.unsplash.com/photo-1530538987395-032d1800fdd4?w=800&auto=format&fit=crop",
    banner: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=1600&auto=format&fit=crop",
    stats: {
      memberCount: 176,
      postCount: 104,
      dailyActiveUsers: 45
    },
    metadata: {
      trendingScore: 82,
      popularityRank: 4
    },
    isVerified: true,
    featuredPosts: [
      {
        _id: "post005",
        title: "Analyzing Symbolism in The Great Gatsby",
        author: "Kavya Mehta",
        content: "The green light represents...",
        likes: 54,
        comments: 37,
        createdAt: "2025-04-18T10:15:00Z"
      }
    ]
  },
  {
    _id: "comm006",
    name: "History Explorers",
    slug: "history-explorers",
    description: "Journey through time as we explore historical events, figures, and civilizations. Perfect for history enthusiasts and students studying for exams.",
    shortDescription: "Discover and discuss our shared past",
    grade: "10",
    subject: "History",
    categories: ["history", "humanities", "social-studies"],
    avatar: "https://images.unsplash.com/photo-1461360228754-6e81c478b882?w=800&auto=format&fit=crop",
    banner: "https://images.unsplash.com/photo-1447069387593-a5de0862481e?w=1600&auto=format&fit=crop",
    stats: {
      memberCount: 142,
      postCount: 87,
      dailyActiveUsers: 36
    },
    metadata: {
      trendingScore: 75,
      popularityRank: 6
    },
    isVerified: true,
    featuredPosts: [
      {
        _id: "post006",
        title: "The Fall of Rome: Causes and Effects",
        author: "Aryan Malhotra",
        content: "The Roman Empire's collapse was triggered by...",
        likes: 48,
        comments: 29,
        createdAt: "2025-04-12T16:30:00Z"
      }
    ]
  }
];

export const posts = [
  {
    _id: "post001",
    title: "Understanding Quantum Entanglement",
    content: "Quantum entanglement is one of the most fascinating phenomena in quantum physics. When two particles become entangled, the quantum state of each particle cannot be described independently of the other. Instead, a quantum state must be described for the system as a whole. This leads to correlations between the observable physical properties of the systems. I'd love to hear your thoughts on this concept!",
    author: {
      _id: "user001",
      name: "Priya Sharma",
      profilePicture: "https://randomuser.me/api/portraits/women/44.jpg"
    },
    community: "comm001",
    createdAt: "2025-04-10T14:30:00Z",
    likes: 45,
    comments: [
      {
        _id: "comment001",
        content: "Great explanation! The implications for quantum computing are enormous.",
        author: {
          name: "Rahul Verma",
          profilePicture: "https://randomuser.me/api/portraits/men/32.jpg"
        },
        createdAt: "2025-04-10T15:45:00Z"
      },
      {
        _id: "comment002",
        content: "I'm still trying to wrap my head around this concept. Does it really mean information travels faster than light?",
        author: {
          name: "Kavya Mehta",
          profilePicture: "https://randomuser.me/api/portraits/women/22.jpg"
        },
        createdAt: "2025-04-10T16:30:00Z"
      }
    ],
    tags: ["quantum physics", "physics", "science"]
  },
  {
    _id: "post002",
    title: "Solving Differential Equations Made Simple",
    content: "Many students find differential equations intimidating, but they don't have to be! Here's my step-by-step approach to solving first-order differential equations: 1. Identify the type of equation (separable, linear, exact, etc.). 2. Choose the appropriate solution method. 3. Solve and check your answer. I've attached some example problems below. What methods do you use?",
    author: {
      _id: "user002",
      name: "Rahul Verma",
      profilePicture: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    community: "comm002",
    createdAt: "2025-04-15T09:45:00Z",
    likes: 62,
    comments: [
      {
        _id: "comment003",
        content: "This is so helpful! Could you explain the integrating factor method a bit more?",
        author: {
          name: "Dev Patel",
          profilePicture: "https://randomuser.me/api/portraits/men/12.jpg"
        },
        createdAt: "2025-04-15T10:30:00Z"
      }
    ],
    tags: ["mathematics", "differential equations", "calculus"]
  },
  {
    _id: "post003",
    title: "Need help with this chemistry problem!",
    content: "I'm working on balancing this redox reaction but I'm stuck: KMnO4 + HCl → KCl + MnCl2 + H2O + Cl2. Can anyone help me identify the oxidizing and reducing agents and balance this properly?",
    author: {
      _id: "user003",
      name: "Ananya Gupta",
      profilePicture: "https://randomuser.me/api/portraits/women/65.jpg"
    },
    community: "comm003",
    createdAt: "2025-04-22T13:15:00Z",
    likes: 18,
    comments: [
      {
        _id: "comment004",
        content: "The oxidizing agent is KMnO4 (manganese is reduced from +7 to +2) and the reducing agent is HCl (chlorine is oxidized from -1 to 0 in Cl2). I'll walk you through the balancing...",
        author: {
          name: "Aryan Malhotra",
          profilePicture: "https://randomuser.me/api/portraits/men/54.jpg"
        },
        createdAt: "2025-04-22T13:45:00Z"
      }
    ],
    tags: ["chemistry", "redox", "help needed"]
  }
];

export const recommendedCommunities = [
  {
    _id: "comm007",
    name: "Biology Basics",
    slug: "biology-basics",
    description: "From cell structure to genetics and evolution - discuss all biology topics here.",
    shortDescription: "Explore the science of life",
    grade: "10",
    subject: "Biology",
    memberCount: 187,
    avatar: "https://images.unsplash.com/photo-1530210124550-912dc1381cb8?w=800&auto=format&fit=crop"
  },
  {
    _id: "comm008",
    name: "Economics Exchange",
    slug: "economics-exchange",
    description: "Discuss economic theories, current events, and help each other with economics assignments.",
    shortDescription: "Understanding our economic world",
    grade: "12",
    subject: "Economics",
    memberCount: 134,
    avatar: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&auto=format&fit=crop"
  },
  {
    _id: "comm009",
    name: "Art & Design Studio",
    slug: "art-design-studio",
    description: "Share your artwork, discuss techniques, and get feedback from fellow art students.",
    shortDescription: "A creative community for artists",
    grade: "all",
    subject: "Art",
    memberCount: 201,
    avatar: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&auto=format&fit=crop"
  }
];