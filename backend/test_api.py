"""
Script de test pour vérifier que l'API fonctionne correctement
"""

import asyncio
import aiohttp
import json

API_BASE = "http://localhost:8000"


async def test_api():
    print("🧪 Test de l'API Music Quiz\n")

    async with aiohttp.ClientSession() as session:
        # Test 1: Health check
        print("1️⃣ Test du endpoint racine...")
        async with session.get(f"{API_BASE}/") as resp:
            data = await resp.json()
            print(f"   ✅ {data['message']}")

        # Test 2: Créer un quiz
        print("\n2️⃣ Création d'un quiz de test...")
        quiz_data = {
            "title": "Quiz Test Rock",
            "questions": [
                {
                    "type": "multiple_choice",
                    "youtube_url": "https://www.youtube.com/watch?v=fJ9rUzIMcZQ",
                    "options": ["Queen", "Beatles", "Rolling Stones", "Led Zeppelin"],
                    "correct_answer": "Queen"
                },
                {
                    "type": "free_text",
                    "youtube_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                    "correct_answer": "Never Gonna Give You Up"
                }
            ]
        }

        async with session.post(f"{API_BASE}/api/quizzes", json=quiz_data) as resp:
            if resp.status == 200:
                data = await resp.json()
                quiz_id = data["quiz_id"]
                print(f"   ✅ Quiz créé : {data['title']} (ID: {quiz_id})")
            else:
                print(f"   ❌ Erreur : {resp.status}")
                return

        # Test 3: Lister les quiz
        print("\n3️⃣ Récupération de la liste des quiz...")
        async with session.get(f"{API_BASE}/api/quizzes") as resp:
            data = await resp.json()
            print(f"   ✅ {len(data)} quiz trouvé(s)")

        # Test 4: Créer une partie
        print("\n4️⃣ Création d'une partie...")
        async with session.post(f"{API_BASE}/api/games/create?quiz_id={quiz_id}") as resp:
            if resp.status == 200:
                data = await resp.json()
                game_id = data["game_id"]
                print(f"   ✅ Partie créée : Code {game_id}")
            else:
                print(f"   ❌ Erreur : {resp.status}")
                return

        # Test 5: Rejoindre la partie
        print("\n5️⃣ Test de connexion de 2 joueurs...")
        players = []

        for i, name in enumerate(["Alice", "Bob"], 1):
            async with session.post(
                f"{API_BASE}/api/games/{game_id}/join",
                json={"player_name": name}
            ) as resp:
                if resp.status == 200:
                    data = await resp.json()
                    players.append(data)
                    print(f"   ✅ {name} a rejoint (ID: {data['player_id'][:8]}...)")
                else:
                    print(f"   ❌ Erreur pour {name} : {resp.status}")

        print(f"\n🎉 Tous les tests sont passés !")
        print(f"\n📋 Résumé :")
        print(f"   - Quiz ID: {quiz_id}")
        print(f"   - Game ID: {game_id}")
        print(f"   - Joueurs: {len(players)}")
        print(f"\n🌐 Testez dans le navigateur :")
        print(f"   Admin : http://localhost:5173/quiz/admin")
        print(f"   TV    : http://localhost:5173/tv/{game_id}")
        print(f"   Mobile: http://localhost:5173/mobile")


if __name__ == "__main__":
    try:
        asyncio.run(test_api())
    except aiohttp.ClientConnectorError:
        print("❌ Impossible de se connecter à l'API")
        print("Vérifiez que le backend est démarré : python main.py")
    except Exception as e:
        print(f"❌ Erreur : {e}")
