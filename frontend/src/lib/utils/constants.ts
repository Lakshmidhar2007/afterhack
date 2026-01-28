// Tech Stack options with colors
export const TECH_STACKS = [
    { name: 'React', color: '#61DAFB' },
    { name: 'Next.js', color: '#000000' },
    { name: 'Vue.js', color: '#4FC08D' },
    { name: 'Angular', color: '#DD0031' },
    { name: 'Svelte', color: '#FF3E00' },
    { name: 'Node.js', color: '#339933' },
    { name: 'Express', color: '#000000' },
    { name: 'Python', color: '#3776AB' },
    { name: 'Django', color: '#092E20' },
    { name: 'Flask', color: '#000000' },
    { name: 'FastAPI', color: '#009688' },
    { name: 'TypeScript', color: '#3178C6' },
    { name: 'JavaScript', color: '#F7DF1E' },
    { name: 'Go', color: '#00ADD8' },
    { name: 'Rust', color: '#000000' },
    { name: 'Java', color: '#007396' },
    { name: 'Kotlin', color: '#7F52FF' },
    { name: 'Swift', color: '#FA7343' },
    { name: 'Flutter', color: '#02569B' },
    { name: 'React Native', color: '#61DAFB' },
    { name: 'TensorFlow', color: '#FF6F00' },
    { name: 'PyTorch', color: '#EE4C2C' },
    { name: 'OpenAI', color: '#412991' },
    { name: 'LangChain', color: '#1C3C3C' },
    { name: 'MongoDB', color: '#47A248' },
    { name: 'PostgreSQL', color: '#4169E1' },
    { name: 'MySQL', color: '#4479A1' },
    { name: 'Redis', color: '#DC382D' },
    { name: 'Firebase', color: '#FFCA28' },
    { name: 'Supabase', color: '#3ECF8E' },
    { name: 'AWS', color: '#FF9900' },
    { name: 'GCP', color: '#4285F4' },
    { name: 'Docker', color: '#2496ED' },
    { name: 'Kubernetes', color: '#326CE5' },
    { name: 'GraphQL', color: '#E10098' },
    { name: 'REST API', color: '#009688' },
    { name: 'Solidity', color: '#363636' },
    { name: 'Web3.js', color: '#F16822' },
    { name: 'Tailwind CSS', color: '#06B6D4' },
    { name: 'Three.js', color: '#000000' },
];

// Project domains/categories
export const DOMAINS = [
    { name: 'AI/ML', icon: '🤖', color: '#8B5CF6' },
    { name: 'Web3/Blockchain', icon: '⛓️', color: '#F59E0B' },
    { name: 'FinTech', icon: '💰', color: '#10B981' },
    { name: 'HealthTech', icon: '🏥', color: '#EF4444' },
    { name: 'EdTech', icon: '📚', color: '#3B82F6' },
    { name: 'E-Commerce', icon: '🛒', color: '#EC4899' },
    { name: 'Social Good', icon: '🌍', color: '#22C55E' },
    { name: 'Gaming', icon: '🎮', color: '#A855F7' },
    { name: 'IoT/Hardware', icon: '🔌', color: '#F97316' },
    { name: 'DevTools', icon: '🛠️', color: '#6366F1' },
    { name: 'SaaS', icon: '☁️', color: '#0EA5E9' },
    { name: 'AR/VR', icon: '🥽', color: '#D946EF' },
    { name: 'Sustainability', icon: '🌱', color: '#84CC16' },
    { name: 'Productivity', icon: '⚡', color: '#EAB308' },
    { name: 'Other', icon: '✨', color: '#64748B' },
];

// Technology Readiness Level descriptions
export const TRL_LEVELS = [
    { level: 1, name: 'Basic Principles', description: 'Basic principles observed and reported' },
    { level: 2, name: 'Concept Formulated', description: 'Technology concept and application formulated' },
    { level: 3, name: 'Proof of Concept', description: 'Analytical and experimental critical function proof-of-concept' },
    { level: 4, name: 'Lab Validated', description: 'Component validation in laboratory environment' },
    { level: 5, name: 'Relevant Environment', description: 'Component validation in relevant environment' },
    { level: 6, name: 'Demo Ready', description: 'System/subsystem model or prototype demonstration' },
    { level: 7, name: 'Operational Demo', description: 'System prototype demonstration in operational environment' },
    { level: 8, name: 'System Complete', description: 'System complete and qualified' },
    { level: 9, name: 'Production Ready', description: 'Actual system proven through successful operations' },
];

// Popular hackathons
export const HACKATHONS = [
    'MLH Hackathon',
    'HackMIT',
    'TreeHacks',
    'PennApps',
    'HackGT',
    'CalHacks',
    'LAHacks',
    'HackNY',
    'MHacks',
    'HackIllinois',
    'HackRice',
    'HackTX',
    'Hacktoberfest',
    'ETHGlobal',
    'Devfolio Hackathon',
    'Smart India Hackathon',
    'Google Solution Challenge',
    'Microsoft Imagine Cup',
    'Other',
];

// Industry options for founders
export const INDUSTRIES = [
    'Technology',
    'Finance',
    'Healthcare',
    'Education',
    'E-Commerce',
    'Media & Entertainment',
    'Real Estate',
    'Manufacturing',
    'Consulting',
    'Venture Capital',
    'Startup',
    'Non-Profit',
    'Government',
    'Other',
];

// Request types with descriptions
export const REQUEST_TYPES = [
    {
        type: 'intro' as const,
        name: 'Introduction',
        description: 'Get introduced to the team for initial conversation',
        icon: '👋'
    },
    {
        type: 'poc' as const,
        name: 'PoC Collaboration',
        description: 'Explore proof-of-concept collaboration opportunity',
        icon: '🔬'
    },
    {
        type: 'hiring' as const,
        name: 'Direct Hiring',
        description: 'Express interest in hiring team members',
        icon: '💼'
    },
];

// Navigation items by role
export const STUDENT_NAV_ITEMS = [
    { name: 'Dashboard', href: '/student', icon: 'LayoutDashboard' },
    { name: 'My Projects', href: '/student/projects', icon: 'Folder' },
    { name: 'Discover', href: '/discover', icon: 'Compass' },
    { name: 'Messages', href: '/messages', icon: 'MessageSquare' },
    { name: 'Settings', href: '/settings', icon: 'Settings' },
];

export const FOUNDER_NAV_ITEMS = [
    { name: 'Dashboard', href: '/founder', icon: 'LayoutDashboard' },
    { name: 'Browse Projects', href: '/discover', icon: 'Search' },
    { name: 'My Requests', href: '/founder/requests', icon: 'Send' },
    { name: 'Saved', href: '/founder/saved', icon: 'Bookmark' },
    { name: 'Settings', href: '/settings', icon: 'Settings' },
];
