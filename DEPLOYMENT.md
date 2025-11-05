# 🚀 Guide de déploiement - Music Quiz Game

Ce guide vous explique comment déployer votre Music Quiz Game sur **Netlify** (frontend) et **Railway** (backend).

## 📋 Prérequis

- Compte GitHub (déjà fait ✅)
- Compte Netlify (gratuit)
- Compte Railway (gratuit avec 5$ de crédit mensuel)

---

## 🎯 Étape 1 : Déployer le Backend sur Railway

### 1.1 Créer un compte Railway

1. Allez sur [railway.app](https://railway.app)
2. Cliquez "Login" → "Login with GitHub"
3. Autorisez Railway à accéder à vos repos

### 1.2 Déployer le backend

1. Cliquez "New Project"
2. Sélectionnez "Deploy from GitHub repo"
3. Choisissez `zeplintor/music-quiz-game`
4. Railway va détecter automatiquement Python

### 1.3 Configuration Railway

**Settings → General** :
- **Service Name** : `music-quiz-backend`
- **Root Directory** : `/backend`
- **Start Command** : `uvicorn main:app --host 0.0.0.0 --port $PORT`

**Settings → Variables** :
```
PYTHON_VERSION=3.9
PORT=8000
```

### 1.4 Générer un domaine public

1. Allez dans l'onglet "Settings"
2. Section "Networking"
3. Cliquez "Generate Domain"
4. **Copiez l'URL** (exemple : `https://music-quiz-backend-production.up.railway.app`)

✅ **Votre backend est maintenant en ligne !**

---

## 🌐 Étape 2 : Déployer le Frontend sur Netlify

### 2.1 Créer un compte Netlify

1. Allez sur [netlify.com](https://netlify.com)
2. Cliquez "Sign up" → "Sign up with GitHub"
3. Autorisez Netlify

### 2.2 Déployer le frontend

1. Dans le dashboard, cliquez "Add new site" → "Import an existing project"
2. Choisissez "Deploy with GitHub"
3. Autorisez l'accès à vos repos
4. Sélectionnez `zeplintor/music-quiz-game`

### 2.3 Configuration automatique détectée

Netlify va automatiquement détecter via `netlify.toml` :

```toml
Build command: npm run build
Publish directory: dist
Node version: 18
```

✅ **Ne changez rien, c'est déjà configuré !**

### 2.4 Ajouter la variable d'environnement

**IMPORTANT** : Avant de déployer, ajoutez la variable d'environnement :

1. Dans Netlify, allez dans "Site settings" → "Environment variables"
2. Cliquez "Add a variable"
3. Ajoutez :
   - **Key** : `VITE_API_URL`
   - **Value** : `https://votre-backend-railway.up.railway.app` (URL copiée à l'étape 1.4)

### 2.5 Déployer

1. Cliquez "Deploy site"
2. Attendez 2-3 minutes
3. Netlify vous donnera une URL (exemple : `https://musical-quiz-game-abc123.netlify.app`)

✅ **Votre frontend est maintenant en ligne !**

---

## 🎮 Étape 3 : Tester votre application

Vos URLs de production :

- **Admin** : `https://votre-site.netlify.app/quiz/admin`
- **TV** : `https://votre-site.netlify.app/tv/:gameId`
- **Mobile** : `https://votre-site.netlify.app/mobile`

### Test complet :

1. Allez sur l'interface Admin
2. Créez un quiz avec des URLs YouTube
3. Créez une partie → Notez le code
4. Ouvrez la TV sur un écran
5. Ouvrez le Mobile sur votre téléphone
6. Jouez ! 🎵

---

## 🔧 Configuration avancée (optionnel)

### Domaine personnalisé sur Netlify

1. "Site settings" → "Domain management"
2. Cliquez "Add custom domain"
3. Suivez les instructions DNS

### CORS et WebSocket

Si vous avez des erreurs CORS, vérifiez dans le backend ([backend/main.py](backend/main.py:20-28)) :

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En production, mettez votre domaine Netlify
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

Pour la production, remplacez `["*"]` par :
```python
allow_origins=["https://votre-site.netlify.app"]
```

---

## 🐛 Dépannage

### Erreur : "Failed to fetch"

**Cause** : Backend non accessible ou `VITE_API_URL` incorrecte

**Solution** :
1. Vérifiez que le backend Railway est bien démarré
2. Vérifiez l'URL dans les variables d'environnement Netlify
3. Re-déployez Netlify après avoir changé la variable

### Erreur : WebSocket connection failed

**Cause** : Railway peut mettre le backend en veille après inactivité

**Solution** :
- Le premier chargement peut prendre 10-15 secondes
- Ou : Passez à un plan Railway payant pour éviter la mise en veille

### Erreur : YouTube audio ne se lance pas

**Cause** : Autoplay bloqué par le navigateur

**Solution** :
- Assurez-vous d'avoir interagi avec la page (clic) avant de lancer l'audio
- Sur mobile, l'utilisateur doit autoriser l'autoplay

---

## 💰 Coûts

### Gratuit (pour toujours) :

- ✅ **Netlify** : 300 minutes de build/mois, bande passante illimitée
- ✅ **Railway** : 5$/mois de crédit gratuit (suffisant pour usage léger)
- ✅ **GitHub** : Repos publics illimités

### Si vous dépassez :

- **Railway** : ~5$/mois pour un service actif 24/7
- **Netlify** : Gratuit pour 99% des usages, Pro à 19$/mois si vraiment nécessaire

---

## 📝 Checklist de déploiement

- [ ] Backend déployé sur Railway
- [ ] URL du backend copiée
- [ ] Frontend déployé sur Netlify
- [ ] Variable `VITE_API_URL` configurée
- [ ] Site accessible
- [ ] Test : Créer un quiz
- [ ] Test : Lancer une partie
- [ ] Test : Jouer depuis mobile
- [ ] Test : Audio YouTube fonctionne
- [ ] Test : Scoreboard s'affiche

---

## 🎉 Félicitations !

Votre Music Quiz Game est maintenant **en production** et accessible depuis n'importe où dans le monde ! 🌍

**Partagez le lien mobile avec vos amis et jouez ! 🎵🎮**

---

Besoin d'aide ? Ouvrez une issue sur [GitHub](https://github.com/zeplintor/music-quiz-game/issues)
