'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'
import {
  CodeBracketIcon,
  BeakerIcon,
  CpuChipIcon,
  CommandLineIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  ArrowDownIcon,
} from '@heroicons/react/24/outline'
import { RainbowButton } from "@/components/ui/rainbow-button"
import { Squares } from "@/components/ui/squares-background"
import { NavMenu } from "@/components/ui/nav-menu"
import { GradientCard } from "@/components/ui/gradient-card"
import { ScrollProgress } from "@/components/ui/scroll-progress"
import { HeroGeometric } from "@/components/ui/shape-landing-hero"
import { ProjectModal } from "@/components/ui/project-modal"
import { SnakeGame } from "@/components/ui/snake-game"
import { useState, useEffect, lazy, Suspense, useRef } from 'react'
import { ClientOnly } from '@/components/ui/client-only'
import { useSectionScroll } from '@/utils/scroll-helpers'

// Dynamically import heavy components
const FloatingSphere = lazy(() => import('@/components/ui/floating-sphere').then(mod => ({ default: mod.FloatingSphere })))
const ParticleField = lazy(() => import('@/components/ui/particle-field').then(mod => ({ default: mod.ParticleField })))
const SparklesCore = lazy(() => import('@/components/ui/sparkles').then(mod => ({ default: mod.SparklesCore })))
const Gravity = lazy(() => import('@/components/ui/gravity').then(mod => ({ default: mod.Gravity })))
const MatterBody = lazy(() => import('@/components/ui/gravity').then(mod => ({ default: mod.MatterBody })))

// Placeholder component for lazy-loaded components
const LazyComponentFallback = () => <div className="w-full h-full bg-black/20" />

const skills = [
  {
    icon: <CpuChipIcon className="w-6 h-6" />,
    title: 'AI Systems Development',
    description: 'Expertise in developing advanced AI solutions using cutting-edge LLMs, neural networks, and machine learning algorithms. Specialized in GPT integration and custom AI model development.',
  },
  {
    icon: <BeakerIcon className="w-6 h-6" />,
    title: 'Machine Learning Systems',
    description: 'Deep experience in ML model development, training, and deployment. Proficient in building predictive models, data analysis, and integrating ML capabilities into practical applications.',
  },
  {
    icon: <CommandLineIcon className="w-6 h-6" />,
    title: 'AI Web Development',
    description: 'Building modern AI-powered web applications with Next.js, React, and TypeScript. Expert in creating responsive, performant UIs with seamless AI integration and intelligent features.',
  },
  {
    icon: <CodeBracketIcon className="w-6 h-6" />,
    title: 'App Development',
    description: 'Creating cross-platform mobile applications with integrated AI capabilities. Experienced in developing intelligent mobile solutions that leverage machine learning and natural language processing.',
  },
  {
    icon: <CpuChipIcon className="w-6 h-6" />,
    title: 'Automations',
    description: 'Designing and implementing intelligent automation systems that streamline workflows and business processes. Expertise in creating custom solutions that save time and increase efficiency.',
  },
  {
    icon: <BeakerIcon className="w-6 h-6" />,
    title: 'WordPress Plugin Development',
    description: 'Developing custom WordPress plugins that extend functionality and integrate AI capabilities. Experience creating tailored solutions for content management, e-commerce, and business operations.',
  },
]

