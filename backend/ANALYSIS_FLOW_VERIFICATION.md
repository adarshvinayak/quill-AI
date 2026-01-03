# Analysis Flow Verification & Troubleshooting Guide

## ✅ System Status Check

### Backend Status: ✅ RUNNING
- **Port**: 8000
- **Endpoint Test**: ✅ Working (tested `/api/analyze`)
- **Response**: Returns `job_id` and `status: PROCESSING`

### Frontend Configuration: ✅ CONFIGURED
- **VITE_API_URL**: `http://localhost:8000`
- **VITE_SUPABASE_URL**: Configured
- **VITE_SUPABASE_ANON_KEY**: Configured

---

## 🔄 Complete Analysis Flow

### Step 1: User Clicks "ANALYZE NOW" Button
**Location**: `/src/pages/Dashboard.tsx` (Line 60-104)

**What Happens**:
1. Validates YouTube URL (lines 63-71)
2. Checks if demo mode (lines 74-77)
3. Makes POST request to backend `/api/analyze` (lines 84-90)
4. Receives `job_id` from backend (line 98)
5. Passes `job_id` to LoadingSequence component (line 117)

**Potential Issues**:
- ❌ **Empty URL**: Shows error "Please enter a URL"
- ❌ **Invalid URL**: Shows error "Please enter a valid YouTube URL"
- ❌ **Backend unreachable**: Error caught in try-catch (line 100-103)
- ❌ **CORS error**: Backend CORS origins must include `http://localhost:5173`

---

### Step 2: Backend Creates Job
**Location**: `/app/routes/analyze.py` (Line 28-79)

**What Happens**:
1. Validates YouTube URL regex (lines 38-43)
2. Generates UUID for job_id (line 46)
3. **Creates entry in `analysis_jobs` table** in Supabase (lines 49-56)
4. Creates job in memory (line 59)
5. Starts background task (lines 62-66)
6. Returns job_id to frontend (lines 70-73)

**Database Schema Required**:
```sql
-- analysis_jobs table must exist
CREATE TABLE analysis_jobs (
    id uuid PRIMARY KEY,
    url text NOT NULL,
    status text NOT NULL,
    embeddings_progress integer DEFAULT 0,
    gemini_progress integer DEFAULT 0,
    error text,
    created_at timestamp DEFAULT now(),
    completed_at timestamp,
    analysis_id uuid
);
```

**Potential Issues**:
- ❌ **Table doesn't exist**: Migration not applied
- ❌ **Invalid API keys**: Check `.env` file
- ❌ **Supabase connection failed**: Check `SUPABASE_URL` and `SUPABASE_KEY`

---

### Step 3: Background Processing
**Location**: `/app/services/job_manager.py`

**What Happens** (in order):
1. **Fetch comments** from Apify YouTube scraper
   - Uses `APIFY_API_TOKEN`
   - Scrapes up to 2000 comments
   
2. **Parse comments**
   - Filters valid comments
   - Creates `text_for_embedding` field
   
3. **Generate embeddings** (Parallel with Gemini)
   - Uses OpenAI `text-embedding-3-small`
   - Processes in batches
   - **Updates `embeddings_progress`** in real-time
   
4. **Upsert to Pinecone**
   - Stores vectors with metadata
   - Uses `analysis_id` as namespace
   
5. **Gemini AI Analysis** (Parallel with embeddings)
   - Sentiment analysis
   - Lead detection
   - Topic extraction
   - Influencer identification
   - **Actionable insights** (creator & competitor modes)
   - **Updates `gemini_progress`** in real-time

6. **Save to Supabase**
   - Creates `analysis_history` entry
   - Creates `analysis_details` entry
   - Updates `analysis_jobs` with `analysis_id` and status=COMPLETED

**Required Tables**:
```sql
-- analysis_history
CREATE TABLE analysis_history (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    url text NOT NULL,
    platform text DEFAULT 'youtube',
    sentiment_score integer,
    lead_percentage integer,
    total_comments integer,
    created_at timestamp DEFAULT now()
);

-- analysis_details
CREATE TABLE analysis_details (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    analysis_history_id uuid REFERENCES analysis_history(id),
    sentiment_breakdown jsonb,
    leads jsonb,
    top_feedback_topics jsonb,
    top_discussed_topics jsonb,
    creator_insights jsonb,
    competitor_insights jsonb,
    engagement_spikes jsonb,
    top_influencers jsonb,
    vibe_trend jsonb,
    created_at timestamp DEFAULT now()
);
```

**API Keys Required**:
- ✅ `APIFY_API_TOKEN`
- ✅ `OPENAI_API_KEY`
- ✅ `GOOGLE_API_KEY` (Gemini)
- ✅ `PINECONE_API_KEY`
- ✅ `PINECONE_INDEX_NAME` (must exist with 1536 dimensions, cosine metric)

**Potential Issues**:
- ❌ **Apify fails**: Invalid token or YouTube URL inaccessible
- ❌ **OpenAI fails**: Invalid key or rate limit exceeded
- ❌ **Pinecone fails**: Invalid key or index doesn't exist
- ❌ **Gemini fails**: Invalid key or quota exceeded
- ❌ **Supabase insert fails**: Schema mismatch or permissions issue

