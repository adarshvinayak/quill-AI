import { useState } from 'react';
import { MessageCircle, Mail } from 'lucide-react';
import BrutalButton from '../ui/BrutalButton';
import BrutalCard from '../ui/BrutalCard';
import FeedbackModal from './FeedbackModal';

export default function Footer() {
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  return (
    <>
      <footer className="bg-white border-t-4 border-black mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <BrutalCard className="!border-4 !border-black mb-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <MessageCircle size={48} className="text-black flex-shrink-0" />
                <div>
                  <h3 className="font-black text-2xl mb-2 uppercase">
                    Can't find what you're looking for?
                  </h3>
                  <p className="font-bold text-gray-800">
                    Give us your valuable feedback and we will implement it!
                  </p>
                </div>
              </div>
              <BrutalButton
                variant="warning"
                size="lg"
                onClick={() => setShowFeedbackModal(true)}
                className="flex-shrink-0"
              >
                SEND FEEDBACK
              </BrutalButton>
            </div>
          </BrutalCard>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h4 className="font-black text-xl mb-4 uppercase">About Quillion</h4>
              <p className="font-bold text-gray-700">
                Transform thousands of comments into actionable intelligence with AI-powered analysis.
              </p>
            </div>

            <div>
              <h4 className="font-black text-xl mb-4 uppercase">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="/#features"
                    className="font-bold text-gray-700 hover:text-electricBlue transition-colors"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="/#how-it-works"
                    className="font-bold text-gray-700 hover:text-electricBlue transition-colors"
                  >
                    How It Works
                  </a>
                </li>
                <li>
                  <a
                    href="/#waitlist"
                    className="font-bold text-gray-700 hover:text-electricBlue transition-colors"
                  >
                    Join Waitlist
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-black text-xl mb-4 uppercase">Contact</h4>
              <div className="flex items-center gap-2 text-gray-700">
                <Mail size={20} />
                <a
                  href="mailto:hello@quillion.com"
                  className="font-bold hover:text-electricBlue transition-colors"
                >
                  hello@quillion.com
                </a>
              </div>
            </div>
          </div>

          <div className="border-t-4 border-black pt-8">
            <p className="text-center font-bold text-gray-700">
              © 2024 Quillion. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      <FeedbackModal
        isOpen={showFeedbackModal}
        onClose={() => setShowFeedbackModal(false)}
      />
    </>
  );
}
