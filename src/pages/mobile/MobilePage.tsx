import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Music, Check, X, Trophy } from "lucide-react";
import { api } from "@/lib/api";
import { QuestionType, WSMessage } from "@/types/game";
import { useToast } from "@/hooks/use-toast";

type ScreenType = "join" | "waiting" | "question" | "result" | "finished";

export default function MobilePage() {
  const { toast } = useToast();
  const [screen, setScreen] = useState<ScreenType>("join");
  const [gameId, setGameId] = useState("");
  const [playerName, setPlayerName] = useState("");
  const [playerId, setPlayerId] = useState("");
  const [questionType, setQuestionType] = useState<QuestionType>(QuestionType.MULTIPLE_CHOICE);
  const [options, setOptions] = useState<string[]>([]);
  const [answer, setAnswer] = useState("");
  const [timeLeft, setTimeLeft] = useState(10);
  const [questionNumber, setQuestionNumber] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(10);
  const [answeredCorrectly, setAnsweredCorrectly] = useState(false);
  const [pointsEarned, setPointsEarned] = useState(0);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [finalScores, setFinalScores] = useState<any[]>([]);
  const [myScore, setMyScore] = useState(0);

  const wsRef = useRef<WebSocket | null>(null);
  const questionStartTime = useRef<number>(0);

  const joinGame = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const result = await api.joinGame(gameId.toUpperCase(), { player_name: playerName });
      setPlayerId(result.player_id);
      setScreen("waiting");

      // Connect WebSocket
      const ws = api.createWebSocket(gameId.toUpperCase(), result.player_id);
      wsRef.current = ws;

      ws.onmessage = (event) => {
        const message: WSMessage = JSON.parse(event.data);
        handleWebSocketMessage(message);
      };

      toast({
        title: "Connecté !",
        description: `Bienvenue ${playerName}`,
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de rejoindre la partie",
        variant: "destructive",
      });
    }
  };

  const handleWebSocketMessage = (message: WSMessage) => {
    switch (message.type) {
      case "new_question":
        setScreen("question");
        setQuestionNumber(message.question_number);
        setTotalQuestions(message.total_questions);
        setQuestionType(message.question.type);
        setOptions(message.question.options || []);
        setTimeLeft(message.question.duration);
        setAnswer("");
        setHasAnswered(false);
        questionStartTime.current = Date.now();
        break;

      case "answer_result":
        setAnsweredCorrectly(message.is_correct);
        setPointsEarned(message.points_earned);
        setScreen("result");
        break;

      case "question_results":
        if (!hasAnswered) {
          setScreen("result");
          setAnsweredCorrectly(false);
          setPointsEarned(0);
        }
        setMyScore(message.scores[playerId] || 0);
        break;

      case "game_finished":
        setFinalScores(message.final_scores);
        setScreen("finished");
        break;
    }
  };

  const submitAnswer = async () => {
    if (!answer || hasAnswered) return;

    const timeTaken = (Date.now() - questionStartTime.current) / 1000;
    setHasAnswered(true);

    try {
      await api.submitAnswer(gameId, {
        player_id: playerId,
        answer,
        time_taken: timeTaken,
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer la réponse",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  // Timer animation effect
  useEffect(() => {
    if (screen === "question" && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 0.1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 0.1;
        });
      }, 100);

      return () => clearInterval(timer);
    }
  }, [screen, questionNumber]); // Re-run when question changes

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4 flex items-center justify-center">
      <div className="w-full max-w-md">
        {screen === "join" && (
          <Card className="p-6 bg-white/10 backdrop-blur-lg border-purple-500/30">
            <div className="text-center mb-6">
              <Music className="w-16 h-16 mx-auto mb-4 text-purple-300" />
              <h1 className="text-3xl font-bold text-white mb-2">Music Quiz</h1>
              <p className="text-purple-200">Rejoignez la partie</p>
            </div>

            <form onSubmit={joinGame} className="space-y-4">
              <div>
                <Label htmlFor="gameId" className="text-white">
                  Code de Partie
                </Label>
                <Input
                  id="gameId"
                  value={gameId}
                  onChange={(e) => setGameId(e.target.value.toUpperCase())}
                  placeholder="Ex: ABC123"
                  required
                  maxLength={6}
                  className="text-center text-2xl font-bold bg-white/20 text-white border-purple-300/30"
                />
              </div>

              <div>
                <Label htmlFor="playerName" className="text-white">
                  Votre Pseudo
                </Label>
                <Input
                  id="playerName"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  placeholder="Ex: DJ Mike"
                  required
                  maxLength={20}
                  className="bg-white/20 text-white border-purple-300/30"
                />
              </div>

              <Button type="submit" className="w-full text-lg py-6">
                Rejoindre
              </Button>
            </form>
          </Card>
        )}

        {screen === "waiting" && (
          <Card className="p-8 bg-white/10 backdrop-blur-lg border-purple-500/30 text-center">
            <Music className="w-24 h-24 mx-auto mb-4 text-purple-300 animate-pulse" />
            <h2 className="text-2xl font-bold text-white mb-2">En attente...</h2>
            <p className="text-purple-200">Le quiz va bientôt commencer !</p>
            <div className="mt-6 text-white/70">
              <p>Code: <span className="font-bold">{gameId}</span></p>
              <p>Joueur: <span className="font-bold">{playerName}</span></p>
            </div>
          </Card>
        )}

        {screen === "question" && (
          <div className="space-y-4">
            <Card className="p-4 bg-white/10 backdrop-blur-lg border-purple-500/30">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white font-semibold">
                  Question {questionNumber}/{totalQuestions}
                </span>
                <span className={`font-bold text-xl ${timeLeft <= 3 ? 'text-red-400 animate-pulse' : 'text-white'}`}>
                  {timeLeft.toFixed(1)}s
                </span>
              </div>
              <Progress value={(timeLeft / 10) * 100} className="h-2" />
            </Card>

            <Card className="p-6 bg-white/10 backdrop-blur-lg border-purple-500/30">
              <div className="text-center mb-4">
                <Music className={`w-12 h-12 mx-auto mb-2 text-purple-400 ${timeLeft > 0 ? 'animate-pulse' : ''}`} />
                <h2 className="text-2xl font-bold text-white">
                  Quelle est cette chanson ?
                </h2>
                <p className="text-purple-300 text-sm mt-1">🎵 Écoutez sur la TV</p>
              </div>

              {questionType === QuestionType.MULTIPLE_CHOICE ? (
                <div className="space-y-3">
                  {options.map((option, index) => (
                    <Button
                      key={index}
                      onClick={() => setAnswer(option)}
                      variant={answer === option ? "default" : "outline"}
                      className="w-full text-lg py-6 justify-start"
                      disabled={hasAnswered}
                    >
                      <span className="mr-2 font-bold">{String.fromCharCode(65 + index)}.</span>
                      {option}
                    </Button>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  <Input
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="Tapez votre réponse..."
                    disabled={hasAnswered}
                    className="text-lg py-6 bg-white/20 text-white border-purple-300/30"
                  />
                </div>
              )}

              <Button
                onClick={submitAnswer}
                disabled={!answer || hasAnswered}
                className="w-full mt-6 text-lg py-6"
              >
                {hasAnswered ? "Réponse envoyée !" : "Valider"}
              </Button>
            </Card>

            <div className="text-center text-white/70">
              Score actuel: <span className="font-bold">{myScore} pts</span>
            </div>
          </div>
        )}

        {screen === "result" && (
          <Card className="p-8 bg-white/10 backdrop-blur-lg border-purple-500/30 text-center">
            {answeredCorrectly ? (
              <>
                <div className="w-24 h-24 bg-green-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Check className="w-16 h-16 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-green-400 mb-2">Correct !</h2>
                <p className="text-2xl text-white font-bold">+{pointsEarned} points</p>
              </>
            ) : (
              <>
                <div className="w-24 h-24 bg-red-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <X className="w-16 h-16 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-red-400 mb-2">Incorrect</h2>
                <p className="text-lg text-white/70">Dommage !</p>
              </>
            )}
            <div className="mt-6 text-white">
              Score total: <span className="font-bold text-2xl">{myScore} pts</span>
            </div>
          </Card>
        )}

        {screen === "finished" && (
          <Card className="p-8 bg-white/10 backdrop-blur-lg border-purple-500/30">
            <div className="text-center mb-6">
              <Trophy className="w-24 h-24 mx-auto mb-4 text-yellow-400" />
              <h2 className="text-3xl font-bold text-white mb-2">Partie Terminée !</h2>
            </div>

            <div className="space-y-3 mb-6">
              {finalScores.map((entry, index) => (
                <div
                  key={entry.player_id}
                  className={`p-4 rounded-lg ${
                    entry.player_id === playerId
                      ? "bg-purple-500/30 border-2 border-purple-400"
                      : "bg-white/10"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-bold text-white">#{index + 1}</span>
                      <span className="text-white font-semibold">{entry.name}</span>
                    </div>
                    <span className="text-xl font-bold text-white">{entry.score}</span>
                  </div>
                </div>
              ))}
            </div>

            <Button
              onClick={() => {
                setScreen("join");
                setGameId("");
                setPlayerName("");
              }}
              className="w-full"
            >
              Nouvelle Partie
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}
