from apify_client import ApifyClient
from app.config import settings
import logging
from typing import List, Dict, Any

logger = logging.getLogger(__name__)


class ApifyService:
    def __init__(self):
        self.client = ApifyClient(settings.apify_api_token)
    
    async def fetch_comments(self, url: str, max_comments: int = 500) -> List[Dict[str, Any]]:
        """
        Fetch YouTube comments using Apify actor.
        
        Args:
            url: YouTube video URL
            max_comments: Maximum number of comments to fetch
            
        Returns:
            List of raw comment data from Apify
        """
        try:
            logger.info(f"Starting Apify actor for URL: {url}")
            
            # Prepare the Actor input
            run_input = {
                "startUrls": [{"url": url}],
                "maxComments": max_comments,
                "commentsSortBy": "1",  # Sort by relevance
            }
            
            # Run the Actor and wait for it to finish
            run = self.client.actor("p7UMdpQnjKmmpR21D").call(run_input=run_input)
            
            logger.info(f"Apify actor completed. Dataset ID: {run['defaultDatasetId']}")
            
            # Fetch results from the dataset
            items = []
            for item in self.client.dataset(run["defaultDatasetId"]).iterate_items():
                items.append(item)
            
            logger.info(f"Fetched {len(items)} items from Apify")
            return items
            
        except Exception as e:
            logger.error(f"Error fetching comments from Apify: {str(e)}")
            raise Exception(f"Failed to fetch comments: {str(e)}")


# Singleton instance
apify_service = ApifyService()




