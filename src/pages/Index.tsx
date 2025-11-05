import { Button } from "@/components/ui/button";
import { Music, Tv, Smartphone, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <Music className="w-20 h-20 text-purple-400 animate-pulse" />
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-4">
            Music Quiz Game
          </h1>
          <p className="text-xl md:text-2xl text-purple-300 mb-8">
            Jeu de quiz musical multi-écrans avec synchronisation temps réel
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all">
            <div className="flex justify-center mb-4">
              <Users className="w-12 h-12 text-purple-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2 text-center">
              Interface Admin
            </h3>
            <p className="text-purple-200 text-center mb-4">
              Créez vos quiz musicaux et gérez les parties
            </p>
            <Button
              onClick={() => navigate("/quiz/admin")}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              Accéder à l'Admin
            </Button>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all">
            <div className="flex justify-center mb-4">
              <Tv className="w-12 h-12 text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2 text-center">
              Écran TV
            </h3>
            <p className="text-purple-200 text-center mb-4">
              Affichage principal pour tous les joueurs
            </p>
            <div className="text-center text-sm text-purple-300">
              Créez une partie dans l'admin pour obtenir le lien TV
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all">
            <div className="flex justify-center mb-4">
              <Smartphone className="w-12 h-12 text-green-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2 text-center">
              Mobile
            </h3>
            <p className="text-purple-200 text-center mb-4">
              Jouez depuis votre téléphone
            </p>
            <Button
              onClick={() => navigate("/mobile")}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              Rejoindre une partie
            </Button>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
          <h2 className="text-2xl font-bold text-white mb-4 text-center">
            Comment ça marche ?
          </h2>
          <div className="grid md:grid-cols-3 gap-6 text-purple-200">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400 mb-2">1</div>
              <p>Créez un quiz avec des URLs YouTube dans l'interface Admin</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400 mb-2">2</div>
              <p>Lancez une partie et ouvrez l'écran TV sur un grand écran</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400 mb-2">3</div>
              <p>Les joueurs se connectent depuis leur mobile et répondent aux questions</p>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-purple-300">
          <p>Jusqu'à 5 joueurs • Synchronisation temps réel • Audio YouTube</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
