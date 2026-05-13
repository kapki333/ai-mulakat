from pydantic_settings import BaseSettings
from pydantic import Field


class Settings(BaseSettings):
    openai_api_key: str = Field(default="", env="OPENAI_API_KEY")
    openai_model: str = Field(default="gpt-4o-mini", env="OPENAI_MODEL")
    openai_base_url: str = Field(default="", env="OPENAI_BASE_URL")
    app_env: str = Field(default="development", env="APP_ENV")
    app_debug: bool = Field(default=True, env="APP_DEBUG")
    upload_dir: str = Field(default="uploads", env="UPLOAD_DIR")
    max_upload_size_mb: int = Field(default=10, env="MAX_UPLOAD_SIZE_MB")
    allowed_origins: str = Field(
        default=(
            "http://localhost:3000,"
            "http://127.0.0.1:3000,"
            "https://ai-mulakat-i0bnwaica-sef1.vercel.app,"
            "https://ai-mulakat-1.vercel.app"
        ),
        env="ALLOWED_ORIGINS",
    )
    allowed_origin_regex: str = Field(
        default=r"^https://ai-mulakat.*\.vercel\.app$",
        env="ALLOWED_ORIGIN_REGEX",
    )
    rate_limit_requests: int = Field(default=30, env="RATE_LIMIT_REQUESTS")
    rate_limit_window_seconds: int = Field(default=3600, env="RATE_LIMIT_WINDOW_SECONDS")

    @property
    def has_openai_key(self) -> bool:
        return bool(self.openai_api_key.strip())

    @property
    def allowed_origin_list(self) -> list[str]:
        return [origin.strip() for origin in self.allowed_origins.split(",") if origin.strip()]

    @property
    def cors_origin_regex(self) -> str | None:
        value = self.allowed_origin_regex.strip()
        return value or None

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings()
