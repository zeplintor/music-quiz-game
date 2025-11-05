# Backend - Music Quiz Game API

FastAPI backend pour le Music Quiz Game avec WebSocket temps réel.

## 🚀 Installation locale

```bash
# Créer un environnement virtuel
python3 -m venv venv

# Activer l'environnement virtuel
source venv/bin/activate  # Mac/Linux
# ou
venv\Scripts\activate  # Windows

# Installer les dépendances
pip install -r requirements.txt

# Lancer le serveur
python main.py
# ou
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Le serveur démarrera sur http://localhost:8000

## 📖 Documentation API

Une fois le serveur lancé, accédez à :
- **Swagger UI** : http://localhost:8000/docs
- **ReDoc** : http://localhost:8000/redoc

## 🔌 Endpoints

### Health Check
- `GET /` - Status de l'API
- `GET /health` - Health check pour Railway

### Quiz Management
- `POST /api/quizzes` - Créer un quiz
- `GET /api/quizzes` - Liste des quiz
- `GET /api/quizzes/{id}` - Détails d'un quiz

### Game Management
- `POST /api/games` - Créer une partie
- `GET /api/games/{id}` - Détails d'une partie
- `POST /api/games/{id}/join` - Rejoindre une partie
- `POST /api/games/{id}/start` - Démarrer la partie

### WebSocket
- `WS /ws/{game_id}/{player_id}` - Connexion temps réel

## 🚢 Déploiement sur Railway

Le déploiement est automatisé via les fichiers :
- `../nixpacks.toml` - Configuration Nixpacks
- `../railway.toml` - Configuration Railway alternative
- `../railway.json` - Configuration Railway JSON

Railway détectera automatiquement Python et démarrera le serveur avec :
```bash
cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT
```

### Variables d'environnement Railway

Aucune variable obligatoire, mais vous pouvez définir :
- `PORT` - Port d'écoute (défini automatiquement par Railway)
- `PYTHON_VERSION` - Version de Python (optionnel, défaut : 3.9)

## 🏗️ Structure

```
backend/
├── main.py              # API FastAPI + WebSocket
├── models.py            # Modèles Pydantic
├── youtube_service.py   # Service YouTube (legacy)
├── requirements.txt     # Dépendances Python
└── README.md           # Ce fichier
```

## 🧪 Test de l'API

```bash
# Test health check
curl http://localhost:8000/health

# Créer un quiz
curl -X POST http://localhost:8000/api/quizzes \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Quiz",
    "questions": [
      {
        "type": "multiple_choice",
        "youtube_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
        "correct_answer": "Option 1"
      }
    ]
  }'

# Liste des quiz
curl http://localhost:8000/api/quizzes
```

## 📝 Notes

- Le stockage est en mémoire (in-memory), les données sont perdues au redémarrage
- Pour la production, envisagez d'ajouter une base de données (PostgreSQL/MongoDB)
- Les WebSocket utilisent un ConnectionManager pour gérer les connexions par game_id
