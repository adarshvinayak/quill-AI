from supabase import create_client, Client
from app.config import settings
import logging

logger = logging.getLogger(__name__)


class SupabaseDB:
    def __init__(self):
        self.client: Client = create_client(
            settings.supabase_url,
            settings.supabase_key
        )
    
    def get_client(self) -> Client:
        return self.client


# Singleton instance
db = SupabaseDB()


def get_supabase() -> Client:
    return db.get_client()




