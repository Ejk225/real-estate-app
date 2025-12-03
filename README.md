# 🏠 ImmoApp - Application de Gestion Immobilière

Application moderne de gestion d'annonces immobilières construite avec React et Fastify.

## 📋 Table des matières

- [Architecture](#architecture)
- [Technologies utilisées](#technologies-utilisées)
- [Installation](#installation)
- [Lancement](#lancement)
- [Fonctionnalités](#fonctionnalités)
- [Structure du projet](#structure-du-projet)
- [Décisions architecturales](#décisions-architecturales)
- [Améliorations futures](#améliorations-futures)

---

## 🏗️ Architecture

### Backend - Architecture en couches

L'architecture backend suit le **pattern en couches** pour assurer la scalabilité et la maintenabilité :

```
┌─────────────────┐
│     Routes      │  ← Points d'entrée HTTP, validation des requêtes
├─────────────────┤
│    Services     │  ← Logique métier, orchestration
├─────────────────┤
│      Data       │  ← Persistance (JSON, facilement remplaçable par DB)
└─────────────────┘
```

**Avantages :**
- **Séparation des responsabilités** : Chaque couche a un rôle défini
- **Testabilité** : Les services peuvent être testés indépendamment
- **Évolutivité** : Facile d'ajouter de nouvelles routes ou logiques métier
- **Migration DB simplifiée** : Le layer Data peut être remplacé par un Repository pattern

### Frontend - Architecture modulaire

L'architecture frontend suit une **structure feature-based** avec composants réutilisables :

```
┌─────────────────┐
│      Pages      │  ← Vues principales, orchestration
├─────────────────┤
│   Components    │  ← Composants réutilisables (Cards, Forms)
├─────────────────┤
│    Services     │  ← Appels API centralisés
├─────────────────┤
│      Types      │  ← Types TypeScript partagés
└─────────────────┘
```

**Avantages :**
- **Composants réutilisables** : DRY principle appliqué
- **État local géré efficacement** : useState/useEffect
- **API centralisée** : Un seul point pour gérer les appels HTTP
- **Prêt pour état global** : Structure compatible avec Redux/Zustand

---

## 🛠️ Technologies utilisées

### Backend
- **Fastify** : Framework web performant et moderne
- **TypeScript** : Typage strict pour la maintenabilité
- **Zod** : Validation des schémas et génération de types
- **@fastify/cors** : Gestion CORS pour le frontend

### Frontend
- **React 18** : Bibliothèque UI moderne avec hooks
- **React Router** : Navigation entre pages
- **TypeScript** : Typage fort côté client
- **Axios** : Client HTTP avec intercepteurs
- **Vite** : Build tool ultra-rapide

---

## 📦 Installation

### Prérequis
- Node.js (version 18+)
- npm ou yarn

### Backend

```bash
cd backend
npm install
```

### Frontend

```bash
cd frontend
npm install
```

---

## 🚀 Lancement

### 1. Démarrer le backend

```bash
cd backend
npm run dev
```

Le backend démarre sur **http://localhost:3000**

Endpoints disponibles :
- `GET /health` - Health check
- `GET /api/properties` - Liste des propriétés (avec filtres optionnels)
- `GET /api/properties/:id` - Détail d'une propriété
- `POST /api/properties` - Créer une propriété
- `PUT /api/properties/:id` - Modifier une propriété
- `DELETE /api/properties/:id` - Supprimer une propriété

### 2. Démarrer le frontend

Dans un **nouveau terminal** :

```bash
cd frontend
npm run dev
```

Le frontend démarre sur **http://localhost:5173**

---

## ✨ Fonctionnalités

### Implémentées

✅ **Liste des annonces**
- Affichage en cards avec informations essentielles
- Filtres par ville et type (vente/location)
- Compteur de résultats
- États vides/chargement/erreur

✅ **Détail d'une annonce**
- Vue complète de toutes les informations
- Design clair et structuré
- Actions (modifier/supprimer)

✅ **Création d'annonce**
- Formulaire validé côté client et serveur
- Gestion des erreurs avec messages explicites
- Redirection après création

✅ **Modification d'annonce**
- Formulaire pré-rempli
- Validation identique à la création
- Mise à jour en temps réel

✅ **Suppression d'annonce**
- Confirmation avant suppression
- Retour à la liste après suppression

### Bonus implémentés

✅ **Système de filtres**
- Filtrage par ville (recherche partielle)
- Filtrage par type (vente/location)
- Réinitialisation des filtres

✅ **Architecture scalable**
- Backend multi-couches
- Frontend modulaire
- Validation Zod
- Types TypeScript stricts

✅ **UX soignée**
- Design moderne et responsive
- États de chargement
- Gestion d'erreurs
- Confirmations utilisateur

---

## 📁 Structure du projet

### Backend

```
backend/
├── src/
│   ├── routes/
│   │   └── properties.routes.ts    # Endpoints API
│   ├── services/
│   │   └── properties.service.ts   # Logique métier
│   ├── schemas/
│   │   └── property.schema.ts      # Validation Zod
│   ├── types/
│   │   └── property.types.ts       # Interfaces TypeScript
│   ├── data/
│   │   └── properties.json         # Données (mock DB)
│   └── server.ts                    # Configuration Fastify
├── package.json
└── tsconfig.json
```

### Frontend

```
frontend/
├── src/
│   ├── components/
│   │   ├── Layout.tsx              # Layout avec navigation
│   │   ├── PropertyCard.tsx        # Card d'annonce
│   │   └── PropertyForm.tsx        # Formulaire réutilisable
│   ├── pages/
│   │   ├── PropertiesList.tsx      # Liste + filtres
│   │   ├── PropertyDetail.tsx      # Détail
│   │   ├── CreateProperty.tsx      # Création
│   │   └── EditProperty.tsx        # Édition
│   ├── services/
│   │   └── api.ts                  # Client API Axios
│   ├── types/
│   │   └── property.ts             # Types partagés
│   ├── App.tsx                      # Router
│   ├── main.tsx                     # Entry point
│   └── styles.css                   # Styles globaux
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## 🎯 Décisions architecturales

### 1. Architecture en couches (Backend)

**Pourquoi ?**
- **Séparation claire** : Routes → Services → Data
- **Testabilité** : Chaque couche peut être testée indépendamment
- **Évolutivité** : Facile d'ajouter de nouvelles features
- **Migration DB** : Le service ne change pas si on passe à Postgres/MySQL

**Exemple concret :**
```typescript
// Route (point d'entrée)
fastify.get('/properties', async (request, reply) => {
  const properties = await propertiesService.getAllProperties();
  return reply.send(properties);
});

// Service (logique métier)
class PropertiesService {
  async getAllProperties() {
    return this.properties; // Ou appel à un repository
  }
}
```

### 2. Validation avec Zod

**Pourquoi ?**
- **Type-safety** : Génération automatique des types TS
- **Validation runtime** : Sécurise l'API
- **Messages d'erreur clairs** : Meilleure UX
- **DRY** : Un seul schéma pour validation + types

### 3. Composants réutilisables (Frontend)

**Pourquoi ?**
- **PropertyForm** utilisé pour Create ET Edit
- **PropertyCard** standardise l'affichage
- **Layout** partagé sur toutes les pages
- **Maintenance facilitée** : Un bug = un seul endroit à corriger

### 4. API centralisée

**Pourquoi ?**
- **Un seul fichier** (`api.ts`) pour tous les appels
- **Intercepteurs Axios** : Gestion centralisée des erreurs
- **Facile de passer à GraphQL** ou ajouter auth
- **Configuration unique** : Base URL, timeout, headers

### 5. TypeScript strict

**Pourquoi ?**
- **Catch des erreurs à la compilation**
- **Auto-complétion** : Productivité++
- **Refactoring sûr** : Le compilateur détecte les problèmes
- **Documentation vivante** : Les types expliquent le code

---

## 🚀 Améliorations futures

Si j'avais plus de temps, j'aurais ajouté :

### Backend

**Authentification & Autorisation**
- JWT tokens
- Middleware d'authentification
- Rôles utilisateurs (admin/user)

**Base de données réelle**
- Migration vers PostgreSQL/MySQL
- Repository pattern
- Migrations avec Prisma/TypeORM

**Tests**
- Tests unitaires (Jest)
- Tests d'intégration (Supertest)
- Coverage > 80%

**Fonctionnalités avancées**
- Upload d'images
- Système de favoris
- Gestion de rendez-vous
- Notifications par email

**DevOps**
- Docker/Docker Compose
- CI/CD (GitHub Actions)
- Monitoring (Prometheus)
- Logs structurés

### Frontend

**État global**
- Zustand ou Redux Toolkit
- React Query pour le cache serveur
- Optimistic updates

**UI/UX avancée**
- Galerie d'images
- Carte interactive (Mapbox)
- Mode sombre
- Animations (Framer Motion)
- PWA (offline support)

**Performance**
- Lazy loading
- Pagination infinie
- Code splitting
- Image optimization

**Fonctionnalités**
- Recherche avancée
- Tris multiples
- Comparateur de biens
- Export PDF

**Tests**
- Tests unitaires (Vitest)
- Tests E2E (Playwright)
- Tests d'accessibilité

---

## 📝 Notes techniques

### Pourquoi Fastify ?
- **Performance** : Plus rapide qu'Express
- **TypeScript first** : Support natif excellent
- **Validation intégrée** : Compatible avec Zod
- **Plugin ecosystem** : Extensible facilement

### Pourquoi Vite ?
- **HMR ultra-rapide** : Expérience dev excellente
- **Build optimisé** : Production performante
- **Simple** : Configuration minimale

### Scalabilité démontrée

**Backend prêt pour :**
- Ajout de nouvelles ressources (users, bookings...)
- Middleware d'auth
- Rate limiting
- Caching (Redis)

**Frontend prêt pour :**
- Nouvelles pages
- Composants partagés
- État global
- Internationalisation

---

## 👤 Auteur

Projet réalisé dans le cadre d'un test technique pour un poste de développeur full-stack.

**Points forts démontrés :**
- ✅ Architecture scalable et maintenable
- ✅ Code propre et bien structuré
- ✅ TypeScript strict côté client et serveur
- ✅ Validation robuste avec Zod
- ✅ UX soignée avec gestion d'erreurs
- ✅ Séparation des responsabilités claire
- ✅ Documentation complète

---

## 📄 Licence

Ce projet est un test technique et n'a pas de licence spécifique.
