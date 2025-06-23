# Breezy

**Breezy** est un réseau social léger et réactif, inspiré de Twitter/X, optimisé pour des environnements à faibles ressources. Il permet de publier des messages courts, d’interagir avec les autres utilisateurs et d’offrir une expérience rapide et fluide, sur tous les formats d’écran.

---

## Fonctionnalités principales

|      | Fonctionnalité                                                 | Rôle                   |
| ---- | -------------------------------------------------------------- | ---------------------- |
| Fx1  | Création de comptes utilisateurs avec validation               | Visiteur → Utilisateur |
| Fx2  | Authentification sécurisée (JWT)                               | Utilisateur            |
| Fx3  | Publication de messages courts (280 caractères)                | Utilisateur            |
| Fx4  | Affichage des messages sur le profil                           | Utilisateur            |
| Fx5  | Fil chronologique des messages des utilisateurs suivis         | Utilisateur            |
| Fx6  | Liker un post                                                  | Utilisateur            |
| Fx7  | Commenter un post                                              | Utilisateur            |
| Fx8  | Répondre à un commentaire                                      | Utilisateur            |
| Fx9  | Suivre / être suivi                                            | Utilisateur            |
| Fx10 | Profil utilisateur (photo, bio)                                | Utilisateur            |

---

## Architecture

- **Frontend** : React + Next.js (mobile-first, responsive)  
- **API Gateway** : point d’entrée unique, validation JWT  
- **Micro-services** :  
  - Auth Service (Node.js/Express + JWT)  
  - User Service (CRUD utilisateurs)  
  - Post Service (gestion des messages)  
  - Feed Service (timeline, cache Redis)  
  - Notification Service (mentions, likes, follow)  
  - Media Service (stockage objet + CDN)  
  - Search Service (ElasticSearch)  
- **Persistance** : MongoDB (bases dédiées) + SQL Server (relations)  
- **Cache & file d’événements** : Redis + Kafka/RabbitMQ  
- **Load Balancer** : NGINX (TLS offloading, rate-limiting)  
- **Infrastructure** : Docker (+ Kubernetes pour la prod), CI/CD  

---

## Stack technique

- **Back-end** : Node.js, Express, Mongoose, JWT, Docker
- **Front-end** : React.js, Next.js, Tailwind CSS, Axios
- **Bases de données** : MongoDB, SQL Server
- **Cache & messaging** : Redis, Kafka/RabbitMQ
- **Observabilité** : Prometheus, Grafana, ELK

---

## Installation & démarrage

1. Clonez le dépôt :

   ```bash
   git clone https://github.com/votre-org/breezy.git
   cd breezy

2. Installer Node.js

3. Installer et démarrer Docker Desktop

4. Démarrez les services Docker :

   ```bash
   docker-compose up --build

5. Front-end :

   ```bash
   cd frontend
   npm install
   npm run dev

6. Back-end :

   ```bash
   cd backend
   npm install
   npm run dev

7. Service d'authentification

   ```bash
   cd auth
   npm install
   npm run dev

8. Accès à l'application :

Accédez à l'application sur <http://localhost:8080>
