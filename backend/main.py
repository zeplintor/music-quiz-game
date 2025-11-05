from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict, List, Optional
import json
import asyncio
from datetime import datetime
import uuid
import re
from models import (
    Quiz, Question, QuestionType, GameState, Player,
    GameSession, Answer, CreateQuizRequest, JoinGameRequest
)
from youtube_service import YouTubeService

app = FastAPI(title="Music Quiz Game API")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory storage (remplacer par une vraie DB plus tard)
quizzes: Dict[str, Quiz] = {}
game_sessions: Dict[str, GameSession] = {}
active_connections: Dict[str, List[WebSocket]] = {}

youtube_service = YouTubeService()


def extract_youtube_id(url: str) -> str:
    """Extrait l'ID vidéo YouTube d'une URL"""
    patterns = [
        r'(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)',
        r'youtube\.com\/embed\/([^&\n?#]+)',
    ]
    for pattern in patterns:
        match = re.search(pattern, url)
        if match:
            return match.group(1)
    return url  # Retourner l'URL si pas de match


class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, Dict[str, WebSocket]] = {}

    async def connect(self, game_id: str, client_id: str, websocket: WebSocket):
        await websocket.accept()
        if game_id not in self.active_connections:
            self.active_connections[game_id] = {}
        self.active_connections[game_id][client_id] = websocket

    def disconnect(self, game_id: str, client_id: str):
        if game_id in self.active_connections:
            self.active_connections[game_id].pop(client_id, None)
            if not self.active_connections[game_id]:
                del self.active_connections[game_id]

    async def broadcast(self, game_id: str, message: dict):
        if game_id in self.active_connections:
            disconnected = []
            for client_id, connection in self.active_connections[game_id].items():
                try:
                    await connection.send_json(message)
                except:
                    disconnected.append(client_id)

            for client_id in disconnected:
                self.disconnect(game_id, client_id)

    async def send_personal_message(self, game_id: str, client_id: str, message: dict):
        if game_id in self.active_connections and client_id in self.active_connections[game_id]:
            try:
                await self.active_connections[game_id][client_id].send_json(message)
            except:
                self.disconnect(game_id, client_id)


manager = ConnectionManager()


@app.get("/")
async def root():
    return {"message": "Music Quiz Game API", "version": "1.0.0"}


# Quiz Management Endpoints
@app.post("/api/quizzes")
async def create_quiz(quiz_data: CreateQuizRequest):
    """Créer un nouveau quiz (interface admin)"""
    quiz_id = str(uuid.uuid4())

    questions = []
    for q_data in quiz_data.questions:
        # Extraire l'ID YouTube pour l'iframe
        video_id = extract_youtube_id(q_data.youtube_url)

        question = Question(
            id=str(uuid.uuid4()),
            type=q_data.type,
            audio_url=video_id,  # Stocker l'ID YouTube au lieu d'un fichier audio
            youtube_url=q_data.youtube_url,
            options=q_data.options,
            correct_answer=q_data.correct_answer,
            duration=10
        )
        questions.append(question)

    quiz = Quiz(
        id=quiz_id,
        title=quiz_data.title,
        questions=questions,
        created_at=datetime.now()
    )

    quizzes[quiz_id] = quiz
    return {"quiz_id": quiz_id, "title": quiz.title, "questions_count": len(quiz.questions)}


@app.get("/api/quizzes")
async def list_quizzes():
    """Lister tous les quiz disponibles"""
    return [
        {
            "id": q.id,
            "title": q.title,
            "questions_count": len(q.questions),
            "created_at": q.created_at.isoformat()
        }
        for q in quizzes.values()
    ]


@app.get("/api/quizzes/{quiz_id}")
async def get_quiz(quiz_id: str):
    """Obtenir les détails d'un quiz"""
    if quiz_id not in quizzes:
        raise HTTPException(status_code=404, detail="Quiz not found")
    return quizzes[quiz_id]


# Game Session Endpoints
@app.post("/api/games/create")
async def create_game(quiz_id: str):
    """Créer une nouvelle partie"""
    if quiz_id not in quizzes:
        raise HTTPException(status_code=404, detail="Quiz not found")

    game_id = str(uuid.uuid4())[:6].upper()  # Code de partie court

    game_session = GameSession(
        id=game_id,
        quiz_id=quiz_id,
        state=GameState.WAITING,
        players={},
        current_question_index=0,
        scores={}
    )

    game_sessions[game_id] = game_session

    return {
        "game_id": game_id,
        "quiz_id": quiz_id,
        "state": game_session.state
    }


