import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Play, Copy, Users } from "lucide-react";
import { api } from "@/lib/api";
import { Quiz } from "@/types/game";
import { useToast } from "@/hooks/use-toast";

export function GameManagement() {
  const { toast } = useToast();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [selectedQuizId, setSelectedQuizId] = useState<string>("");
  const [gameId, setGameId] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadQuizzes();
  }, []);

  const loadQuizzes = async () => {
    try {
      const data = await api.listQuizzes();
      setQuizzes(data || []);
    } catch (error) {
      console.error("Failed to load quizzes", error);
      setQuizzes([]);
    }
  };

  const createGame = async () => {
    if (!selectedQuizId) return;

    setLoading(true);
    try {
      const result = await api.createGame(selectedQuizId);
      setGameId(result.game_id);
      toast({
        title: "Partie créée !",
        description: `Code de partie: ${result.game_id}`,
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de créer la partie",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const startGame = async () => {
    if (!gameId) return;

    setLoading(true);
    try {
      await api.startGame(gameId);
      toast({
        title: "Partie démarrée !",
        description: "Le quiz a commencé",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de démarrer la partie",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const copyGameCode = () => {
    if (gameId) {
      navigator.clipboard.writeText(gameId);
      toast({
        title: "Code copié !",
        description: "Le code de partie a été copié dans le presse-papier",
      });
    }
  };

  const openTVView = () => {
    if (gameId) {
      window.open(`/tv/${gameId}`, "_blank");
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-white/5 border-purple-400/30">
        <div className="space-y-4">
          <div>
            <Label htmlFor="quiz-select" className="text-white">
              Sélectionner un Quiz
            </Label>
            <Select value={selectedQuizId} onValueChange={setSelectedQuizId}>
              <SelectTrigger id="quiz-select" className="bg-white/20 text-white border-purple-300/30">
                <SelectValue placeholder="Choisir un quiz" />
              </SelectTrigger>
              <SelectContent>
                {quizzes.map((quiz) => (
                  <SelectItem key={quiz.id} value={quiz.id}>
                    {quiz.title} ({quiz.questions?.length || (quiz as any).questions_count || 0} questions)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={createGame}
            disabled={!selectedQuizId || loading}
            className="w-full gap-2"
          >
            <Play className="w-4 h-4" />
            Créer une nouvelle partie
          </Button>
        </div>
      </Card>

      {gameId && (
        <Card className="p-6 bg-gradient-to-br from-purple-500/20 to-blue-500/20 border-purple-400/50">
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-white text-lg font-semibold mb-2">Code de Partie</h3>
              <div className="flex items-center justify-center gap-2">
                <div className="text-4xl font-bold text-white bg-white/10 px-6 py-3 rounded-lg tracking-wider">
                  {gameId}
                </div>
                <Button
                  onClick={copyGameCode}
                  variant="outline"
                  size="icon"
                  className="h-14 w-14"
                >
                  <Copy className="w-5 h-5" />
                </Button>
              </div>
              <p className="text-white/70 text-sm mt-2">
                Les joueurs peuvent rejoindre avec ce code
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button
                onClick={openTVView}
                variant="outline"
                className="gap-2"
              >
                <Users className="w-4 h-4" />
                Ouvrir Vue TV
              </Button>

              <Button
                onClick={startGame}
                disabled={loading}
                className="gap-2 bg-green-600 hover:bg-green-700"
              >
                <Play className="w-4 h-4" />
                Démarrer la Partie
              </Button>
            </div>

            <div className="text-center text-sm text-white/60">
              URL Mobile: <code className="bg-white/10 px-2 py-1 rounded">
                {window.location.origin}/mobile
              </code>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
