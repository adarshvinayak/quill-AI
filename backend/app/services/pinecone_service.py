from pinecone import Pinecone, ServerlessSpec
from app.config import settings
import logging
from typing import List, Dict, Any

logger = logging.getLogger(__name__)


class PineconeService:
    def __init__(self):
        self.pc = Pinecone(api_key=settings.pinecone_api_key)
        self.index_name = settings.pinecone_index_name
        self.index = None
        self._initialize_index()
    
    def _initialize_index(self):
        """Initialize or connect to existing Pinecone index."""
        try:
            # Check if index exists
            existing_indexes = [index.name for index in self.pc.list_indexes()]
            
            if self.index_name not in existing_indexes:
                logger.info(f"Creating Pinecone index: {self.index_name}")
                # Create index with 1536 dimensions (text-embedding-3-small)
                self.pc.create_index(
                    name=self.index_name,
                    dimension=1536,
                    metric="cosine",
                    spec=ServerlessSpec(
                        cloud="aws",
                        region="us-east-1"
                    )
                )
            
            # Connect to index
            self.index = self.pc.Index(self.index_name)
            logger.info(f"Connected to Pinecone index: {self.index_name}")
            
        except Exception as e:
            logger.error(f"Error initializing Pinecone: {str(e)}")
            raise
    
    async def upsert_to_pinecone(
        self,
        parsed_comments: List[Dict[str, Any]],
        embeddings: List[List[float]],
        analysis_id: str
    ):
        """
        Upsert comment embeddings to Pinecone with metadata.
        
        Args:
            parsed_comments: List of parsed comment objects
            embeddings: List of embedding vectors
            analysis_id: Analysis ID to use as namespace
        """
        try:
            if len(parsed_comments) != len(embeddings):
                raise ValueError("Number of comments and embeddings must match")
            
            logger.info(f"Upserting {len(parsed_comments)} vectors to Pinecone namespace: {analysis_id}")
            
            # Prepare vectors for upsert
            vectors = []
            for comment, embedding in zip(parsed_comments, embeddings):
                vector = {
                    "id": comment["id"],
                    "values": embedding,
                    "metadata": {
                        "author": comment["author"],
                        "comment_text": comment["comment"][:1000],  # Limit to 1000 chars
                        "date": comment["date"],
                        "voteCount": comment["voteCount"],
                        "replyCount": comment["replyCount"]
                    }
                }
                vectors.append(vector)
            
            # Upsert in batches of 100
            batch_size = 100
            for i in range(0, len(vectors), batch_size):
                batch = vectors[i:i + batch_size]
                self.index.upsert(
                    vectors=batch,
                    namespace=analysis_id
                )
                logger.info(f"Upserted batch {i//batch_size + 1}/{(len(vectors) + batch_size - 1)//batch_size}")
            
            logger.info(f"Successfully upserted {len(vectors)} vectors")
            
        except Exception as e:
            logger.error(f"Error upserting to Pinecone: {str(e)}")
            raise Exception(f"Failed to upsert to Pinecone: {str(e)}")
    
    async def query_similar(
        self,
        query_embedding: List[float],
        analysis_id: str,
        top_k: int = 5
    ) -> List[Dict[str, Any]]:
        """
        Query Pinecone for similar comments.
        
        Args:
            query_embedding: Query vector
            analysis_id: Namespace to search in
            top_k: Number of results to return
            
        Returns:
            List of similar comments with metadata
        """
        try:
            results = self.index.query(
                vector=query_embedding,
                namespace=analysis_id,
                top_k=top_k,
                include_metadata=True
            )
            
            return [
                {
                    "id": match.id,
                    "score": match.score,
                    "metadata": match.metadata
                }
                for match in results.matches
            ]
            
        except Exception as e:
            logger.error(f"Error querying Pinecone: {str(e)}")
            raise Exception(f"Failed to query Pinecone: {str(e)}")


# Singleton instance
pinecone_service = PineconeService()




