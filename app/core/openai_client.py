from functools import lru_cache

from openai import AsyncOpenAI

from app.core.config import settings


class OpenAIConfigurationError(RuntimeError):
    pass


def get_ai_error_status_and_message(error: Exception) -> tuple[int, str]:
    status_code = getattr(error, "status_code", None)
    message = str(error)
    lower_message = message.lower()

    if status_code == 429 or "quota" in lower_message or "rate limit" in lower_message:
        return (
            429,
            "Yapay zeka servisinin ücretsiz kullanım kotası veya hız sınırı doldu. "
            "Birkaç dakika sonra tekrar deneyin ya da sunum için daha yüksek limitli bir API anahtarı kullanın.",
        )

    if status_code in (401, 403) or "api key" in lower_message:
        return (
            401,
            "Yapay zeka API anahtarı geçersiz veya yetkisiz görünüyor. "
            "Lütfen .env dosyasındaki anahtarı kontrol edin.",
        )

    return 500, str(error)


@lru_cache
def get_openai_client() -> AsyncOpenAI:
    if not settings.has_openai_key:
        raise OpenAIConfigurationError(
            "OPENAI_API_KEY ortam değişkeni tanımlı değil. "
            "AI özelliklerini kullanmak için geçerli bir OpenAI API anahtarı ekleyin."
        )

    client_options = {"api_key": settings.openai_api_key}
    if settings.openai_base_url.strip():
        client_options["base_url"] = settings.openai_base_url.strip()

    return AsyncOpenAI(**client_options)
