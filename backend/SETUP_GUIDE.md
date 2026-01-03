# Quill-AI Complete Setup Guide

## Overview

This guide will help you set up both the frontend and backend for Quill-AI, transforming it from a dummy-data prototype to a fully functional YouTube comment analysis platform.

## Prerequisites

### Backend
- Python 3.9+
- pip

### Frontend
- Node.js 16+
- npm or yarn

### External Services
1. **Apify Account** - For YouTube comment scraping
2. **OpenAI API Key** - For embeddings generation
3. **Google Cloud Account** - For Gemini API access
4. **Pinecone Account** - For vector storage
5. **Supabase Project** - For database

## Step 1: Backend Setup

### 1.1 Install Python Dependencies

```bash
cd /home/adarshvinayak/Documents/quill-AI-backend
pip install -r requirements.txt
```

### 1.2 Configure Environment Variables

Create a `.env` file from the template:

```bash
cp .env.template .env
```

Edit `.env` and fill in your API keys:

```bash
# Apify
APIFY_API_TOKEN=your_apify_token

# OpenAI
OPENAI_API_KEY=your_openai_key

# Google Gemini
GOOGLE_API_KEY=your_google_key

# Pinecone
PINECONE_API_KEY=your_pinecone_key
PINECONE_INDEX_NAME=quill-ai-comments

# Supabase
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_key

# Server
PORT=8000
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

### 1.3 Set Up Pinecone Index

1. Go to [Pinecone Console](https://app.pinecone.io/)
2. Create a new index with these settings:
   - **Name**: `quill-ai-comments`
   - **Dimensions**: `1536` (for text-embedding-3-small)
   - **Metric**: `cosine`
   - **Cloud**: AWS
   - **Region**: us-east-1

### 1.4 Run Database Migrations

In your Supabase project, run the migration file:

```sql
-- Located at: /home/adarshvinayak/Documents/quill-AI/supabase/migrations/20251227150000_create_jobs_and_details_tables.sql
```

This creates:
- `analysis_jobs` table
- `analysis_details` table

### 1.5 Start the Backend Server

```bash
python -m app.main
```

Or with uvicorn:

```bash
uvicorn app.main:app --reload --port 8000
```

The backend will be available at `http://localhost:8000`

## Step 2: Frontend Setup

### 2.1 Install Node Dependencies

```bash
cd /home/adarshvinayak/Documents/quill-AI
npm install
```

### 2.2 Configure Environment Variables

Create a `.env` file (note: .env files are gitignored, so you need to create it manually):

```bash
# Create .env file
cat > .env << 'EOF'
# Supabase
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Backend API
VITE_API_URL=http://localhost:8000
EOF
```

### 2.3 Start the Frontend

```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

## Step 3: Testing the Integration

### 3.1 Test Backend Health

```bash
curl http://localhost:8000/health
```

Expected response:
```json
{"status": "healthy"}
```

### 3.2 Test Full Flow

1. Open `http://localhost:5173` in your browser
2. Navigate to Dashboard
3. Enter a YouTube video URL (e.g., `https://www.youtube.com/watch?v=dQw4w9WgXcQ`)
4. Click "Analyze Now"
5. Watch the loading screen with dual progress bars
6. View the analysis report
7. Test the "Ask Quill" chat feature

## Architecture Flow

```
User enters URL
    ↓
Frontend calls POST /api/analyze
    ↓
Backend creates job in Supabase
    ↓
Background task starts:
    ├─ Apify fetches comments
    ├─ Parser cleans data
    ├─ (Parallel)
    │   ├─ OpenAI generates embeddings → Pinecone stores vectors
    │   └─ Gemini analyzes sentiment/leads
    └─ Results saved to Supabase
    ↓
Frontend polls GET /api/status/{job_id} every 10s
    ↓
When complete, frontend navigates to /report/{analysis_id}
    ↓
Frontend calls GET /api/analysis/{analysis_id}
    ↓
Report displayed with full analysis
    ↓
Chat uses POST /api/chat with RAG from Pinecone
```

## API Endpoints Reference

### POST /api/analyze
Start analysis for a YouTube URL.

