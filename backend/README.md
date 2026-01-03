# Quill-AI Backend

FastAPI backend for YouTube comment analysis with AI-powered insights.

## 🚀 Quick Start

```bash
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.template .env
# Edit .env with your API keys
uvicorn app.main:app --reload --port 8000
```

Server runs on: **http://localhost:8000**

API docs: **http://localhost:8000/docs**

## 📁 Project Structure

```
app/
├── main.py              # FastAPI app entry point
├── config.py            # Environment variables & settings
├── models.py            # Pydantic models
├── database.py          # Supabase client
├── routes/              # API endpoints
│   ├── analyze.py       # Analysis endpoints
│   └── chat.py          # Chat endpoints
└── services/            # Business logic
    ├── apify_service.py       # YouTube comment scraping
    ├── parser_service.py      # Data parsing & cleaning
    ├── embeddings_service.py  # OpenAI embeddings
    ├── pinecone_service.py    # Vector database
    ├── gemini_service.py      # AI analysis
    └── job_manager.py         # Job tracking & progress
```

## 🔧 Environment Variables

Create `.env` file:

```env
# API Keys
APIFY_API_TOKEN=your_apify_token
OPENAI_API_KEY=sk-proj-...
GOOGLE_API_KEY=AIza...
PINECONE_API_KEY=pcsk_...
PINECONE_INDEX_NAME=quill-ai

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your_service_role_key

# CORS (comma-separated)
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

## 🛠️ API Endpoints

### Health Check

```bash
GET /
Response: {"message": "Quill-AI Backend API", "status": "running"}
```

### Start Analysis

```bash
POST /api/analyze
Body: {"url": "https://www.youtube.com/watch?v=..."}
Response: {"job_id": "uuid", "status": "PROCESSING"}
```

### Check Job Status

```bash
GET /api/status/{job_id}
Response: {
  "status": "PROCESSING",
  "embeddings_progress": 45,
  "gemini_progress": 30,
  "estimated_time_remaining": 120,
  "error": null,
  "analysis_id": null
}
```

### Get Analysis Results

```bash
GET /api/analysis/{analysis_id}
Response: {
  "id": "uuid",
  "url": "...",
  "sentimentScore": 75,
  "leadPercentage": 12,
  "totalComments": 1543,
  "createdAt": "2025-01-03T...",
  "sentimentBreakdown": {...},
  "leads": [...],
  "topFeedbackTopics": [...],
  "topDiscussedTopics": [...],
  "creatorInsights": [...],
  "competitorInsights": [...],
  "engagementSpikes": [...],
  "topInfluencers": [...],
  "vibeTrend": [...]
}
```

### Chat with AI

```bash
POST /api/chat
Body: {
  "message": "What are the main complaints?",
  "analysis_id": "uuid"
}
Response: {
  "response": "Based on the comments, the main complaints are..."
}
```

## 🔄 Analysis Pipeline

### 1. Fetch Comments (Apify)

```python
from app.services.apify_service import fetch_comments

comments = await fetch_comments(youtube_url)
# Returns: List of raw comment dictionaries
```

**Service**: `apify_service.py`  
**Actor**: YouTube Comments Scraper  
**Max Comments**: 2000

### 2. Parse Comments

```python
from app.services.parser_service import parse_quill_comments

parsed_comments = parse_quill_comments(raw_comments)
# Returns: List[Comment] with structured data
```

**Service**: `parser_service.py`  
**Output**: Clean Comment objects with `text_for_embedding`

### 3. Generate Embeddings

```python
from app.services.embeddings_service import get_embeddings

embeddings = await get_embeddings(
    comments,
    progress_callback=lambda p: print(f"Progress: {p}%")
)
# Returns: List of 1536-dimensional vectors
```

**Service**: `embeddings_service.py`  
**Model**: OpenAI `text-embedding-3-small`  
**Dimensions**: 1536  
**Batch Size**: 100

### 4. Store in Pinecone

```python
from app.services.pinecone_service import upsert_to_pinecone

await upsert_to_pinecone(
    comments,
    embeddings,
    analysis_id,
    namespace=analysis_id
)
```

**Service**: `pinecone_service.py`  
**Index**: Configured in `.env`  
**Namespace**: Unique per analysis (isolation)

### 5. AI Analysis (Gemini)

```python
from app.services.gemini_service import analyze_with_gemini

result = await analyze_with_gemini(
    comments,
    progress_callback=lambda p: print(f"Progress: {p}%")
)
# Returns: AnalysisResult with all insights
```

**Service**: `gemini_service.py`  
**Model**: Gemini 1.5 Pro  
**Output**: Sentiment, leads, topics, insights, trends

### 6. Save to Supabase

```python
# Insert into analysis_history
history = supabase.table('analysis_history').insert({...}).execute()

# Insert into analysis_details
details = supabase.table('analysis_details').insert({...}).execute()
```

**Tables**: `analysis_history`, `analysis_details`

## 🗄️ Database Schema

### analysis_jobs

```sql
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

### analysis_history

