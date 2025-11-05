# 🎵 Music Quiz Game

Jeu de quiz musical multi-écrans avec synchronisation temps réel, audio YouTube, et interface moderne.

![Music Quiz Game](https://img.shields.io/badge/Status-Production%20Ready-success)
![Python](https://img.shields.io/badge/Python-3.9+-blue)
![React](https://img.shields.io/badge/React-18+-61DAFB)
![WebSocket](https://img.shields.io/badge/WebSocket-Real--time-orange)

## 🎮 Démo

Jouez à plusieurs sur un même écran TV avec vos téléphones comme manettes !

- **Interface Admin** : Créez vos quiz musicaux
- **Écran TV** : Affichage principal pour tous les joueurs
- **Mobile** : Chaque joueur répond depuis son téléphone

## ✨ Fonctionnalités

✅ **Multi-écrans** : TV + jusqu'à 5 joueurs sur mobile
✅ **Audio YouTube** : Intégration iframe (pas de téléchargement)
✅ **Temps réel** : Synchronisation WebSocket instantanée
✅ **Types de questions** : QCM (4 choix) ou texte libre
✅ **Timer animé** : Compte à rebours avec feedback visuel
✅ **Score dynamique** : Points basés sur la vitesse de réponse
✅ **Tableau final** : Classement à la fin de chaque partie

## 🚀 Quick Start

### Prérequis

- Python 3.9+
- Node.js 18+
- npm ou yarn

### Installation

```bash
# 1. Cloner le repository
git clone https://github.com/votre-username/music-quiz-game.git
cd music-quiz-game

# 2. Installer les dépendances backend
cd backend
python3 -m venv venv
source venv/bin/activate  # Sur Windows: venv\Scripts\activate
pip install -r requirements.txt

# 3. Installer les dépendances frontend
cd ..
npm install

# 4. Lancer l'application (2 terminaux)

# Terminal 1 - Backend
cd backend
source venv/bin/activate
python main.py

# Terminal 2 - Frontend
npm run dev
```

### Accès aux interfaces

- **Admin** : http://localhost:5173/quiz/admin
- **TV** : http://localhost:5173/tv/:gameId (après création d'une partie)
- **Mobile** : http://localhost:5173/mobile

## 📖 Guide d'utilisation

### 1. Créer un quiz (Admin)

1. Allez sur `/quiz/admin`
2. Onglet "Créer un Quiz"
3. Remplissez :
   - Titre du quiz
   - 10 questions avec URLs YouTube
   - Type de question (QCM ou texte libre)
   - 4 options pour les QCM avec la bonne réponse

### 2. Lancer une partie

1. Onglet "Gérer Parties"
2. Sélectionnez un quiz
3. Cliquez "Créer une partie"
4. Notez le **code de partie** (ex: ABC123)
5. Ouvrez l'écran TV avec "Open TV View"

### 3. Jouer (Mobile)

1. Allez sur `/mobile`
2. Entrez le code de partie
3. Entrez votre pseudo
4. Attendez que l'admin lance la partie
5. Répondez aux questions le plus vite possible !

## 🏗️ Architecture

```
music-quiz-game/
├── backend/              # API Python FastAPI
│   ├── main.py          # Routes + WebSocket
│   ├── models.py        # Modèles Pydantic
│   └── requirements.txt
├── src/
│   ├── pages/
│   │   ├── admin/       # Interface admin
│   │   ├── tv/          # Affichage TV
│   │   └── mobile/      # Interface joueur
│   ├── lib/
│   │   └── api.ts       # Client API
│   └── types/
│       └── game.ts      # Types TypeScript
├── package.json
└── vite.config.ts
```

## 🛠️ Stack technique

### Backend
- **FastAPI** : API REST + WebSocket
- **Python 3.9+** : Async/await natif
- **Pydantic** : Validation de données
- **Uvicorn** : Serveur ASGI

### Frontend
- **React 18** : UI réactive
- **TypeScript** : Type safety
- **Vite** : Build ultra-rapide
- **TailwindCSS** : Styling moderne
- **Shadcn UI** : Composants UI

### Communication
- **WebSocket** : Temps réel bidirectionnel
- **REST API** : CRUD des quiz/parties
- **YouTube Iframe API** : Lecture audio

## 🎨 Personnalisation

### Modifier le timer
```typescript
// src/pages/mobile/MobilePage.tsx
const QUESTION_DURATION = 10; // secondes
```

### Modifier le scoring
```python
# backend/main.py
def calculate_score(time_taken: float) -> int:
    base_score = 1000
    time_penalty = int(time_taken * 100)
    return max(0, base_score - time_penalty)
```

### Changer le nombre max de joueurs
```python
# backend/models.py
MAX_PLAYERS = 5  # Modifier ici
```

## 🚢 Déploiement

### Frontend (Netlify)

```bash
# Build command
npm run build

# Publish directory
dist

# Environment variables
VITE_API_URL=https://votre-backend-url.com
```

### Backend (Railway / Render / Heroku)

**Procfile** :
```
web: uvicorn main:app --host 0.0.0.0 --port $PORT
```

**Variables d'environnement** :
```
PYTHON_VERSION=3.9
```

## 📝 API Documentation

### REST Endpoints

```
POST   /api/quizzes              # Créer un quiz
GET    /api/quizzes              # Liste des quiz
GET    /api/quizzes/{id}         # Détails d'un quiz
POST   /api/games                # Créer une partie
GET    /api/games/{id}           # Détails d'une partie
POST   /api/games/{id}/start     # Démarrer la partie
```

### WebSocket

```
ws://localhost:8000/ws/{game_id}/{player_id}
```

**Messages** :
- `player_joined` : Nouveau joueur
- `game_started` : Partie lancée
- `new_question` : Nouvelle question
- `answer_submitted` : Réponse envoyée
- `question_ended` : Fin de question
- `game_ended` : Fin de partie

## 🤝 Contributing

Les contributions sont bienvenues !

1. Fork le projet
2. Créez une branche (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## 📄 License

MIT License - Voir le fichier [LICENSE](LICENSE)

## 🙏 Remerciements

- [FastAPI](https://fastapi.tiangolo.com/) - Framework backend
- [React](https://react.dev/) - Framework frontend
- [TailwindCSS](https://tailwindcss.com/) - Styling
- [Shadcn UI](https://ui.shadcn.com/) - Composants UI
- [YouTube IFrame API](https://developers.google.com/youtube/iframe_api_reference) - Intégration audio

---

Développé avec ❤️ et Claude Code
