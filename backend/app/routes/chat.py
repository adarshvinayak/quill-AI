from fastapi import APIRouter, HTTPException
from app.models import ChatRequest, ChatResponse
from app.services.embeddings_service import embeddings_service
from app.services.pinecone_service import pinecone_service
from openai import OpenAI
import google.generativeai as genai
from app.config import settings
import logging

logger = logging.getLogger(__name__)
router = APIRouter()

# Initialize AI clients
openai_client = OpenAI(api_key=settings.openai_api_key)
genai.configure(api_key=settings.google_api_key)


@router.post("/chat", response_model=ChatResponse)
async def chat_with_analysis(request: ChatRequest):
    """
    Chat with AI about the analysis using RAG.
    Queries Pinecone for relevant comments and sends to AI.
    """
    try:
        logger.info(f"Chat request for analysis {request.analysis_id} using {request.model}")
        
        # Step 1: Generate embedding for the user's message
        query_embeddings = await embeddings_service.get_embeddings([request.message])
        query_embedding = query_embeddings[0]
        
        # Step 2: Query Pinecone for similar comments
        similar_comments = await pinecone_service.query_similar(
            query_embedding,
            request.analysis_id,
            top_k=10
        )
        
        # Step 3: Prepare context from similar comments
        context = "Relevant comments from the analysis:\n\n"
        for i, comment in enumerate(similar_comments, 1):
            metadata = comment["metadata"]
            context += f"{i}. @{metadata['author']} (Likes: {metadata['voteCount']}, Replies: {metadata['replyCount']})\n"
            context += f"   {metadata['comment_text']}\n"
            context += f"   Date: {metadata['date']}\n\n"
        
        # Step 4: Send to AI with context
        if request.model == "gpt-4o":
            response_text = await _chat_with_openai(request.message, context)
        else:  # gemini-2.0-flash-exp
            response_text = await _chat_with_gemini(request.message, context)
        
        return ChatResponse(response=response_text)
        
    except Exception as e:
        logger.error(f"Error in chat: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Chat failed: {str(e)}")


async def _chat_with_openai(message: str, context: str) -> str:
    """Send chat request to OpenAI."""
    try:
        system_prompt = """You are Quill AI, an expert analyst for YouTube comment analysis. 
Answer questions based ONLY on the provided comment context. 
Be direct, blunt, and data-driven. Use bullet points for readability.
If the context doesn't contain relevant information, say so."""
        
        response = openai_client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "system", "content": f"Context:\n{context}"},
                {"role": "user", "content": message}
            ],
            temperature=0.7,
            max_tokens=500
        )
        
        return response.choices[0].message.content
        
    except Exception as e:
        logger.error(f"OpenAI chat error: {str(e)}")
        raise


async def _chat_with_gemini(message: str, context: str) -> str:
    """Send chat request to Gemini."""
    try:
        model = genai.GenerativeModel('gemini-2.0-flash-exp')
        
        prompt = f"""You are Quill AI, an expert analyst for YouTube comment analysis.
Answer questions based ONLY on the provided comment context.
Be direct, blunt, and data-driven. Use bullet points for readability.
If the context doesn't contain relevant information, say so.

Context:
{context}

User question: {message}"""
        
        response = model.generate_content(prompt)
        return response.text
        
    except Exception as e:
        logger.error(f"Gemini chat error: {str(e)}")
        raise