@app.post("/api/games/{game_id}/join")
async def join_game(game_id: str, request: JoinGameRequest):
    """Rejoindre une partie"""
    if game_id not in game_sessions:
        raise HTTPException(status_code=404, detail="Game not found")

    game = game_sessions[game_id]

    if len(game.players) >= 5:
        raise HTTPException(status_code=400, detail="Game is full (max 5 players)")

    if game.state != GameState.WAITING:
        raise HTTPException(status_code=400, detail="Game already started")

    player_id = str(uuid.uuid4())
    player = Player(
        id=player_id,
        name=request.player_name,
        connected=True
    )

    game.players[player_id] = player
    game.scores[player_id] = 0

    # Notifier tous les clients
    await manager.broadcast(game_id, {
        "type": "player_joined",
        "player": {"id": player_id, "name": player.name},
        "players": [{"id": p.id, "name": p.name} for p in game.players.values()]
    })

    return {"player_id": player_id, "game_id": game_id}


@app.post("/api/games/{game_id}/start")
async def start_game(game_id: str):
    """Démarrer la partie (admin)"""
    if game_id not in game_sessions:
        raise HTTPException(status_code=404, detail="Game not found")

    game = game_sessions[game_id]
    game.state = GameState.PLAYING
    game.current_question_index = 0

    # Envoyer la première question
    await send_question(game_id)

    return {"status": "started"}


async def send_question(game_id: str):
    """Envoyer la question actuelle à tous les joueurs"""
    game = game_sessions[game_id]
    quiz = quizzes[game.quiz_id]

    if game.current_question_index >= len(quiz.questions):
        await end_game(game_id)
        return

    question = quiz.questions[game.current_question_index]

    await manager.broadcast(game_id, {
        "type": "new_question",
        "question_number": game.current_question_index + 1,
        "total_questions": len(quiz.questions),
        "question": {
            "type": question.type,
            "audio_url": question.audio_url,
            "options": question.options if question.type == QuestionType.MULTIPLE_CHOICE else None,
            "duration": question.duration
        }
    })

    # Auto-passer à la question suivante après la durée
    asyncio.create_task(auto_next_question(game_id, question.duration))


async def auto_next_question(game_id: str, delay: int):
    """Passer automatiquement à la question suivante"""
    await asyncio.sleep(delay)

    if game_id in game_sessions:
        game = game_sessions[game_id]

        # Montrer les réponses
        await show_results(game_id)

        # Attendre 5 secondes puis passer à la suivante
        await asyncio.sleep(5)

        game.current_question_index += 1
        await send_question(game_id)


async def show_results(game_id: str):
    """Afficher les résultats de la question actuelle"""
    game = game_sessions[game_id]
    quiz = quizzes[game.quiz_id]
    question = quiz.questions[game.current_question_index]

    await manager.broadcast(game_id, {
        "type": "question_results",
        "correct_answer": question.correct_answer,
        "scores": game.scores
    })


async def end_game(game_id: str):
    """Terminer la partie et afficher le scoreboard final"""
    game = game_sessions[game_id]
    game.state = GameState.FINISHED

    # Calculer le classement
    sorted_scores = sorted(
        [{"player_id": pid, "name": game.players[pid].name, "score": score}
         for pid, score in game.scores.items()],
        key=lambda x: x["score"],
        reverse=True
    )

    await manager.broadcast(game_id, {
        "type": "game_finished",
        "final_scores": sorted_scores
    })


@app.post("/api/games/{game_id}/answer")
async def submit_answer(game_id: str, answer: Answer):
    """Soumettre une réponse"""
    if game_id not in game_sessions:
        raise HTTPException(status_code=404, detail="Game not found")

    game = game_sessions[game_id]
    quiz = quizzes[game.quiz_id]

    if game.current_question_index >= len(quiz.questions):
        raise HTTPException(status_code=400, detail="No active question")

    question = quiz.questions[game.current_question_index]

    # Vérifier la réponse
    is_correct = answer.answer.lower().strip() == question.correct_answer.lower().strip()

    if is_correct:
        # Points basés sur le temps de réponse (max 1000 points)
        time_bonus = max(0, 1000 - (answer.time_taken * 100))
        game.scores[answer.player_id] = game.scores.get(answer.player_id, 0) + int(time_bonus)

    # Notifier le joueur
    await manager.send_personal_message(game_id, answer.player_id, {
        "type": "answer_result",
        "is_correct": is_correct,
        "points_earned": int(time_bonus) if is_correct else 0
    })

    return {"is_correct": is_correct}


# WebSocket endpoint
@app.websocket("/ws/{game_id}/{client_id}")
async def websocket_endpoint(websocket: WebSocket, game_id: str, client_id: str):
    await manager.connect(game_id, client_id, websocket)

    try:
        while True:
            data = await websocket.receive_text()
            # Gérer les messages si nécessaire
            message = json.loads(data)

            if message.get("type") == "ping":
                await websocket.send_json({"type": "pong"})

    except WebSocketDisconnect:
        manager.disconnect(game_id, client_id)

        # Notifier les autres joueurs
        if game_id in game_sessions:
            game = game_sessions[game_id]
            if client_id in game.players:
                game.players[client_id].connected = False
                await manager.broadcast(game_id, {
                    "type": "player_disconnected",
                    "player_id": client_id
                })


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