```sql
CREATE TABLE analysis_history (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    url text NOT NULL,
    platform text DEFAULT 'youtube',
    sentiment_score integer,
    lead_percentage integer,
    total_comments integer,
    created_at timestamp DEFAULT now()
);
```

### analysis_details

```sql
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

## 🧠 AI Analysis Details

### Gemini Prompt Structure

The Gemini service uses a carefully crafted prompt to extract:

1. **Sentiment Analysis**: Positive/neutral/negative breakdown
2. **Lead Detection**: Comments indicating buying interest
3. **Topic Extraction**: Most discussed and feedback topics
4. **Influencer Identification**: High-engagement commenters
5. **Engagement Spikes**: Time-based engagement patterns
6. **Vibe Trend**: Sentiment changes over time
7. **Creator Insights**: Actionable advice for video owner
8. **Competitor Insights**: Strategic learnings for competitors

**Output Format**: Strict JSON matching `AnalysisResult` model

### RAG Chat System

The chat endpoint uses **Retrieval-Augmented Generation**:

1. Query Pinecone with question embedding
2. Retrieve top 10 most relevant comments
3. Pass comments + question to Gemini
4. Generate contextual response

**Benefits**: Accurate, grounded answers from actual comment data

## 🚀 Performance Optimization

### Parallel Processing

Embeddings and Gemini analysis run **in parallel**:

```python
embeddings_task = asyncio.create_task(get_embeddings(...))
gemini_task = asyncio.create_task(analyze_with_gemini(...))

embeddings, result = await asyncio.gather(embeddings_task, gemini_task)
```

**Speed Improvement**: ~40% faster than sequential

### Progress Tracking

Both services provide real-time progress callbacks:

```python
def update_progress(progress: int):
    supabase.table('analysis_jobs').update({
        'embeddings_progress': progress
    }).eq('id', job_id).execute()
```

**Update Frequency**: Every batch completion

### Background Tasks

Analysis runs in FastAPI background tasks:

```python
@app.post("/api/analyze")
async def analyze(request: AnalyzeRequest, background_tasks: BackgroundTasks):
    background_tasks.add_task(process_analysis, job_id, url)
    return {"job_id": job_id, "status": "PROCESSING"}
```

**Benefit**: Immediate response, no timeout issues

## 🔍 Troubleshooting

### Common Issues

**Pydantic validation error on startup**
- Missing environment variables in `.env`
- Check all required keys are set

**Apify API fails**
- Invalid token
- YouTube URL not accessible
- Rate limit exceeded

**OpenAI API fails**
- Invalid API key
- Rate limit or quota exceeded
- Network/proxy issues

**Pinecone connection fails**
- Invalid API key
- Index doesn't exist
- Wrong dimensions (must be 1536)

**Gemini API fails**
- Invalid API key
- Quota exceeded
- Response format doesn't match expected JSON

**Supabase insert fails**
- Missing tables (run migrations)
- Schema mismatch
- RLS policies blocking insert

## 📦 Dependencies

### Core Framework
- `fastapi`: Web framework
- `uvicorn`: ASGI server
- `pydantic`: Data validation
- `python-dotenv`: Environment variables

### AI/ML Services
- `openai`: Embeddings
- `google-generativeai`: Gemini AI
- `pinecone`: Vector database
- `apify-client`: Web scraping

### Database
- `supabase`: PostgreSQL client

### Utilities
- `httpx`: Async HTTP client
- `python-dateutil`: Date parsing

## 🧪 Testing

### Test Individual Services

```python
# Test Apify
from app.services.apify_service import fetch_comments
comments = await fetch_comments("https://youtube.com/...")

# Test Embeddings
from app.services.embeddings_service import get_embeddings
embeddings = await get_embeddings(comments)

# Test Gemini
from app.services.gemini_service import analyze_with_gemini
result = await analyze_with_gemini(comments)
```

### Manual API Testing

Use the interactive docs at `http://localhost:8000/docs`

Or use `curl`:

```bash
# Start analysis
curl -X POST http://localhost:8000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"url":"https://www.youtube.com/watch?v=dQw4w9WgXcQ"}'

# Check status
curl http://localhost:8000/api/status/{job_id}

# Get results
curl http://localhost:8000/api/analysis/{analysis_id}
```

## 📊 Monitoring

### Logs

FastAPI provides detailed logs:

```
INFO:     Started server process [12345]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     POST /api/analyze
INFO:     Started analysis job abc123 for URL: https://...
```

### Job Status

Monitor job progress in real-time:

```python
job = supabase.table('analysis_jobs').select('*').eq('id', job_id).execute()
print(f"Embeddings: {job.data[0]['embeddings_progress']}%")
print(f"Gemini: {job.data[0]['gemini_progress']}%")
```

## 🚀 Deployment

### Docker (Recommended)

```dockerfile
FROM python:3.10-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Railway / Render

1. Connect GitHub repo
2. Set environment variables
3. Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

### AWS / GCP / Azure

Deploy as containerized service or serverless function.

---

**Built with FastAPI + Python**
