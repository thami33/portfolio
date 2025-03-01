import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: {
    title: string;
    description: string;
    tech: string[];
    image: string;
    longDescription?: string;
    features?: string[];
    challenges?: string[];
    githubUrl?: string;
    liveUrl?: string;
    videoUrl?: string;
  };
}

// Helper function to convert YouTube URL to embed URL
function getYouTubeEmbedUrl(url: string) {
  // Handle youtu.be format
  if (url.includes('youtu.be')) {
    const id = url.split('youtu.be/')[1].split('?')[0];
    return `https://www.youtube.com/embed/${id}`;
  }
  
  // Handle youtube.com format
  if (url.includes('youtube.com/watch')) {
    const id = new URL(url).searchParams.get('v');
    return `https://www.youtube.com/embed/${id}`;
  }
  
  return url; // Return as is if not recognized
}

export function ProjectModal({ isOpen, onClose, project }: ProjectModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-[101] flex items-center justify-center"
          >
            <div className="relative w-[95%] max-w-4xl max-h-[85vh] overflow-y-auto bg-black/90 rounded-2xl p-8 shadow-2xl ring-1 ring-white/10 backdrop-blur-xl">
              {/* Close Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onClose();
                }}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              >
                <XMarkIcon className="w-6 h-6 text-white" />
              </button>

              {/* Content */}
              <div className="space-y-8 pr-2">
                {/* Image or Video */}
                <div className="relative w-full aspect-video rounded-xl overflow-hidden">
                  {project.videoUrl ? (
                    <iframe
                      src={getYouTubeEmbedUrl(project.videoUrl)}
                      title={project.title}
                      className="absolute inset-0 w-full h-full"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  ) : (
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-cover"
                    />
                  )}
                </div>

                {/* Title and Description */}
                <div>
                  <h3 className="text-2xl font-bold text-white mb-4">{project.title}</h3>
                  <p className="text-gray-300 leading-relaxed">{project.longDescription || project.description}</p>
                </div>

                {/* Technologies */}
                <div>
                  <h4 className="text-lg font-semibold text-white mb-3">Technologies Used</h4>
                  <div className="flex flex-wrap gap-2">
                    {project.tech.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 rounded-full text-sm font-medium bg-indigo-500/10 text-indigo-400 ring-1 ring-indigo-500/20"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Features */}
                {project.features && (
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-3">Key Features</h4>
                    <ul className="list-disc list-inside space-y-2 text-gray-300">
                      {project.features.map((feature, index) => (
                        <li key={index}>{feature}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Challenges */}
                {project.challenges && (
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-3">Technical Challenges</h4>
                    <ul className="list-disc list-inside space-y-2 text-gray-300">
                      {project.challenges.map((challenge, index) => (
                        <li key={index}>{challenge}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Links */}
                <div className="flex flex-wrap gap-4">
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-white"
                    >
                      View on GitHub
                    </a>
                  )}
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-600 transition-colors text-white"
                    >
                      Visit Live Site
                    </a>
                  )}
                  {project.videoUrl && !project.liveUrl && (
                    <a
                      href={project.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-600 transition-colors text-white"
                    >
                      Watch Video Demo
                    </a>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
} 