const projects = [
  {
    title: 'AI Portfolio Website',
    description: 'A Next.js portfolio website with AI-powered features and modern design.',
    longDescription: 'A modern, interactive portfolio website built with Next.js and TypeScript. Features include AI-powered components, interactive animations, particle effects, and an engaging Snake game with power-ups and fun facts.',
    tech: ['Next.js 15', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Matter.js', 'Heroicons', 'tsParticles'],
    link: '#',
    image: '/portfolio-hero.png',
    features: [
      'Interactive Snake game with power-ups and fun facts',
      'Smooth animations and transitions using Framer Motion',
      'Physics-based floating elements with Matter.js',
      'Dynamic particle effects and sparkle backgrounds',
      'Responsive design with mobile-friendly controls',
      'Modern glassmorphism UI with gradient effects',
      'Optimized performance with Next.js'
    ],
    challenges: [
      'Implementing complex game logic with power-ups and mobile controls',
      'Creating smooth physics-based animations',
      'Optimizing particle effects for performance',
      'Building responsive layouts with modern UI effects',
      'Ensuring cross-device compatibility'
    ],
    githubUrl: 'https://github.com/thami33/portfolio',
    liveUrl: 'https://your-portfolio-url.com'
  },
  {
    title: 'RE5 Master Mobile App',
    description: 'A comprehensive mobile learning platform for financial services professionals preparing for the FSCA\'s RE5 regulatory examination in South Africa.',
    longDescription: 'RE5 Master is a comprehensive mobile learning platform designed specifically for financial services professionals preparing for the FSCA\'s RE5 regulatory examination in South Africa. The app provides a structured learning experience with practice questions, mock exams, and study materials that align with official FSCA documentation and current regulations.',
    tech: ['React Native', 'Expo', 'TypeScript', 'Firebase', 'PayFast', 'OpenAI API', 'Expo Router', 'React Context', 'Styled Components'],
    link: 'https://youtu.be/Oxh2jgtkras',
    image: '/re5-master-preview.png',
    features: [
      'Practice Question Bank: Extensive collection of practice questions organized by topic',
      'Mock Exams: Multiple full-length simulated exams with timing and scoring',
      'Learning Materials: Comprehensive study guides and flashcards',
      'Progress Tracking: Detailed statistics and performance analytics',
      'Premium Subscription: Enhanced access to additional mock exams and features',
      'Secure Payment Processing: Integration with PayFast for South African payments',
      'User Authentication: Secure account management and progress saving',
      'Responsive Design: Optimized for both iOS and Android devices',
      'Offline Access: Study materials available without internet connection',
      'AI-Powered Assistance: OpenAI integration for answering regulatory questions'
    ],
    challenges: [
      'Implementing secure payment processing with PayFast',
      'Creating an efficient question bank system with proper categorization',
      'Building a reliable mock exam engine with timing and scoring',
      'Optimizing app performance with large question datasets',
      'Ensuring content accuracy and compliance with FSCA regulations',
      'Managing user subscription states and access control',
      'Implementing responsive UI across various device sizes',
      'Synchronizing offline and online data for seamless user experience',
      'Integrating OpenAI API for regulatory assistance features'
    ],
    videoUrl: 'https://youtu.be/Oxh2jgtkras'
  },
  {
    title: 'CareerDash',
    description: 'A comprehensive career development platform with AI-powered tools for job seekers.',
    longDescription: 'CareerDash is a comprehensive career development platform built with Next.js and Firebase, designed to help job seekers enhance their CVs, prepare for interviews, and improve their job search process. The platform leverages AI-powered tools to provide personalized career guidance, CV enhancement, and interview preparation.',
    tech: ['Next.js', 'TypeScript', 'Firebase', 'Tailwind CSS', 'Deepseek AI', 'PDF.js', 'Formidable', 'PayPal', 'Webpack'],
    link: 'https://youtu.be/rU24vpS9n0w',
    image: '/careerdash-preview.png',
    features: [
      'AI-powered CV parsing, analysis, and enhancement',
      'Automated skill extraction and categorization',
      'ATS compatibility analysis',
      'Cover letter generation tailored to job descriptions',
      'AI-generated interview questions and mock interview practice',
      'Real-time interview response analysis and feedback',
      'Job application tracking and CV tailoring',
      'Skills gap analysis and career progression recommendations',
      'Subscription management with PayPal integration'
    ],
    challenges: [
      'Implementing accurate CV parsing from various document formats',
      'Creating reliable AI-powered CV enhancement that maintains factual accuracy',
      'Building a responsive and intuitive user interface for complex workflows',
      'Optimizing API calls to Deepseek for cost-efficiency',
      'Ensuring data security and privacy for sensitive user information',
      'Handling audio processing for interview practice sessions',
      'Creating a scalable subscription management system'
    ],
    videoUrl: 'https://youtu.be/rU24vpS9n0w'
  },
  {
    title: 'MyShopa E-commerce Platform',
    description: 'A full-featured e-commerce platform built with WordPress and modern technologies.',
    longDescription: 'MyShopa.co.za is a comprehensive e-commerce solution built on WordPress and WooCommerce, providing a seamless shopping experience for South African customers. The platform features a custom-designed interface using Elementor Pro and integrates with PayFast for secure local payments.',
    tech: ['WordPress', 'WooCommerce', 'Elementor Pro', 'PayFast', 'PHP', 'MySQL', 'Custom Plugins'],
    link: 'https://myshopa.co.za',
    image: '/myshopa-preview.png',
    features: [
      'Custom WordPress theme with Elementor Pro design',
      'WooCommerce integration with advanced product management',
      'Secure payment processing with PayFast integration',
      'Support for multiple South African payment methods',
      'Custom product filtering and search functionality',
      'Responsive mobile-first design',
      'Optimized checkout process',
      'Advanced inventory management system'
    ],
    challenges: [
      'Implementing secure PayFast payment gateway integration',
      'Creating custom WooCommerce extensions',
      'Optimizing WordPress performance and load times',
      'Building responsive Elementor templates',
      'Ensuring seamless mobile experience',
      'Implementing secure user authentication'
    ],
    liveUrl: 'https://myshopa.co.za'
  },
  // Add more projects as needed
]

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
}

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
}

