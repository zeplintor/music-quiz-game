import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Music, Calendar, Hash } from "lucide-react";
import { api } from "@/lib/api";
import { Quiz } from "@/types/game";
import { useToast } from "@/hooks/use-toast";

export function QuizList() {
  const { toast } = useToast();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);

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
    } finally {
      setLoading(false);
    }
  };

  const viewQuizDetails = async (quizId: string) => {
    try {
      const quiz = await api.getQuiz(quizId);
      toast({
        title: quiz.title,
        description: `${quiz.questions.length} questions - Créé le ${new Date(quiz.created_at).toLocaleDateString("fr-FR")}`,
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les détails du quiz",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div className="text-white text-center py-8">Chargement...</div>;
  }

  if (quizzes.length === 0) {
    return (
      <div className="text-center py-8 text-white/70">
        <Music className="w-16 h-16 mx-auto mb-4 opacity-50" />
        <p>Aucun quiz créé pour le moment</p>
        <p className="text-sm mt-2">Créez votre premier quiz dans l'onglet "Créer un Quiz"</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {quizzes.map((quiz) => (
        <Card key={quiz.id} className="p-4 bg-white/5 border-purple-400/30 hover:bg-white/10 transition-all">
          <div className="space-y-3">
            <h3 className="text-white font-semibold text-lg flex items-center gap-2">
              <Music className="w-5 h-5 text-purple-400" />
              {quiz.title}
            </h3>

            <div className="space-y-1 text-sm text-white/70">
              <div className="flex items-center gap-2">
                <Hash className="w-4 h-4" />
                <span>{quiz.questions?.length || (quiz as any).questions_count || 0} questions</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{new Date(quiz.created_at).toLocaleDateString("fr-FR")}</span>
              </div>
            </div>

            <div className="pt-2">
              <Button
                variant="outline"
                className="w-full"
                size="sm"
                onClick={() => viewQuizDetails(quiz.id)}
              >
                Voir les détails
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
