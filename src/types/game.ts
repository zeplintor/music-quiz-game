export enum QuestionType {
  MULTIPLE_CHOICE = "multiple_choice",
  FREE_TEXT = "free_text"
}

export enum GameState {
  WAITING = "waiting",
  PLAYING = "playing",
  FINISHED = "finished"
}

export interface Player {
  id: string;
  name: string;
  connected: boolean;
}

export interface Question {
  id: string;
  type: QuestionType;
  audio_url: string;
  youtube_url: string;
  options?: string[];
  correct_answer: string;
  duration: number;
}

export interface Quiz {
  id: string;
  title: string;
  questions: Question[];
  created_at: string;
}

export interface GameSession {
  id: string;
  quiz_id: string;
  state: GameState;
  players: Record<string, Player>;
  current_question_index: number;
  scores: Record<string, number>;
}

export interface Answer {
  player_id: string;
  answer: string;
  time_taken: number;
}

export interface CreateQuestionRequest {
  type: QuestionType;
  youtube_url: string;
  start_time?: number;
  end_time?: number;
  options?: string[];
  correct_answer: string;
}

export interface CreateQuizRequest {
  title: string;
  questions: CreateQuestionRequest[];
}

export interface JoinGameRequest {
  player_name: string;
}

// WebSocket Messages
export type WSMessage =
  | { type: "player_joined"; player: Player; players: Player[] }
  | { type: "player_disconnected"; player_id: string }
  | {
      type: "new_question";
      question_number: number;
      total_questions: number;
      question: {
        type: QuestionType;
        audio_url: string;
        options?: string[];
        duration: number;
      };
    }
  | {
      type: "question_results";
      correct_answer: string;
      scores: Record<string, number>;
    }
  | {
      type: "game_finished";
      final_scores: { player_id: string; name: string; score: number }[];
    }
  | {
      type: "answer_result";
      is_correct: boolean;
      points_earned: number;
    }
  | { type: "pong" };
