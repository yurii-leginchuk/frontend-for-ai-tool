from motor.motor_asyncio import AsyncIOMotorClient
from os import getenv
import asyncio

class MongoDB:
    _client = None
    _db = None

    @classmethod
    async def connect(cls):
        if cls._client is None:
            mongo_uri = getenv("MONGO_URI")
            if not mongo_uri:
                raise ValueError("MONGO_URI environment variable is not set")
            retries = 5
            for attempt in range(retries):
                try:
                    cls._client = AsyncIOMotorClient(mongo_uri)
                    cls._db = cls._client["clients_db"]
                    print("Successfully connected to MongoDB")
                    return
                except Exception as e:
                    print(f"Error connecting to MongoDB (attempt {attempt + 1}/{retries}): {type(e).__name__}: {str(e)}")
                    if attempt < retries - 1:
                        await asyncio.sleep(2)
            raise Exception("Failed to connect to MongoDB after multiple attempts")

    @classmethod
    async def close(cls):
        if cls._client:
            cls._client.close()
            cls._client = None
            cls._db = None
            print("MongoDB connection closed")

    @classmethod
    def get_db(cls):
        if cls._db is None:
            print("Error: MongoDB connection is not established")
            raise Exception("MongoDB connection is not established")
        return cls._db