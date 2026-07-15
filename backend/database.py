"""SQLite persistence for favorite recipes and search history."""
import json
import os
from datetime import datetime, timezone

from sqlalchemy import create_engine, Column, Integer, String, Text, DateTime
from sqlalchemy.orm import declarative_base, sessionmaker

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./nourish.db")

engine = create_engine(
    DATABASE_URL, connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


class FavoriteRecipe(Base):
    __tablename__ = "favorite_recipes"

    id = Column(Integer, primary_key=True, index=True)
    recipe_json = Column(Text, nullable=False)
    title = Column(String, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    def to_dict(self):
        return {
            "id": self.id,
            "recipe": json.loads(self.recipe_json),
            "created_at": self.created_at.isoformat(),
        }


class SearchHistory(Base):
    __tablename__ = "search_history"

    id = Column(Integer, primary_key=True, index=True)
    request_json = Column(Text, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    def to_dict(self):
        return {
            "id": self.id,
            "request": json.loads(self.request_json),
            "created_at": self.created_at.isoformat(),
        }


def init_db():
    Base.metadata.create_all(bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
