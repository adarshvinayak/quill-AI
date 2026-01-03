# Quill-AI: YouTube Comment Analysis Platform

**Transform YouTube comments into actionable insights with AI-powered sentiment analysis, lead detection, and deep intelligence.**

---

## 🎯 What is Quill-AI?

Quill-AI is a full-stack application that analyzes YouTube video comments to provide creators and marketers with:

- **Sentiment Analysis**: Understand how viewers feel about your content
- **Lead Detection**: Identify potential customers and business opportunities
- **Topic Extraction**: Discover what your audience is really talking about
- **Influencer Identification**: Find key voices in your comment section
- **Actionable Insights**: Get specific recommendations to improve your content or beat competitors

---

## 🏗️ Project Structure

```
quill-ai-project/
├── frontend/          # React + TypeScript + Vite
│   ├── src/
│   ├── public/
│   └── package.json
├── backend/           # FastAPI + Python
│   ├── app/
│   ├── requirements.txt
│   └── .env.template
└── README.md         # You are here
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v18+)
- **Python** (v3.10+)
- **API Keys**: Apify, OpenAI, Google Gemini, Pinecone, Supabase

### 1. Clone the Repository

```bash
git clone https://github.com/adarshvinayak/quill-AI.git
cd quill-ai-project
```

### 2. Frontend Setup

```bash
cd frontend
npm install
cp .env.template .env
# Edit .env with your Supabase credentials
npm run dev
```

Frontend runs on: **http://localhost:5173**

### 3. Backend Setup

```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.template .env
# Edit .env with your API keys
uvicorn app.main:app --reload --port 8000
```

Backend runs on: **http://localhost:8000**

---

## 🔧 Configuration

### Frontend Environment Variables

Create `frontend/.env`:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_URL=http://localhost:8000
```

### Backend Environment Variables

Create `backend/.env`:

```env
# API Keys
APIFY_API_TOKEN=your_apify_token
OPENAI_API_KEY=your_openai_key
GOOGLE_API_KEY=your_gemini_key
PINECONE_API_KEY=your_pinecone_key
PINECONE_INDEX_NAME=your_index_name

# Supabase
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_service_key

# CORS
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

---

## 🗄️ Database Setup

### Supabase Migrations

Run the migrations in order:

```bash
cd frontend/supabase/migrations
# Apply each migration in the Supabase SQL Editor
```

Required tables:
- `waitlist` - User waitlist and feedback
- `analysis_jobs` - Job tracking and progress
- `analysis_history` - Analysis results
- `analysis_details` - Detailed metrics and insights

### Pinecone Index

Create a Pinecone index with:
- **Dimensions**: 1536 (for OpenAI text-embedding-3-small)
- **Metric**: Cosine
- **Cloud**: AWS (recommended)
- **Region**: us-east-1 (recommended)

---

## 📚 Documentation

- **[Frontend README](./frontend/README.md)** - React app structure and components
- **[Backend README](./backend/README.md)** - API endpoints and services
- **[Setup Guide](./backend/SETUP_GUIDE.md)** - Detailed installation instructions
- **[Analysis Flow](./backend/ANALYSIS_FLOW_VERIFICATION.md)** - How the analysis pipeline works

---

## 🎨 Features

### Demo Mode
Try the platform without signing up:
- Pre-loaded analysis of a sample video
- All visualizations and insights
- No API calls made

### Production Mode
Real-time analysis of any YouTube video:
- Scrapes up to 2000 comments
- Generates embeddings for semantic search
- AI-powered analysis with Gemini
- Stores data for future retrieval
- RAG-powered chatbot for Q&A

### Dual Insights
View insights from two perspectives:
- **Creator Mode**: Improve your own content based on feedback
- **Competitor Mode**: Learn from successful competitors

---

## 🛠️ Tech Stack

### Frontend
- **React** + **TypeScript** + **Vite**
- **Framer Motion** (animations)
- **Recharts** (data visualization)
- **Tailwind CSS** (styling)
- **Supabase** (authentication & database)

### Backend
- **FastAPI** (Python web framework)
- **OpenAI** (text embeddings)
- **Google Gemini** (AI analysis)
- **Pinecone** (vector database)
- **Apify** (YouTube comment scraping)
- **Supabase** (database)

---

## 🌐 Architecture

```
User → Frontend (React)
  ↓
Backend (FastAPI)
  ↓
1. Apify → Scrape YouTube Comments
2. OpenAI → Generate Embeddings
3. Pinecone → Store Vectors
4. Gemini → Analyze & Extract Insights
5. Supabase → Save Results
  ↓
Frontend ← Display Report
```

---

## 📊 Analysis Pipeline

1. **Fetch Comments**: Apify scrapes YouTube comments (max 2000)
2. **Parse Data**: Clean and structure comment data
3. **Generate Embeddings**: OpenAI creates vector embeddings (parallel)
4. **Store Vectors**: Pinecone stores embeddings for RAG
5. **AI Analysis**: Gemini analyzes sentiment, topics, leads, insights (parallel)
6. **Save Results**: Supabase stores complete analysis
7. **Display Report**: Frontend shows visualizations and insights

**Progress Tracking**: Real-time updates every 10 seconds with dual progress bars

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is proprietary. All rights reserved.

---

## 👤 Author

**Adarsh Vinayak**

- GitHub: [@adarshvinayak](https://github.com/adarshvinayak)

---

## 🐛 Issues & Support

Found a bug or have a question? Please open an issue on GitHub.

---

## 🎯 Roadmap

- [ ] Multi-platform support (TikTok, Instagram, Twitter)
- [ ] Real-time comment monitoring
- [ ] Automated report scheduling
- [ ] Export to PDF/CSV
- [ ] Team collaboration features
- [ ] Advanced filtering and segmentation
- [ ] Webhook integrations

---

**Built with ❤️ for content creators and marketers**