### GET /api/status/{job_id}
Poll job status with progress updates.

### GET /api/analysis/{analysis_id}
Retrieve complete analysis results.

### POST /api/chat
Chat with AI using RAG (Retrieval-Augmented Generation).

## Troubleshooting

### Backend Issues

**Error: "Missing Supabase environment variables"**
- Ensure `.env` file exists in backend directory
- Check that all required variables are set

**Error: "Failed to connect to Pinecone"**
- Verify Pinecone API key is correct
- Ensure index name matches exactly
- Check that index dimensions are 1536

**Error: "Apify actor failed"**
- Verify Apify API token is valid
- Check that the YouTube URL is accessible
- Ensure Apify has sufficient credits

### Frontend Issues

**Error: "Failed to start analysis"**
- Check that backend is running on port 8000
- Verify VITE_API_URL is set correctly
- Check browser console for CORS errors

**Loading screen stuck at 0%**
- Check backend logs for errors
- Verify job was created in Supabase
- Test backend health endpoint

**Report page shows "Analysis not found"**
- Ensure analysis completed successfully
- Check Supabase for analysis_history record
- Verify analysis_id in URL is correct

## Production Deployment

### Backend Deployment

Recommended platforms:
- **Railway**: Easy Python deployment
- **Render**: Free tier available
- **DigitalOcean**: App Platform

Environment variables to set:
- All variables from `.env`
- Update `CORS_ORIGINS` to include production frontend URL

### Frontend Deployment

Recommended platforms:
- **Vercel**: Automatic deployments
- **Netlify**: Great for React apps
- **Cloudflare Pages**: Fast global CDN

Environment variables to set:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_API_URL` (production backend URL)

## Cost Estimates

### Per Analysis (500 comments)

- **Apify**: ~$0.10-0.20
- **OpenAI Embeddings**: ~$0.01 (500 texts × $0.00002/1K tokens)
- **Gemini API**: ~$0.02-0.05
- **Pinecone**: Free tier (100K vectors)
- **Supabase**: Free tier

**Total per analysis**: ~$0.15-0.30

## Security Notes

1. **Never commit `.env` files** - They contain sensitive API keys
2. **Use Supabase RLS** - Enable Row Level Security in production
3. **Rate limiting** - Consider adding rate limits to prevent abuse
4. **API key rotation** - Rotate keys periodically
5. **HTTPS only** - Use HTTPS in production

## Support

For issues or questions:
1. Check backend logs: `tail -f logs/app.log`
2. Check frontend console: Browser DevTools
3. Review Supabase logs in dashboard
4. Check Pinecone index stats

## Next Steps

1. **Add authentication** - Implement user accounts
2. **Add payment** - Integrate Stripe for credits
3. **Add more platforms** - Instagram, Twitter support
4. **Add exports** - CSV/PDF report downloads
5. **Add webhooks** - Notify when analysis completes

## Files Changed/Created

### Backend (New)
- `/home/adarshvinayak/Documents/quill-AI-backend/` (entire directory)
- All service files, routes, models, config

### Frontend (Modified)
- `src/pages/Dashboard.tsx` - API integration
- `src/pages/ReportPage.tsx` - Fetch from backend
- `src/components/dashboard/LoadingSequence.tsx` - Polling with progress
- `src/hooks/useChatAI.ts` - RAG backend integration
- `src/components/chat/ChatModal.tsx` - Pass analysis ID
- `src/components/chat/AskQuillFAB.tsx` - Pass analysis ID

### Database (New)
- `supabase/migrations/20251227150000_create_jobs_and_details_tables.sql`

## Success Checklist

- [ ] Backend running on port 8000
- [ ] Frontend running on port 5173
- [ ] Pinecone index created (1536 dimensions)
- [ ] Supabase migrations applied
- [ ] All API keys configured
- [ ] Test analysis completes successfully
- [ ] Chat feature works with RAG
- [ ] Progress bars update during analysis
- [ ] Report displays all data correctly

Congratulations! Your Quill-AI platform is now fully integrated and ready for real YouTube comment analysis! 🎉




