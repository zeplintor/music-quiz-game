import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreateQuizForm } from "./CreateQuizForm";
import { QuizList } from "./QuizList";
import { GameManagement } from "./GameManagement";
import { Music, ListMusic, Gamepad2 } from "lucide-react";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("quizzes");

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-2 flex items-center justify-center gap-3">
            <Music className="w-12 h-12" />
            Music Quiz - Admin Panel
          </h1>
          <p className="text-purple-200">Créez et gérez vos quiz musicaux</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="quizzes" className="flex items-center gap-2">
              <ListMusic className="w-4 h-4" />
              Mes Quiz
            </TabsTrigger>
            <TabsTrigger value="create" className="flex items-center gap-2">
              <Music className="w-4 h-4" />
              Créer un Quiz
            </TabsTrigger>
            <TabsTrigger value="games" className="flex items-center gap-2">
              <Gamepad2 className="w-4 h-4" />
              Gérer Parties
            </TabsTrigger>
          </TabsList>

          <TabsContent value="quizzes">
            <Card className="bg-white/10 backdrop-blur-lg border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-white">Liste des Quiz</CardTitle>
              </CardHeader>
              <CardContent>
                <QuizList />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="create">
            <Card className="bg-white/10 backdrop-blur-lg border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-white">Créer un Nouveau Quiz</CardTitle>
              </CardHeader>
              <CardContent>
                <CreateQuizForm />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="games">
            <Card className="bg-white/10 backdrop-blur-lg border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-white">Gestion des Parties</CardTitle>
              </CardHeader>
              <CardContent>
                <GameManagement />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
