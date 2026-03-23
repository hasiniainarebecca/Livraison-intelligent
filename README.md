# Porte Ouverte — Système de Livraison Intelligente

## Structure du projet

```
porte_ouvetre/
├── backend/    → API REST (Laravel 12 + Sanctum + Reverb)
└── front/      → Interface web (React 18 + Vite)
```

---

## Lancement du Backend (Laravel)

```bash
cd backend

# 1. Installer les dépendances
composer install

# 2. Copier et configurer .env
cp .env.example .env
php artisan key:generate

# 3. Configurer la base de données MySQL dans .env
# DB_DATABASE=porte_ouverte
# DB_USERNAME=root
# DB_PASSWORD=

# 4. Migrations + données initiales
php artisan migrate --seed

# 5. Démarrer le serveur API
php artisan serve               # → http://localhost:8000

# 6. Démarrer le serveur WebSocket (dans un autre terminal)
php artisan reverb:start        # → ws://localhost:8080
```

---

## Lancement du Frontend (React)

```bash
cd front

# 1. Installer les dépendances
npm install

# 2. Copier et configurer .env
cp .env.example .env.local
# Renseigner VITE_REVERB_APP_KEY (même que dans backend/.env)

# 3. Démarrer le serveur de développement
npm run dev                     # → http://localhost:3000
```

---

## Schéma de la base de données

```
categories
  id | name | slug | description | icon | color | is_active
     ↑
orders
  id | client_id → users | livreur_id → users | category_id → categories
     | type | status | pickup_address | delivery_address
     | pickup_lat | pickup_lng | delivery_lat | delivery_lng
     | description | weight_kg | price | otp_code
     | estimated_at | delivered_at
     ↑                    ↑                    ↑
delivery_locations     notifications      order_status_histories
  order_id → orders     user_id → users     order_id → orders
  livreur_id → users    order_id → orders    changed_by → users
  latitude | longitude  type | title         old_status | new_status
  speed | heading       message | is_read
  recorded_at           sent_at
```

## Catégories disponibles (seeder)

| Catégorie    | Icône       | Couleur |
|-------------|-------------|---------|
| Technologie | cpu         | #3B82F6 |
| Culinaire   | utensils    | #F97316 |
| Médical     | heart-pulse | #EF4444 |
| Vêtements   | shirt       | #8B5CF6 |
| Documents   | file-text   | #6B7280 |
| Mobilier    | sofa        | #92400E |
| Cosmétiques | sparkles    | #EC4899 |
| Autre       | package     | #14B8A6 |

## Routes API

```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/auth/me

GET    /api/categories                   ← public

# Client
GET    /api/client/orders
POST   /api/client/orders
GET    /api/client/orders/{id}
PATCH  /api/client/orders/{id}/cancel

# Livreur
GET    /api/livreur/orders
PUT    /api/livreur/orders/{id}/start
PUT    /api/livreur/orders/{id}/deliver
POST   /api/livreur/orders/{id}/location

# Admin
GET    /api/admin/orders
PUT    /api/admin/orders/{id}/validate
PUT    /api/admin/orders/{id}/assign
GET    /api/admin/reports
POST   /api/admin/categories
PUT    /api/admin/categories/{id}
DELETE /api/admin/categories/{id}
```
