import os
from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    # Apify
    apify_api_token: str
    
    # OpenAI
    openai_api_key: str
    
    # Google Gemini
    google_api_key: str
    
    # Pinecone
    pinecone_api_key: str
    pinecone_index_name: str = "quill-ai-comments"
    
    # Supabase
    supabase_url: str
    supabase_key: str
    
    # Server
    port: int = 8000
    cors_origins: str = "http://localhost:5173,http://localhost:3000"
    
    class Config:
        env_file = ".env"
        case_sensitive = False
    
    @property
    def cors_origins_list(self) -> List[str]:
        return [origin.strip() for origin in self.cors_origins.split(",")]


settings = Settings()




