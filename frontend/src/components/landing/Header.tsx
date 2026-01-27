import { motion } from 'framer-motion';

export default function Header() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="border-b-4 border-black bg-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <img src="/quillion.png" alt="Quillion" className="h-12 sm:h-16" />

          <nav className="flex items-center gap-6">
            <a href="#features" className="font-bold text-black hover:text-electricBlue transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="font-bold text-black hover:text-electricBlue transition-colors">
              How It Works
            </a>
            <a href="#waitlist" className="font-bold text-black hover:text-electricBlue transition-colors">
              Join Waitlist
            </a>
          </nav>
        </div>
      </div>
    </motion.header>
  );
}
