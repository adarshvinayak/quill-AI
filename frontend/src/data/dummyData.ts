import type { Comment } from '../types';

const usernames = [
  'TechGuru22', 'MarketingPro', 'StartupFounder', 'DigitalNomad', 'CodeMaster',
  'BusinessOwner', 'SaaSBuilder', 'ProductManager', 'GrowthHacker', 'DataScientist',
  'UXDesigner', 'ContentCreator', 'SocialMediaExpert', 'EcommerceBoss', 'AppDeveloper',
  'VideoEditor', 'Freelancer99', 'AgencyOwner', 'ConsultantLife', 'EntrepreneurHub',
  'InvestorMindset', 'BrandStrategist', 'SEOExpert', 'CopywriterPro', 'WebDesigner',
];

const topics = [
  'features', 'pricing', 'UI/UX', 'performance', 'support', 'integration',
  'security', 'mobile app', 'API', 'documentation', 'onboarding', 'analytics',
  'customization', 'scalability', 'bugs', 'updates', 'alternatives', 'comparison',
];

const positiveComments = [
  'This is exactly what I needed! Amazing work!',
  'Love the interface, so clean and intuitive',
  'Best tool I\'ve used for this purpose',
  'The features are incredible, worth every penny',
  'Highly recommend this to anyone looking for a solution',
  'Game changer for my workflow',
  'Customer support is top-notch',
  'The updates keep getting better',
  'So easy to use, even for beginners',
  'This solved my biggest problem',
];

const neutralComments = [
  'Interesting approach to this problem',
  'Would be nice to see more features',
  'How does this compare to alternatives?',
  'Can someone explain how this works?',
  'Is there a trial version available?',
  'Looking forward to future updates',
  'Any plans for mobile support?',
  'What\'s the pricing structure?',
  'Has anyone tried this with [use case]?',
  'Documentation could be more detailed',
];

const negativeComments = [
  'Not what I expected from the description',
  'Too expensive for what it offers',
  'The UI is confusing',
  'Ran into several bugs',
  'Support hasn\'t responded yet',
  'Missing key features I need',
  'Performance issues on my device',
  'Competitors offer better value',
  'Disappointed with the results',
  'Not worth the hype',
];

const leadComments = [
  'Where can I sign up for the enterprise plan?',
  'Do you offer demos for teams?',
  'I\'d like to discuss integrating this into our workflow',
  'Is there a discount for annual subscriptions?',
  'Can I schedule a call to learn more?',
  'My company needs this, how do we get started?',
  'Do you have a reseller program?',
  'Interested in the API for our product',
  'Looking to purchase licenses for my team',
  'What\'s the implementation timeline?',
  'Can we get a custom quote?',
  'I want to buy this for my agency',
  'Does this integrate with our CRM?',
  'Need this ASAP, how fast can we onboard?',
  'Can you support our enterprise requirements?',
];

function generateComment(index: number): Comment {
  const isLead = Math.random() < 0.12;

  let sentiment: number;
  let text: string;

  if (isLead) {
    sentiment = 0.6 + Math.random() * 0.3;
    text = leadComments[Math.floor(Math.random() * leadComments.length)];
  } else {
    const rand = Math.random();
    if (rand < 0.6) {
      sentiment = 0.5 + Math.random() * 0.5;
      text = positiveComments[Math.floor(Math.random() * positiveComments.length)];
    } else if (rand < 0.85) {
      sentiment = 0.2 + Math.random() * 0.3;
      text = neutralComments[Math.floor(Math.random() * neutralComments.length)];
    } else {
      sentiment = -0.5 + Math.random() * 0.5;
      text = negativeComments[Math.floor(Math.random() * negativeComments.length)];
    }
  }

  const selectedTopics = [];
  const numTopics = Math.floor(Math.random() * 3) + 1;
  for (let i = 0; i < numTopics; i++) {
    const topic = topics[Math.floor(Math.random() * topics.length)];
    if (!selectedTopics.includes(topic)) {
      selectedTopics.push(topic);
    }
  }

  const now = new Date();
  const daysAgo = Math.floor(Math.random() * 30);
  const timestamp = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);

  return {
    id: `comment-${index}`,
    username: usernames[Math.floor(Math.random() * usernames.length)] + Math.floor(Math.random() * 1000),
    text,
    sentiment,
    isLead,
    influenceScore: Math.floor(Math.random() * 100),
    timestamp,
    topics: selectedTopics,
    engagementCount: Math.floor(Math.random() * 500),
  };
}

export const DUMMY_COMMENTS: Comment[] = Array.from({ length: 2000 }, (_, i) => generateComment(i));
