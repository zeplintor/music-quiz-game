import {
  CreateQuizRequest,
  JoinGameRequest,
  Answer,
  Quiz,
  GameSession,
} from "@/types/game";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export class MusicQuizAPI {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  // Quiz Management
  async createQuiz(quiz: CreateQuizRequest): Promise<{ quiz_id: string; title: string; questions_count: number }> {
    const response = await fetch(`${this.baseUrl}/api/quizzes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(quiz),
    });
    if (!response.ok) throw new Error("Failed to create quiz");
    return response.json();
  }

  async listQuizzes(): Promise<Quiz[]> {
    const response = await fetch(`${this.baseUrl}/api/quizzes`);
    if (!response.ok) throw new Error("Failed to fetch quizzes");
    return response.json();
  }

  async getQuiz(quizId: string): Promise<Quiz> {
    const response = await fetch(`${this.baseUrl}/api/quizzes/${quizId}`);
    if (!response.ok) throw new Error("Failed to fetch quiz");
    return response.json();
  }

  // Game Sessions
  async createGame(quizId: string): Promise<{ game_id: string; quiz_id: string; state: string }> {
    const response = await fetch(`${this.baseUrl}/api/games/create?quiz_id=${quizId}`, {
      method: "POST",
    });
    if (!response.ok) throw new Error("Failed to create game");
    return response.json();
  }

  async joinGame(
    gameId: string,
    request: JoinGameRequest
  ): Promise<{ player_id: string; game_id: string }> {
    const response = await fetch(`${this.baseUrl}/api/games/${gameId}/join`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    });
    if (!response.ok) throw new Error("Failed to join game");
    return response.json();
  }

  async startGame(gameId: string): Promise<{ status: string }> {
    const response = await fetch(`${this.baseUrl}/api/games/${gameId}/start`, {
      method: "POST",
    });
    if (!response.ok) throw new Error("Failed to start game");
    return response.json();
  }

  async submitAnswer(gameId: string, answer: Answer): Promise<{ is_correct: boolean }> {
    const response = await fetch(`${this.baseUrl}/api/games/${gameId}/answer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(answer),
    });
    if (!response.ok) throw new Error("Failed to submit answer");
    return response.json();
  }

  // WebSocket
  createWebSocket(gameId: string, clientId: string): WebSocket {
    const wsUrl = this.baseUrl.replace("http", "ws");
    return new WebSocket(`${wsUrl}/ws/${gameId}/${clientId}`);
  }
}

export const api = new MusicQuizAPI();
