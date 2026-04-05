from pydantic_settings import BaseSettings
from pydantic import Field


class Settings(BaseSettings):
    openai_api_key: str = Field(..., env="OPENAI_API_KEY")
    openai_model: str = Field(default="gpt-4o-mini", env="OPENAI_MODEL")
    app_env: str = Field(default="development", env="APP_ENV")
    app_debug: bool = Field(default=True, env="APP_DEBUG")
    upload_dir: str = Field(default="uploads", env="UPLOAD_DIR")
    max_upload_size_mb: int = Field(default=10, env="MAX_UPLOAD_SIZE_MB")

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings()
