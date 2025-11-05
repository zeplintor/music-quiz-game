from pydantic import BaseModel
from typing import List, Optional, Dict
from enum import Enum
from datetime import datetime


class QuestionType(str, Enum):
    MULTIPLE_CHOICE = "multiple_choice"
    FREE_TEXT = "free_text"


class GameState(str, Enum):
    WAITING = "waiting"
    PLAYING = "playing"
    FINISHED = "finished"


class Player(BaseModel):
    id: str
    name: str
    connected: bool = True


class Question(BaseModel):
    id: str
    type: QuestionType
    audio_url: str
    youtube_url: str
    options: Optional[List[str]] = None
    correct_answer: str
    duration: int = 10


class Quiz(BaseModel):
    id: str
    title: str
    questions: List[Question]
    created_at: datetime


class GameSession(BaseModel):
    id: str
    quiz_id: str
    state: GameState
    players: Dict[str, Player]
    current_question_index: int
    scores: Dict[str, int]


class Answer(BaseModel):
    player_id: str
    answer: str
    time_taken: float


class CreateQuestionRequest(BaseModel):
    type: QuestionType
    youtube_url: str
    start_time: Optional[int] = None
    end_time: Optional[int] = None
    options: Optional[List[str]] = None
    correct_answer: str


class CreateQuizRequest(BaseModel):
    title: str
    questions: List[CreateQuestionRequest]


class JoinGameRequest(BaseModel):
    player_name: str
