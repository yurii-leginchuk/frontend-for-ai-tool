from pydantic import BaseSettings

class Settings(BaseSettings):
    mongo_uri: str = "mongodb://localhost:27017"
    debug: bool = True

    class Config:
        env_file = ".env"

settings = Settings()
