from datetime import datetime, timedelta
import re
from typing import List, Dict, Any
import logging

logger = logging.getLogger(__name__)


def get_actual_date(time_text: str) -> str:
    """
    Converts '5 days ago' or '1 month ago' into a YYYY-MM-DD string.
    
    Args:
        time_text: Relative time string like "5 days ago"
        
    Returns:
        Date string in YYYY-MM-DD format
    """
    now = datetime.now()
    
    # Extract number from text
    number_match = re.search(r'\d+', time_text)
    number = int(number_match.group()) if number_match else 0
    
    if 'second' in time_text:
        date = now - timedelta(seconds=number)
    elif 'minute' in time_text:
        date = now - timedelta(minutes=number)
    elif 'hour' in time_text:
        date = now - timedelta(hours=number)
    elif 'day' in time_text:
        date = now - timedelta(days=number)
    elif 'week' in time_text:
        date = now - timedelta(weeks=number)
    elif 'month' in time_text:
        date = now - timedelta(days=number * 30)  # Approximation
    elif 'year' in time_text:
        date = now - timedelta(days=number * 365)  # Approximation
    else:
        date = now
    
    return date.strftime('%Y-%m-%d')


def parse_quill_comments(apify_data: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    Parse Apify raw comment data into clean format.
    
    Rules:
    1. Ignore if author is the channel owner (removes creator replies)
    2. Ignore if type is 'reply' (focuses only on top-level feedback)
    3. Convert relative timestamps to actual dates
    
    Args:
        apify_data: Raw data from Apify
        
    Returns:
        List of parsed comment objects
    """
    parsed_list = []
    
    for item in apify_data:
        # Rule 1 & 2: Filter out channel owner and replies
        if item.get("authorIsChannelOwner") is True or item.get("type") == "reply":
            continue
        
        # Rule 3: Construct the clean object
        clean_comment = {
            "id": item.get("cid", ""),
            "author": item.get("author", "Unknown"),
            "comment": item.get("comment", ""),
            "date": get_actual_date(item.get("publishedTimeText", "0 days ago")),
            "voteCount": item.get("voteCount", 0),
            "replyCount": item.get("replyCount", 0),
            "type": item.get("type", "comment"),
            # Text for OpenAI Embedding
            "text_for_embedding": f"User {item.get('author')} on {item.get('publishedTimeText')}: {item.get('comment')}"
        }
        parsed_list.append(clean_comment)
    
    logger.info(f"Parsed {len(parsed_list)} comments from {len(apify_data)} raw items")
    return parsed_list




