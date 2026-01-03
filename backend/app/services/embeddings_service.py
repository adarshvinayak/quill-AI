from openai import OpenAI
from app.config import settings
import logging
from typing import List, Callable, Optional
import asyncio

logger = logging.getLogger(__name__)


class EmbeddingsService:
    def __init__(self):
        self.client = OpenAI(api_key=settings.openai_api_key)
        self.model = "text-embedding-3-small"
        self.batch_size = 100
    
    async def get_embeddings(
        self,
        texts: List[str],
        progress_callback: Optional[Callable[[int], None]] = None
    ) -> List[List[float]]:
        """
        Generate embeddings for a list of texts using OpenAI.
        
        Args:
            texts: List of text strings to embed
            progress_callback: Optional callback to report progress (0-100)
            
        Returns:
            List of embedding vectors (1536 dimensions each)
        """
        try:
            total_texts = len(texts)
            all_embeddings = []
            
            logger.info(f"Generating embeddings for {total_texts} texts")
            
            # Process in batches of 100
            for i in range(0, total_texts, self.batch_size):
                batch = texts[i:i + self.batch_size]
                
                # Call OpenAI API (synchronous, but we'll run in background)
                response = self.client.embeddings.create(
                    model=self.model,
                    input=batch
                )
                
                # Extract embeddings from response
                batch_embeddings = [item.embedding for item in response.data]
                all_embeddings.extend(batch_embeddings)
                
                # Report progress
                progress = int(((i + len(batch)) / total_texts) * 100)
                if progress_callback:
                    progress_callback(progress)
                
                logger.info(f"Processed batch {i//self.batch_size + 1}/{(total_texts + self.batch_size - 1)//self.batch_size}")
                
                # Small delay to avoid rate limits
                await asyncio.sleep(0.1)
            
            logger.info(f"Generated {len(all_embeddings)} embeddings")
            return all_embeddings
            
        except Exception as e:
            logger.error(f"Error generating embeddings: {str(e)}")
            raise Exception(f"Failed to generate embeddings: {str(e)}")


# Singleton instance
embeddings_service = EmbeddingsService()




