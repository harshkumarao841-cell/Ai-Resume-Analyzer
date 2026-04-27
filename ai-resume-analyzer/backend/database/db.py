"""
database/db.py
Async MongoDB connection using Motor.
Set MONGO_URI in your environment (or .env) to enable persistence.
If MONGO_URI is not set, persistence is silently skipped.
"""

import os
import logging
from typing import Optional

logger = logging.getLogger(__name__)

# Try to import Motor; gracefully degrade if not installed
try:
    from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
    MOTOR_AVAILABLE = True
except ImportError:
    MOTOR_AVAILABLE = False
    logger.warning("motor not installed – MongoDB persistence is disabled.")

MONGO_URI: str = os.getenv("MONGO_URI", "")
DB_NAME: str = os.getenv("MONGO_DB_NAME", "resume_analyzer")
COLLECTION_NAME: str = "analyses"

_client: Optional[object] = None
_db: Optional[object] = None


def get_database() -> Optional[object]:
    """
    Returns the Motor database handle, or None if MongoDB is unavailable.
    Call once at startup; reuse across requests.
    """
    global _client, _db

    if not MOTOR_AVAILABLE or not MONGO_URI:
        return None

    if _db is None:
        _client = AsyncIOMotorClient(MONGO_URI)  # type: ignore[assignment]
        _db = _client[DB_NAME]  # type: ignore[index]
        logger.info(f"Connected to MongoDB: {DB_NAME}")

    return _db


async def save_analysis(record: dict) -> Optional[str]:
    """
    Inserts an analysis record into MongoDB.
    Returns the inserted document ID as a string, or None on failure.
    """
    db = get_database()
    if db is None:
        return None

    try:
        collection = db[COLLECTION_NAME]
        result = await collection.insert_one(record)
        return str(result.inserted_id)
    except Exception as exc:
        logger.error(f"Failed to save analysis to MongoDB: {exc}")
        return None


async def close_connection() -> None:
    """Cleanly close the Motor client (call on app shutdown)."""
    global _client, _db
    if _client:
        _client.close()  # type: ignore[attr-defined]
        _client = None
        _db = None