---

### Step 4: Frontend Polls for Status
**Location**: `/src/components/dashboard/LoadingSequence.tsx` (Line 66-118)

**What Happens**:
1. Polls `/api/status/{job_id}` **every 10 seconds** (line 112)
2. Updates `embeddings_progress` and `gemini_progress` (lines 79-80)
3. Updates estimated time remaining (line 81)
4. Updates current step visual (lines 85-97)
5. When status=COMPLETED, calls `onComplete(analysis_id)` (line 101)

**Potential Issues**:
- ❌ **Polling too slow**: Hardcoded to 10 seconds
- ❌ **Network error**: Caught in try-catch, shows error screen
- ❌ **Status never completes**: Check backend logs for errors

---

### Step 5: Navigate to Report
**Location**: `/src/pages/Dashboard.tsx` (Line 106-110)

**What Happens**:
1. `onComplete` callback triggered
2. Navigates to `/report/{analysis_id}` (line 109)

---

### Step 6: Load Report Data
**Location**: `/src/pages/ReportPage.tsx` (Line 66-82)

**What Happens**:
1. Fetches data from `/api/analysis/{analysis_id}` (line 69)
2. Loads from `analysis_history` and `analysis_details` tables
3. Displays full report with all visualizations

**Backend Route**: `/app/routes/analyze.py` (Line 132-180)

**Potential Issues**:
- ❌ **Analysis not found**: 404 error if ID doesn't exist
- ❌ **Data format mismatch**: Check if all fields are present

---

## 🔍 Troubleshooting "Button Does Nothing"

### Check 1: Is the button actually being clicked?
Add console log in Dashboard.tsx:
```typescript
const handleAnalyze = async () => {
  console.log('🔵 ANALYZE BUTTON CLICKED'); // ADD THIS
  console.log('URL:', url);
  console.log('isDemoMode:', isDemoMode);
  setUrlError('');
  // ... rest of function
```

### Check 2: Is there a validation error?
The button might be failing validation silently. Check:
- Empty URL check (line 63)
- YouTube URL validation (line 68)

### Check 3: Is the backend reachable?
Open browser console and check Network tab for:
- Request to `http://localhost:8000/api/analyze`
- Response status (should be 200)
- CORS errors

### Check 4: Is loading state being set?
Check if `setLoading(true)` is being called (line 81)
Check if LoadingSequence is mounting (line 114-118)

### Check 5: Backend logs
Check backend terminal for:
```
INFO:     POST /api/analyze
INFO:     Started analysis job {job_id} for URL: {url}
```

---

## 🧪 Manual Testing Steps

### Test 1: Backend Health
```bash
curl http://localhost:8000/
# Expected: {"message":"Quill-AI Backend API","status":"running"}
```

### Test 2: Analyze Endpoint
```bash
curl -X POST http://localhost:8000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"url":"https://www.youtube.com/watch?v=dQw4w9WgXcQ"}'
# Expected: {"job_id":"...", "status":"PROCESSING"}
```

### Test 3: Status Endpoint
```bash
curl http://localhost:8000/api/status/{job_id}
# Expected: {"status":"PROCESSING","embeddings_progress":0,"gemini_progress":0,...}
```

### Test 4: Frontend in Browser
1. Open DevTools → Network tab
2. Click "ANALYZE NOW"
3. Look for POST request to `/api/analyze`
4. Check response

---

## ⚠️ Common Issues & Solutions

### Issue 1: CORS Error
**Symptom**: Console shows "CORS policy" error
**Solution**: 
- Check backend `.env`: `CORS_ORIGINS=http://localhost:5173,http://localhost:3000`
- Restart backend server

### Issue 2: Button Click Does Nothing
**Symptom**: No network request, no error
**Possible Causes**:
- `loading` state already true (LoadingSequence mounted)
- JavaScript error preventing execution
- Event handler not attached
**Solution**: Check browser console for JS errors

### Issue 3: Request Fails Silently
**Symptom**: Network request made but frontend doesn't respond
**Possible Causes**:
- Response parsing error (line 94)
- Job ID not set (line 98)
**Solution**: Add try-catch logging

### Issue 4: Infinite Loading
**Symptom**: Loading screen never completes
**Possible Causes**:
- Background task crashed
- Database insert failed
- Status never updates to COMPLETED
**Solution**: Check backend logs

---

## 📝 Quick Debug Checklist

- [ ] Backend running on port 8000
- [ ] Frontend `.env` has `VITE_API_URL=http://localhost:8000`
- [ ] Backend `.env` has all API keys
- [ ] Supabase migrations applied (analysis_jobs, analysis_history, analysis_details)
- [ ] Pinecone index exists (1536 dimensions)
- [ ] Browser console has no errors
- [ ] Network tab shows POST to `/api/analyze`
- [ ] Backend terminal shows job creation log

---

## 🎯 Next Steps for User

1. **Open browser console** (F12)
2. **Click "ANALYZE NOW"** button
3. **Check Network tab** for POST request
4. **Check Console tab** for any errors
5. **Check backend terminal** for logs
6. **Report what you see** (request made? error shown? nothing happens?)

This will help pinpoint exactly where the flow is breaking!




