# Quill-AI Frontend

React + TypeScript + Vite application for YouTube comment analysis visualization.

## 🚀 Quick Start

```bash
npm install
npm run dev
```

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base components (buttons, cards, inputs)
│   ├── dashboard/      # Dashboard-specific components
│   ├── report/         # Report page components
│   ├── chat/           # AI chatbot components
│   ├── footer/         # Footer component
│   └── waitlist/       # Waitlist form
├── pages/              # Route pages
│   ├── LandingPage.tsx
│   ├── Dashboard.tsx
│   ├── ReportPage.tsx
│   └── LoginPage.tsx
├── contexts/           # React contexts
│   └── DemoContext.tsx # Demo mode state management
├── hooks/              # Custom React hooks
│   └── useChatAI.ts   # AI chat functionality
├── lib/                # Libraries and utilities
│   └── supabase.ts    # Supabase client
├── types/              # TypeScript type definitions
├── data/               # Mock/dummy data for demo mode
└── utils/              # Utility functions
```

## 🎨 Key Components

### Dashboard Components

- **LoadingSequence**: Animated loading screen with dual progress bars
- Shows real-time embeddings and AI analysis progress
- Polls backend every 10 seconds for status updates

### Report Components

- **SentimentDonut**: Donut chart for sentiment breakdown
- **TopicsBarChart**: Horizontal/vertical bar charts for topics
- **ActionableInsights**: Dual-mode insights (creator vs competitor)
- **AskQuillFAB**: Floating action button for AI chatbot

### Chat Components

- **ChatModal**: Full-screen AI chatbot interface
- **useChatAI**: Hook for RAG-powered chat with backend

## 🎭 Demo Mode

The app supports a **demo mode** for trying the platform without authentication:

```typescript
import { useDemoMode } from './contexts/DemoContext';

const { isDemoMode, setDemoMode } = useDemoMode();
```

- **Demo Mode**: Uses pre-loaded dummy data, no API calls
- **Production Mode**: Real analysis with backend integration

## 🔧 Environment Variables

Create `.env` file:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_URL=http://localhost:8000
```

## 🛠️ Available Scripts

```bash
npm run dev          # Start dev server (port 5173)
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

## 🎨 Styling

### Brutalist Design System

The app uses a custom **brutalist design** with:
- Heavy black borders (`.brutal-border`)
- Hard shadows (`.brutal-shadow`)
- Bold typography (black font weights)
- High-contrast colors

### Color Palette

```css
--electricBlue: #00E5FF
--cyberPink: #FF006E
--highvisYellow: #FFEB3B
```

### Typography

```css
font-family: 'Inter', sans-serif
font-weights: 700 (bold), 900 (black)
```

## 📊 Data Flow

### Analysis Flow

1. User enters YouTube URL → `Dashboard.tsx`
2. POST to `/api/analyze` → Receive `job_id`
3. `LoadingSequence` polls `/api/status/{job_id}`
4. On completion → Navigate to `/report/{analysis_id}`
5. `ReportPage` fetches `/api/analysis/{analysis_id}`
6. Display visualizations

### Chat Flow

1. User clicks "ASK QUILL" FAB → `AskQuillFAB.tsx`
2. Opens `ChatModal.tsx`
3. User sends message → `useChatAI` hook
4. POST to `/api/chat` with `analysis_id` and `message`
5. Backend queries Pinecone + Gemini
6. Response streamed to chat interface

## 🔐 Authentication

Simple localStorage-based authentication:

```typescript
// Check auth
const isAuthenticated = localStorage.getItem('quill_auth') === 'authenticated';

// Set auth
localStorage.setItem('quill_auth', 'authenticated');
```

**Note**: Demo mode automatically sets authentication.

## 🗄️ Supabase Integration

### Tables Used

- `waitlist`: Email waitlist with name, email, channels
- `analysis_history`: Stores analysis results
- `analysis_details`: Detailed metrics and insights

### Migrations

Located in `supabase/migrations/`:
- `20251227150000_create_jobs_and_details_tables.sql`
- `20251227160000_update_waitlist_table.sql`

Run these in the Supabase SQL Editor.

## 🧪 Testing

### Manual Testing Checklist

- [ ] Landing page loads with both buttons (DEMO, TRY NOW)
- [ ] DEMO button → Dashboard with pre-filled URL
- [ ] TRY NOW button → Login page
- [ ] Dashboard → Analyze → Loading screen → Report
- [ ] All charts render correctly
- [ ] Actionable insights toggle works (Creator/Competitor)
- [ ] Ask Quill chatbot opens and responds
- [ ] Waitlist form submits successfully

## 📱 Responsive Design

The app is fully responsive with breakpoints:

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

Key responsive components:
- Navigation collapses on mobile
- Charts adapt size
- Multi-column layouts stack vertically

## 🔍 Troubleshooting

### Common Issues

**Vite not found**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Module loading errors**
```bash
npm run dev -- --force
# Clear browser cache
```

**Supabase errors**
- Check `.env` file exists and has correct values
- Verify Supabase project is active
- Check RLS policies if getting permission errors

**Backend connection fails**
- Ensure backend is running on port 8000
- Check `VITE_API_URL` in `.env`
- Verify CORS settings in backend

## 📦 Dependencies

### Core
- `react` + `react-dom`: UI framework
- `react-router-dom`: Routing
- `typescript`: Type safety

### UI/Animation
- `framer-motion`: Animations
- `recharts`: Data visualization
- `lucide-react`: Icons

### State/Data
- `@supabase/supabase-js`: Database client

### Dev Tools
- `vite`: Build tool
- `eslint`: Linting
- `tailwindcss`: Styling

## 🚀 Deployment

### Build

```bash
npm run build
```

Output in `dist/` folder.

### Deploy to Vercel

```bash
vercel --prod
```

### Environment Variables

Set in Vercel dashboard:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_API_URL` (your deployed backend URL)

---

**Built with React + TypeScript + Vite**
