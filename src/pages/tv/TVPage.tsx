import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Music, Users, Trophy, Volume2 } from "lucide-react";
import { api } from "@/lib/api";
import { Player, WSMessage, GameState } from "@/types/game";

export default function TVPage() {
  const { gameId } = useParams<{ gameId: string }>();
  const [players, setPlayers] = useState<Player[]>([]);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [gameState, setGameState] = useState<GameState>(GameState.WAITING);
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [totalQuestions, setTotalQuestions] = useState<number>(10);
  const [timeLeft, setTimeLeft] = useState<number>(10);
  const [youtubeVideoId, setYoutubeVideoId] = useState<string>("");
  const [showResults, setShowResults] = useState(false);
  const [correctAnswer, setCorrectAnswer] = useState<string>("");
  const [finalScores, setFinalScores] = useState<any[]>([]);

  const wsRef = useRef<WebSocket | null>(null);
  const youtubePlayerRef = useRef<HTMLIFrameElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!gameId) return;

    // Connect WebSocket
    const ws = api.createWebSocket(gameId, "tv-display");
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("TV connected to game");
    };

    ws.onmessage = (event) => {
      const message: WSMessage = JSON.parse(event.data);
      handleWebSocketMessage(message);
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.onclose = () => {
      console.log("WebSocket closed");
    };

    return () => {
      ws.close();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameId]);

  const handleWebSocketMessage = (message: WSMessage) => {
    switch (message.type) {
      case "player_joined":
        setPlayers(message.players);
        break;

      case "player_disconnected":
        setPlayers((prev) => prev.filter((p) => p.id !== message.player_id));
        break;

      case "new_question":
        setGameState(GameState.PLAYING);
        setCurrentQuestion(message.question_number);
        setTotalQuestions(message.total_questions);
        setTimeLeft(message.question.duration);
        setShowResults(false);

        // Set YouTube video ID (audio_url now contains the video ID)
        setYoutubeVideoId(message.question.audio_url);

        // Start timer
        startTimer(message.question.duration);
        break;

      case "question_results":
        setShowResults(true);
        setCorrectAnswer(message.correct_answer);
        setScores(message.scores);
        if (timerRef.current) clearInterval(timerRef.current);
        break;

      case "game_finished":
        setGameState(GameState.FINISHED);
        setFinalScores(message.final_scores);
        setYoutubeVideoId(""); // Stop video
        break;
    }
  };

  const startTimer = (duration: number) => {
    if (timerRef.current) clearInterval(timerRef.current);

    let time = duration;
    setTimeLeft(time);

    timerRef.current = setInterval(() => {
      time -= 0.1;
      if (time <= 0) {
        time = 0;
        if (timerRef.current) clearInterval(timerRef.current);
      }
      setTimeLeft(time);
    }, 100);
  };

  if (!gameId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-2xl">Invalid game ID</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-8">
      {/* Hidden YouTube Player for audio */}
      {youtubeVideoId && (
        <iframe
          ref={youtubePlayerRef}
          style={{ position: 'absolute', width: '0', height: '0', border: 'none' }}
          src={`https://www.youtube.com/embed/${youtubeVideoId}?autoplay=1&controls=0&showinfo=0&modestbranding=1&enablejsapi=1`}
          allow="autoplay"
          title="YouTube Audio Player"
        />
      )}

      {gameState === GameState.WAITING && (
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-6xl font-bold text-white mb-4 flex items-center justify-center gap-4">
              <Music className="w-16 h-16" />
              Music Quiz
            </h1>
            <div className="text-3xl text-purple-200 font-mono bg-white/10 inline-block px-8 py-4 rounded-lg">
              Code: {gameId}
            </div>
          </div>

          <Card className="p-8 bg-white/10 backdrop-blur-lg border-purple-500/30">
            <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
              <Users className="w-8 h-8" />
              Joueurs en attente ({players.length}/5)
            </h2>

            {players.length === 0 ? (
              <div className="text-center py-12 text-white/70">
                <Users className="w-24 h-24 mx-auto mb-4 opacity-30" />
                <p className="text-2xl">En attente de joueurs...</p>
                <p className="text-lg mt-2">Rejoignez avec le code: {gameId}</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {players.map((player) => (
                  <Card
                    key={player.id}
                    className="p-6 bg-gradient-to-br from-purple-500/30 to-blue-500/30 border-purple-400/50"
                  >
                    <div className="text-center">
                      <div className="w-16 h-16 bg-white/20 rounded-full mx-auto mb-3 flex items-center justify-center">
                        <Users className="w-8 h-8 text-white" />
                      </div>
                      <p className="text-white font-semibold text-lg truncate">{player.name}</p>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </Card>
        </div>
      )}

      {gameState === GameState.PLAYING && !showResults && (
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="text-white text-2xl font-bold">
                Question {currentQuestion} / {totalQuestions}
              </div>
              <div className="text-white text-2xl font-bold">
                {timeLeft.toFixed(1)}s
              </div>
            </div>
            <Progress value={(timeLeft / 10) * 100} className="h-4" />
          </div>

          <Card className="p-12 bg-white/10 backdrop-blur-lg border-purple-500/30 mb-8">
            <div className="text-center">
              <Volume2 className="w-32 h-32 mx-auto mb-6 text-purple-300 animate-pulse" />
              <h2 className="text-5xl font-bold text-white mb-4">Qui est-ce ?</h2>
              <p className="text-2xl text-purple-200">Écoutez attentivement...</p>
            </div>
          </Card>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {players.map((player) => (
              <Card
                key={player.id}
                className="p-4 bg-white/5 border-purple-400/30"
              >
                <div className="text-center">
                  <p className="text-white font-semibold truncate mb-1">{player.name}</p>
                  <p className="text-purple-300 text-lg">{scores[player.id] || 0} pts</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {gameState === GameState.PLAYING && showResults && (
        <div className="max-w-6xl mx-auto">
          <Card className="p-12 bg-white/10 backdrop-blur-lg border-purple-500/30 mb-8">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-white mb-6">Réponse correcte :</h2>
              <div className="text-6xl font-bold text-green-400 mb-4">{correctAnswer}</div>
            </div>
          </Card>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {players.map((player) => (
              <Card
                key={player.id}
                className="p-4 bg-gradient-to-br from-purple-500/20 to-blue-500/20 border-purple-400/50"
              >
                <div className="text-center">
                  <p className="text-white font-semibold truncate mb-1">{player.name}</p>
                  <p className="text-purple-300 text-2xl font-bold">{scores[player.id] || 0}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {gameState === GameState.FINISHED && (
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <Trophy className="w-32 h-32 mx-auto mb-6 text-yellow-400" />
            <h1 className="text-6xl font-bold text-white mb-4">Partie Terminée !</h1>
            <p className="text-2xl text-purple-200">Classement Final</p>
          </div>

          <div className="space-y-4">
            {finalScores.map((entry, index) => (
              <Card
                key={entry.player_id}
                className={`p-6 ${
                  index === 0
                    ? "bg-gradient-to-r from-yellow-500/30 to-yellow-600/30 border-yellow-400/50"
                    : index === 1
                    ? "bg-gradient-to-r from-gray-400/30 to-gray-500/30 border-gray-400/50"
                    : index === 2
                    ? "bg-gradient-to-r from-orange-600/30 to-orange-700/30 border-orange-400/50"
                    : "bg-white/10 border-purple-400/30"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="text-4xl font-bold text-white">#{index + 1}</div>
                    <div>
                      <p className="text-2xl font-bold text-white">{entry.name}</p>
                    </div>
                  </div>
                  <div className="text-4xl font-bold text-white">{entry.score} pts</div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
