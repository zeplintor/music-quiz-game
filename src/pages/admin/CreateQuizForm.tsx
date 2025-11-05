import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Plus, Trash2, Save } from "lucide-react";
import { api } from "@/lib/api";
import { QuestionType, CreateQuestionRequest } from "@/types/game";
import { useToast } from "@/hooks/use-toast";

export function CreateQuizForm() {
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState<CreateQuestionRequest[]>([
    {
      type: QuestionType.MULTIPLE_CHOICE,
      youtube_url: "",
      options: ["", "", "", ""],
      correct_answer: "",
    },
  ]);
  const [loading, setLoading] = useState(false);

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        type: QuestionType.MULTIPLE_CHOICE,
        youtube_url: "",
        options: ["", "", "", ""],
        correct_answer: "",
      },
    ]);
  };

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const updateQuestion = (index: number, field: string, value: any) => {
    const updated = [...questions];
    updated[index] = { ...updated[index], [field]: value };
    setQuestions(updated);
  };

  const updateOption = (questionIndex: number, optionIndex: number, value: string) => {
    const updated = [...questions];
    const options = [...(updated[questionIndex].options || [])];
    options[optionIndex] = value;
    updated[questionIndex].options = options;
    setQuestions(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await api.createQuiz({ title, questions });
      toast({
        title: "Quiz créé !",
        description: `${result.title} avec ${result.questions_count} questions`,
      });

      // Reset form
      setTitle("");
      setQuestions([
        {
          type: QuestionType.MULTIPLE_CHOICE,
          youtube_url: "",
          options: ["", "", "", ""],
          correct_answer: "",
        },
      ]);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de créer le quiz",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="title" className="text-white">
          Titre du Quiz
        </Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ex: Quiz Rock des années 80"
          required
          className="bg-white/20 text-white border-purple-300/30"
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-white text-lg">Questions ({questions.length}/10)</Label>
          <Button
            type="button"
            onClick={addQuestion}
            disabled={questions.length >= 10}
            variant="outline"
            className="gap-2"
          >
            <Plus className="w-4 h-4" />
            Ajouter une question
          </Button>
        </div>

        {questions.map((question, qIndex) => (
          <Card key={qIndex} className="p-4 bg-white/10 border-purple-400/30">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-white font-semibold">Question {qIndex + 1}</h3>
                {questions.length > 1 && (
                  <Button
                    type="button"
                    onClick={() => removeQuestion(qIndex)}
                    variant="ghost"
                    size="sm"
                    className="text-red-300 hover:text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>

              <div>
                <Label className="text-white/80">URL YouTube</Label>
                <Input
                  value={question.youtube_url}
                  onChange={(e) => updateQuestion(qIndex, "youtube_url", e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  required
                  className="bg-white/20 text-white border-purple-300/30"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-white/80">Début (secondes) - optionnel</Label>
                  <Input
                    type="number"
                    value={question.start_time || ""}
                    onChange={(e) => updateQuestion(qIndex, "start_time", parseInt(e.target.value) || undefined)}
                    placeholder="30"
                    className="bg-white/20 text-white border-purple-300/30"
                  />
                </div>
                <div>
                  <Label className="text-white/80">Fin (secondes) - optionnel</Label>
                  <Input
                    type="number"
                    value={question.end_time || ""}
                    onChange={(e) => updateQuestion(qIndex, "end_time", parseInt(e.target.value) || undefined)}
                    placeholder="40"
                    className="bg-white/20 text-white border-purple-300/30"
                  />
                </div>
              </div>

              <div>
                <Label className="text-white/80">Type de question</Label>
                <Select
                  value={question.type}
                  onValueChange={(value) => updateQuestion(qIndex, "type", value)}
                >
                  <SelectTrigger className="bg-white/20 text-white border-purple-300/30">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={QuestionType.MULTIPLE_CHOICE}>QCM (4 choix)</SelectItem>
                    <SelectItem value={QuestionType.FREE_TEXT}>Saisie libre</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {question.type === QuestionType.MULTIPLE_CHOICE && (
                <div className="space-y-2">
                  <Label className="text-white/80">Options (4 choix)</Label>
                  {question.options?.map((option, oIndex) => (
                    <Input
                      key={oIndex}
                      value={option}
                      onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                      placeholder={`Option ${oIndex + 1}`}
                      required
                      className="bg-white/20 text-white border-purple-300/30"
                    />
                  ))}
                </div>
              )}

              <div>
                <Label className="text-white/80">Réponse correcte</Label>
                <Input
                  value={question.correct_answer}
                  onChange={(e) => updateQuestion(qIndex, "correct_answer", e.target.value)}
                  placeholder="Ex: Bohemian Rhapsody"
                  required
                  className="bg-white/20 text-white border-purple-300/30"
                />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Button type="submit" disabled={loading || questions.length === 0} className="w-full gap-2">
        <Save className="w-4 h-4" />
        {loading ? "Création en cours..." : "Créer le Quiz"}
      </Button>
    </form>
  );
}