export default function Home() {
  const [selectedProject, setSelectedProject] = useState<typeof projects[0] | null>(null);
  const { scrollYProgress } = useScroll()
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  
  // Define sections for scroll navigation
  const sections = ['hero', 'about', 'skills', 'snake', 'portfolio', 'contact'];
  
  // Use our custom section scroll hook
  const { activeSection, scrollToSection } = useSectionScroll(sections, {
    offset: 80, // Account for the fixed header
    scrollThreshold: 30, // Lower threshold for more responsive scrolling
    scrollCooldown: 800, // Shorter cooldown for smoother experience
    onlyInHero: true, // Only apply section-based scrolling in the hero section
  });
  
  // Add a ref to the hero section since it doesn't have an ID in the markup
  const heroRef = useRef<HTMLElement>(null);
  
  // Set up the hero section ID when component mounts
  useEffect(() => {
    if (heroRef.current) {
      heroRef.current.id = 'hero';
    }
  }, []);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-indigo-500/90 selection:text-white">
      <ScrollProgress />
      <NavMenu activeSection={sections[activeSection]} />
      
      {/* Background Effects */}
      <ClientOnly fallback={<LazyComponentFallback />}>
        <Suspense fallback={<LazyComponentFallback />}>
          <ParticleField />
        </Suspense>
      </ClientOnly>
      <div className="fixed inset-0 -z-20 h-full w-full bg-black">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/20 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-500/10 via-transparent to-transparent" />
      </div>

      {/* Scroll Down Arrow - Only show in hero section */}
      <ClientOnly>
        {activeSection === 0 && (
          <motion.div 
            className="fixed left-8 bottom-8 w-fit z-30 cursor-pointer flex items-center gap-3 bg-black/20 backdrop-blur-sm px-4 py-3 rounded-full ring-1 ring-white/10 hover:ring-white/20 transition-all"
            initial={{ y: 20, opacity: 0 }}
            animate={{ 
              y: 0,
              opacity: 1 
            }}
            transition={{ 
              y: {
                duration: 0.5,
                ease: "easeOut"
              },
              opacity: {
                duration: 0.5
              }
            }}
            onClick={() => {
              // Scroll to the next section
              scrollToSection(activeSection + 1 >= sections.length ? 0 : activeSection + 1);
            }}
          >
            <span className="text-sm font-medium">
              {activeSection + 1 >= sections.length 
                ? "Back to Top" 
                : "Explore"}
            </span>
            <motion.div
              animate={{
                y: [0, 3, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatType: "loop",
              }}
            >
              <ArrowDownIcon className="w-4 h-4" />
            </motion.div>
          </motion.div>
        )}
      </ClientOnly>

      {/* Hero Section - Add ref for section scrolling */}
      <ClientOnly fallback={<LazyComponentFallback />}>
        <section ref={heroRef} className="w-full min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-black">
          <HeroGeometric 
            badge="AI Developer"
            title1="Thami Mvelase"
            title2="AI & Full Stack Developer"
          />
          
          {/* Gravity Demo */}
          <div className="absolute inset-0 z-20">
            <div className="absolute inset-0" style={{ pointerEvents: 'none' }}>
              <div style={{ pointerEvents: 'auto' }}>
                <Suspense fallback={<LazyComponentFallback />}>
                  <Gravity className="w-full h-full" gravity={{ x: 0, y: 1 }}>
                    <MatterBody
                      matterBodyOptions={{ friction: 0.5, restitution: 0.2 }}
                      x="30%"
                      y="10%"
                    >
                      <div className="text-xl sm:text-2xl md:text-3xl bg-gradient-to-r from-indigo-500 to-blue-500 text-white rounded-full px-8 py-4">
                        AI
                      </div>
                    </MatterBody>
                    <MatterBody
                      matterBodyOptions={{ friction: 0.5, restitution: 0.2 }}
                      x="40%"
                      y="15%"
                    >
                      <div className="text-xl sm:text-2xl md:text-3xl bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-full px-8 py-4">
                        ML
                      </div>
                    </MatterBody>
                    <MatterBody
                      matterBodyOptions={{ friction: 0.5, restitution: 0.2 }}
                      x="50%"
                      y="20%"
                    >
                      <div className="text-xl sm:text-2xl md:text-3xl bg-gradient-to-r from-violet-500 to-purple-500 text-white rounded-full px-8 py-4">
                        Next.js
                      </div>
                    </MatterBody>
                    <MatterBody
                      matterBodyOptions={{ friction: 0.5, restitution: 0.2 }}
                      x="60%"
                      y="25%"
                    >
                      <div className="text-xl sm:text-2xl md:text-3xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-full px-8 py-4">
                        React
                      </div>
                    </MatterBody>
                    <MatterBody
                      matterBodyOptions={{ friction: 0.5, restitution: 0.2 }}
                      x="70%"
                      y="30%"
                    >
                      <div className="text-xl sm:text-2xl md:text-3xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-full px-8 py-4">
                        Python
                      </div>
                    </MatterBody>
                    <MatterBody
                      matterBodyOptions={{ friction: 0.5, restitution: 0.2 }}
                      x="35%"
                      y="35%"
                    >
                      <div className="text-xl sm:text-2xl md:text-3xl bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full px-8 py-4">
                        TypeScript
                      </div>
                    </MatterBody>
                    <MatterBody
                      matterBodyOptions={{ friction: 0.5, restitution: 0.2 }}
                      x="45%"
                      y="40%"
                    >
                      <div className="text-xl sm:text-2xl md:text-3xl bg-gradient-to-r from-indigo-500 to-violet-500 text-white rounded-full px-8 py-4">
                        Tailwind
                      </div>
                    </MatterBody>
                    <MatterBody
                      matterBodyOptions={{ friction: 0.5, restitution: 0.2 }}
                      x="55%"
                      y="45%"
                    >
                      <div className="text-xl sm:text-2xl md:text-3xl bg-gradient-to-r from-rose-500 to-red-500 text-white rounded-full px-8 py-4">
                        Android
                      </div>
                    </MatterBody>
                    <MatterBody
                      matterBodyOptions={{ friction: 0.5, restitution: 0.2 }}
                      x="65%"
                      y="50%"
                    >
                      <div className="text-xl sm:text-2xl md:text-3xl bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full px-8 py-4">
                        iOS
                      </div>
                    </MatterBody>
                    <MatterBody
                      matterBodyOptions={{ friction: 0.5, restitution: 0.2 }}
                      x="75%"
                      y="55%"
                    >
                      <div className="text-xl sm:text-2xl md:text-3xl bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-full px-8 py-4">
                        React Native
                      </div>
                    </MatterBody>
                    <MatterBody
                      matterBodyOptions={{ friction: 0.5, restitution: 0.2 }}
                      x="40%"
                      y="60%"
                    >
                      <div className="text-xl sm:text-2xl md:text-3xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full px-8 py-4">
                        Cursor AI
                      </div>
                    </MatterBody>
                    <MatterBody
                      matterBodyOptions={{ friction: 0.5, restitution: 0.2 }}
                      x="50%"
                      y="65%"
                    >
                      <div className="text-xl sm:text-2xl md:text-3xl bg-gradient-to-r from-cyan-500 to-teal-500 text-white rounded-full px-8 py-4">
                        JavaScript
                      </div>
                    </MatterBody>
                  </Gravity>
                </Suspense>
              </div>
            </div>
          </div>
        </section>
      </ClientOnly>

      {/* About Me Section */}
      <section id="about" className="py-24 relative">
        {/* Background Sparkles */}
        <div className="absolute inset-0">
          <ClientOnly fallback={<LazyComponentFallback />}>
            <Suspense fallback={<LazyComponentFallback />}>
              <SparklesCore
                background="transparent"
                minSize={0.4}
                maxSize={1}
                particleDensity={40}
                className="w-full h-full"
                particleColor="#FFFFFF"
                speed={0.2}
              />
            </Suspense>
          </ClientOnly>
        </div>

        <div className="px-6 lg:px-8 mx-auto max-w-7xl relative z-10">
          <motion.div 
            className="mx-auto max-w-2xl lg:text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-base font-semibold leading-7 text-indigo-400">About Me</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Passionate AI Developer
            </p>
          </motion.div>

          <div className="mt-16 grid grid-cols-1 gap-12 lg:grid-cols-2 items-center">
            {/* Left Column - Image */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative"
            >
              <div className="aspect-square w-full max-w-md mx-auto overflow-hidden rounded-2xl bg-gray-900/50 ring-1 ring-white/10 backdrop-blur-sm">
                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 via-purple-500/20 to-pink-500/20 opacity-50" />
                <Image
                  src="/profile-image.JPG"
                  alt="Thami Mvelase"
                  fill
                  className="object-cover"
                />
              </div>
            </motion.div>

            {/* Right Column - Bio */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="space-y-6 text-lg text-gray-300">
                <p>
                  I'm Thami Mvelase, an AI and Full Stack Developer based in Johannesburg, South Africa, with a passion for creating intelligent digital solutions that solve real-world problems.
                </p>
                <p>
                  With a background in construction engineering before transitioning to tech, I bring a unique perspective to software development—combining analytical thinking with creative problem-solving.
                </p>
                <p>
                  I specialize in developing AI-powered applications, from intelligent web platforms to mobile apps with integrated machine learning capabilities. My expertise spans across modern frameworks like Next.js, React Native, and various AI technologies.
                </p>
                <p>
                  When I'm not coding, you'll find me exploring new AI advancements, teaching others about technology, or enjoying the vibrant culture of Johannesburg.
                </p>
              </div>

              {/* Key Facts */}
              <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-xl bg-gray-900/30 p-5 ring-1 ring-white/10 backdrop-blur-sm">
                  <h3 className="text-lg font-medium text-indigo-400 mb-2">Experience</h3>
                  <p className="text-gray-300">5+ years in AI and full-stack development</p>
                </div>
                <div className="rounded-xl bg-gray-900/30 p-5 ring-1 ring-white/10 backdrop-blur-sm">
                  <h3 className="text-lg font-medium text-indigo-400 mb-2">Education</h3>
                  <p className="text-gray-300">BSc in Construction Engineering</p>
                </div>
                <div className="rounded-xl bg-gray-900/30 p-5 ring-1 ring-white/10 backdrop-blur-sm">
                  <h3 className="text-lg font-medium text-indigo-400 mb-2">Location</h3>
                  <p className="text-gray-300">Johannesburg, South Africa</p>
                </div>
                <div className="rounded-xl bg-gray-900/30 p-5 ring-1 ring-white/10 backdrop-blur-sm">
                  <h3 className="text-lg font-medium text-indigo-400 mb-2">Languages</h3>
                  <p className="text-gray-300">English, Zulu</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-24 relative">
        {/* Background Sparkles */}
        <div className="absolute inset-0">
          <ClientOnly fallback={<LazyComponentFallback />}>
            <Suspense fallback={<LazyComponentFallback />}>
              <SparklesCore
                background="transparent"
                minSize={0.4}
                maxSize={1}
                particleDensity={40}
                className="w-full h-full"
                particleColor="#FFFFFF"
                speed={0.2}
              />
            </Suspense>
          </ClientOnly>
        </div>

        <div className="px-6 lg:px-8 mx-auto max-w-7xl relative z-10">
          <motion.div 
            className="mx-auto max-w-2xl lg:text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-base font-semibold leading-7 text-indigo-400">Expertise & Capabilities</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Advanced AI Development
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-300">
              Combining cutting-edge AI technologies with robust software development to create intelligent, scalable solutions.
            </p>
          </motion.div>

          <motion.div 
            className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none"
            variants={stagger}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              {skills.map((skill, index) => (
                <motion.div 
                  key={skill.title} 
                  variants={fadeInUp}
                  custom={index}
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="relative group">
                    <div className="absolute -inset-[1px] rounded-xl bg-gradient-to-r from-neutral-800/50 to-neutral-700/50 opacity-0 group-hover:opacity-100 transition-all duration-500 blur-sm" />
                    <div className="relative h-full bg-black/40 rounded-lg p-6 ring-1 ring-neutral-800 backdrop-blur-sm group-hover:ring-neutral-700 transition-all duration-300">
                      <dt className="flex items-center gap-x-3 text-base font-medium text-neutral-200">
                        <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-neutral-900/50 ring-1 ring-neutral-800 group-hover:ring-neutral-700 transition-all duration-300">
                          {skill.icon}
                        </div>
                        {skill.title}
                      </dt>
                      <dd className="mt-3 text-sm text-neutral-400 leading-relaxed">
                        {skill.description}
                      </dd>
                    </div>
                  </div>
                </motion.div>
              ))}
            </dl>
          </motion.div>
        </div>
      </section>

      {/* Game Section */}
      <section id="snake" className="py-24 relative">
        {/* Background Sparkles */}
        <div className="absolute inset-0">
          <ClientOnly fallback={<LazyComponentFallback />}>
            <Suspense fallback={<LazyComponentFallback />}>
              <SparklesCore
                background="transparent"
                minSize={0.4}
                maxSize={1}
                particleDensity={40}
                className="w-full h-full"
                particleColor="#FFFFFF"
                speed={0.2}
              />
            </Suspense>
          </ClientOnly>
        </div>

        <div className="px-6 lg:px-8 mx-auto max-w-7xl relative z-10">
          <motion.div 
            className="mx-auto max-w-2xl lg:text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-base font-semibold leading-7 text-indigo-400">Take a Break</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Play Snake
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-300">
              Use arrow keys to control the snake. Space to pause/resume. Collect food to grow and increase your score!
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex justify-center"
          >
            <SnakeGame />
          </motion.div>
        </div>
      </section>

      {/* Projects Section with 3D Cards */}
      <section id="portfolio" className="py-24 relative">
        {/* Background Sparkles */}
        <div className="absolute inset-0">
          <ClientOnly fallback={<LazyComponentFallback />}>
            <Suspense fallback={<LazyComponentFallback />}>
              <SparklesCore
                background="transparent"
                minSize={0.4}
                maxSize={1}
                particleDensity={40}
                className="w-full h-full"
                particleColor="#FFFFFF"
                speed={0.2}
              />
            </Suspense>
          </ClientOnly>
        </div>

        <div className="px-6 lg:px-8 mx-auto max-w-7xl relative z-10">
          <motion.div 
            className="mx-auto max-w-2xl lg:text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-base font-semibold leading-7 text-indigo-400">Portfolio</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Featured Projects
            </p>
          </motion.div>
          <motion.div 
            className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2"
            variants={stagger}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {projects.map((project, index) => (
              <motion.article 
                key={project.title} 
                variants={fadeInUp}
                custom={index}
                whileHover={{ 
                  scale: 1.02,
                  rotateY: 5,
                  rotateX: -5,
                }}
                className="group relative flex flex-col items-start bg-gray-900/30 rounded-3xl p-8 ring-1 ring-gray-800/50 hover:ring-gray-700/50 transition-all duration-300 backdrop-blur-xl cursor-pointer"
                onClick={() => setSelectedProject(project)}
                style={{
                  transformStyle: "preserve-3d",
                  perspective: "1000px"
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl" />
                <div 
                  className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden mb-6 bg-gray-900/50"
                  style={{
                    transform: "translateZ(20px)",
                    transformStyle: "preserve-3d"
                  }}
                >
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="relative w-full" style={{ transform: "translateZ(30px)" }}>
                  <h3 className="text-xl font-semibold leading-6 text-white group-hover:text-indigo-400 transition-colors">
                    {project.title}
                  </h3>
                  <p className="mt-4 text-sm leading-6 text-gray-400">{project.description}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {project.tech.map((tech) => (
                      <span 
                        key={tech} 
                        className="inline-flex items-center rounded-full bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-400 ring-1 ring-inset ring-blue-500/20 backdrop-blur-sm"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 relative">
        {/* Background Sparkles */}
        <div className="absolute inset-0">
          <ClientOnly fallback={<LazyComponentFallback />}>
            <Suspense fallback={<LazyComponentFallback />}>
              <SparklesCore
                background="transparent"
                minSize={0.4}
                maxSize={1}
                particleDensity={40}
                className="w-full h-full"
                particleColor="#FFFFFF"
                speed={0.2}
              />
            </Suspense>
          </ClientOnly>
        </div>

        <div className="px-6 lg:px-8 mx-auto max-w-7xl relative z-10">
          <motion.div 
            className="mx-auto max-w-2xl lg:text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-base font-semibold leading-7 text-indigo-400">Contact</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Let's Connect
            </p>
          </motion.div>
          <motion.div 
            className="mx-auto mt-16 max-w-2xl"
            variants={stagger}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <dl className="grid grid-cols-1 gap-y-8 sm:grid-cols-2 sm:gap-x-6">
              <motion.div 
                variants={fadeInUp}
                whileHover={{ scale: 1.05 }}
                className="group flex items-center gap-x-3 rounded-2xl bg-gray-900/50 p-6 ring-1 ring-gray-800/50 hover:ring-gray-700/50 transition-all duration-300 backdrop-blur-xl"
              >
                <dt className="flex-none">
                  <EnvelopeIcon className="h-6 w-6 text-indigo-400" />
                </dt>
                <dd>
                  <a 
                    href="mailto:thamimvelase3@gmail.com" 
                    className="text-sm leading-6 text-gray-300 hover:text-white transition-colors"
                  >
                    thamimvelase3@gmail.com
                  </a>
                </dd>
              </motion.div>
              <motion.div 
                variants={fadeInUp}
                whileHover={{ scale: 1.05 }}
                className="group flex items-center gap-x-3 rounded-2xl bg-gray-900/50 p-6 ring-1 ring-gray-800/50 hover:ring-gray-700/50 transition-all duration-300 backdrop-blur-xl"
              >
                <dt className="flex-none">
                  <PhoneIcon className="h-6 w-6 text-indigo-400" />
                </dt>
                <dd>
                  <a 
                    href="tel:0609585567" 
                    className="text-sm leading-6 text-gray-300 hover:text-white transition-colors"
                  >
                    060 958 5567
                  </a>
                </dd>
              </motion.div>
              <motion.div 
                variants={fadeInUp}
                whileHover={{ scale: 1.05 }}
                className="group flex items-center gap-x-3 rounded-2xl bg-gray-900/50 p-6 ring-1 ring-gray-800/50 hover:ring-gray-700/50 transition-all duration-300 backdrop-blur-xl sm:col-span-2"
              >
                <dt className="flex-none">
                  <MapPinIcon className="h-6 w-6 text-indigo-400" />
                </dt>
                <dd className="text-sm leading-6 text-gray-300">
                  Johannesburg CBD, South Africa
                </dd>
              </motion.div>
            </dl>
          </motion.div>
        </div>
      </section>

      {/* Project Modal */}
      <ClientOnly>
        {selectedProject && (
          <ProjectModal
            isOpen={true}
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </ClientOnly>
    </div>
  )
}
