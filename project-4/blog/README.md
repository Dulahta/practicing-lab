# 📝 Blog Application

A full-stack blogging platform built with Next.js, featuring user authentication, article management, and a comment system. Users can create, publish, and manage their articles with a seamless reading experience for guests.

---

## 🚀 Features

- **User Authentication**
  - Email/password registration and login
  - Google OAuth integration
  - Secure JWT session management
  - Password strength validation (8+ chars, uppercase, lowercase, numbers)

- **Article Management**
  - Create, edit, and delete articles (author-only)
  - Publish/unpublish articles
  - Auto-generated URL slugs
  - Rich article listing with author information

- **Comments System**
  - Public comments on articles
  - User attribution for comments
  - Form validation and error handling

- **Modern UI/UX**
  - Responsive design with CSS modules
  - Purple gradient theme (#667eea → #764ba2)
  - Smooth animations and transitions
  - Loading states and error feedback
  - Published articles with 60-second ISR (Incremental Static Regeneration)

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, Next.js 16, TypeScript |
| **Authentication** | NextAuth.js v4, JWT, bcryptjs |
| **Database** | better-sqlite3 (SQLite) |
| **Validation** | Zod |
| **Styling** | CSS Modules |
| **Runtime** | Node.js |

---

## 📋 Prerequisites

- Node.js 18+ and npm
- Git

---

## 🎯 Setup Instructions

### 1. **Clone & Install Dependencies**

```bash
cd blog
npm install
```

### 2. **Environment Configuration**

Create a `.env.local` file in the project root:

```env
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_generated_secret_here

# Google OAuth (optional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Database
DATABASE_URL=./blog.db
```

**Generate NEXTAUTH_SECRET:**
```bash
npx auth secret
```

### 3. **Initialize Database**

```bash
npm run db:migrate
```

This creates the SQLite database with all required tables and indexes.

### 4. **Start Development Server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. **Build for Production**

```bash
npm run build
npm run start
```

---

## 🏗 Architecture Overview

### **Authentication Flow**

```
┌─────────────────────────────────────┐
│      User Registration/Login        │
└──────────────┬──────────────────────┘
               │
               ├─→ Credentials Provider (Email/Password)
               │   ├─→ Validate input with Zod
               │   ├─→ Hash & verify password (bcryptjs)
               │   └─→ Create session with JWT
               │
               └─→ Google OAuth Provider
                   ├─→ Redirect to Google
                   ├─→ Receive authorization code
                   └─→ Create/link user account
                   
                    ↓
        ┌──────────────────────────┐
        │  Session Management      │
        ├──────────────────────────┤
        │ Strategy: JWT            │
        │ Duration: 7 days         │
        │ Storage: DB + Browser    │
        └──────────────────────────┘
```

### **Data Flow**

```
User Actions → API Routes → Database Queries → Response
     ↓            ↓              ↓              ↓
  Components   Validation    CRUD Ops      JSON Response
```

---

## 📊 Database Schema

### **Relationships Diagram**

```
┌─────────────┐
│   users     │
├─────────────┤
│ id (PK)     │
│ name        │
│ email       │◄────────────┐
│ password    │             │
│ image       │             │
└──────┬──────┘             │
       │                    │
       │ 1:N                │ 1:N
       │                    │
       ├──→ ┌──────────────────┐
       │    │    articles      │
       │    ├──────────────────┤
       │    │ id (PK)          │
       │    │ author_id (FK)───┼────→ users
       │    │ title            │
       │    │ slug             │
       │    │ content          │
       │    │ published        │
       │    └────────┬─────────┘
       │             │
       │             │ 1:N
       │             │
       │             └──→ ┌──────────────────┐
       │                  │    comments      │
       │                  ├──────────────────┤
       │                  │ id (PK)          │
       │                  │ article_id (FK)  │
       │                  │ user_id (FK)─────┼────→ users
       │                  │ body             │
       │                  └──────────────────┘
       │
       ├──→ ┌──────────────────┐
       │    │    sessions      │
       │    ├──────────────────┤
       │    │ id (PK)          │
       │    │ user_id (FK)─────┼────→ users
       │    │ session_id       │
       │    │ token            │
       │    │ expires_at       │
       │    └──────────────────┘
       │
       └──→ ┌──────────────────┐
            │    accounts      │
            ├──────────────────┤
            │ id (PK)          │
            │ user_id (FK)─────┼────→ users
            │ provider         │
            │ provider_id      │
            └──────────────────┘
```

### **Table Details**

#### **users**
```sql
id INTEGER PRIMARY KEY
name TEXT NOT NULL
email TEXT NOT NULL UNIQUE
password_hash TEXT (nullable for OAuth users)
image TEXT
created_at TEXT DEFAULT CURRENT_TIMESTAMP
```

#### **articles**
```sql
id INTEGER PRIMARY KEY
author_id INTEGER NOT NULL (FK → users.id, CASCADE DELETE)
title TEXT NOT NULL
slug TEXT NOT NULL UNIQUE
content TEXT NOT NULL
published INTEGER DEFAULT 0
created_at TEXT DEFAULT CURRENT_TIMESTAMP
updated_at TEXT (auto-updated via trigger)
```

#### **comments**
```sql
id INTEGER PRIMARY KEY
article_id INTEGER NOT NULL (FK → articles.id, CASCADE DELETE)
user_id INTEGER NOT NULL (FK → users.id, CASCADE DELETE)
body TEXT NOT NULL
created_at TEXT DEFAULT CURRENT_TIMESTAMP
```

#### **sessions**
```sql
id INTEGER PRIMARY KEY
session_id TEXT NOT NULL UNIQUE
user_id INTEGER NOT NULL (FK → users.id, CASCADE DELETE)
token TEXT NOT NULL UNIQUE
expires_at TEXT NOT NULL
created_at TEXT DEFAULT CURRENT_TIMESTAMP
```

#### **accounts** (OAuth)
```sql
id INTEGER PRIMARY KEY
user_id INTEGER NOT NULL (FK → users.id, CASCADE DELETE)
provider TEXT NOT NULL (e.g., "google")
provider_account_id TEXT NOT NULL
created_at TEXT DEFAULT CURRENT_TIMESTAMP
UNIQUE(provider, provider_account_id)
```

---

## 🔌 API Routes

### **Authentication**

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/auth/[...nextauth]` | POST | - | NextAuth callback endpoint |
| `/api/register` | POST | - | Register new user |

**POST /api/register**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

### **Articles**

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/articles` | GET | ✅ Required | Get user's articles |
| `/api/articles` | POST | ✅ Required | Create new article |
| `/api/articles/[id]` | PUT | ✅ Required | Update article (author only) |
| `/api/articles/[id]` | DELETE | ✅ Required | Delete article (author only) |

**POST /api/articles** (Create)
```json
{
  "title": "My First Article",
  "content": "This is the article content...",
  "published": false
}
```

**PUT /api/articles/[id]** (Update)
```json
{
  "title": "Updated Title",
  "content": "Updated content...",
  "published": true
}
```

### **Comments**

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/comments` | POST | ✅ Required | Add comment to article |

**POST /api/comments**
```json
{
  "articleId": 1,
  "body": "Great article!"
}
```

---

## 📁 Project Structure

```
blog/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/    # NextAuth configuration
│   │   ├── articles/              # Article CRUD endpoints
│   │   │   └── [id]/              # Dynamic routes (PUT, DELETE)
│   │   ├── comments/              # Comment creation
│   │   └── register/              # User registration
│   ├── (auth)/
│   │   ├── login/                 # Login page
│   │   └── register/              # Registration page
│   ├── articles/                  # Public articles listing
│   ├── dashboard/                 # User dashboard (protected)
│   ├── layout.tsx                 # Root layout with auth
│   ├── page.tsx                   # Home page
│   └── globals.css                # Global styles
│
├── components/
│   ├── ArticleModal.tsx           # Create/edit article modal
│   ├── CommentForm.tsx            # Comment submission form
│   ├── DashboardArticles.tsx      # Dashboard article list
│   └── SignOutButton.tsx          # Logout button
│
├── lib/
│   ├── auth.ts                    # NextAuth configuration
│   ├── db.ts                      # Database initialization
│   ├── migrations.ts              # Database schema
│   ├── password.ts                # Password hashing utilities
│   ├── schemas.ts                 # Zod validation schemas
│   ├── utils.ts                   # Helper functions
│   └── queries/
│       ├── users.ts               # User queries
│       ├── articles.ts            # Article queries
│       ├── comments.ts            # Comment queries
│       ├── sessions.ts            # Session queries
│       └── accounts.ts            # OAuth account queries
│
├── types/
│   └── next-auth.d.ts             # NextAuth type extensions
│
├── scripts/
│   └── migrate.ts                 # Database migration runner
│
├── public/
│   └── images/                    # Static assets
│
├── .env.local                     # Environment variables (local)
├── package.json                   # Dependencies
├── tsconfig.json                  # TypeScript configuration
└── next.config.ts                # Next.js configuration
```

---

## 🔐 Authentication Details

### **Validation Schemas (Zod)**

**Register Schema**
```typescript
{
  name: string (2-50 chars)
  email: string (valid email, lowercase, trimmed)
  password: string (8-128 chars, uppercase + lowercase + numbers)
}
```

**Login Schema**
```typescript
{
  email: string (valid email, lowercase, trimmed)
  password: string (required)
}
```

### **Session Management**

- **Strategy**: JWT (JSON Web Tokens)
- **Duration**: 7 days
- **Token Storage**: Http-only cookies (secure)
- **Session Data**: userId, sessionId, email, name

### **Password Security**

- **Algorithm**: bcryptjs
- **Salt Rounds**: 10
- **Hashed**: Before database storage
- **Verified**: During login with bcryptjs.compare()

---

## 🎨 UI/UX Styling

- **Color Scheme**: Purple gradient (#667eea → #764ba2)
- **Design**: Modern, clean, responsive
- **CSS**: Modules (scoped styling)
- **Features**:
  - Smooth transitions and hover effects
  - Loading states on buttons
  - Error/success message styling
  - Mobile-responsive layout

---

## 📄 Key Files Explanation

### **lib/auth.ts**
NextAuth configuration with Credentials and Google providers.

### **lib/db.ts**
SQLite database initialization and connection management.

### **lib/migrations.ts**
Database schema creation with tables, indexes, and triggers.

### **lib/queries/\***
Database query functions for CRUD operations (users, articles, comments, sessions).

### **lib/schemas.ts**
Zod validation schemas for form inputs (register, login, articles, comments).

---

## 🧪 Development Workflow

1. **Create Article**: User fills form → Modal validates → POST /api/articles
2. **Edit Article**: User modifies → Form validates → PUT /api/articles/[id]
3. **Delete Article**: User confirms → DELETE /api/articles/[id] → Dashboard refreshes
4. **Add Comment**: User types → Form validates → POST /api/comments
5. **View Articles**: GET /api/articles (articles page with 60s ISR)

---

## 🚦 Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request (validation error) |
| 401 | Unauthorized (not logged in) |
| 403 | Forbidden (not author) |
| 404 | Not Found |
| 409 | Conflict (email already exists) |
| 500 | Server Error |

---

## 📚 Database Queries

### **User Registration**
```javascript
// Register user
INSERT INTO users (name, email, password_hash) 
VALUES (?, ?, ?)

// Check user exists
SELECT * FROM users WHERE email = ?
```

### **Article Operations**
```javascript
// Create article
INSERT INTO articles (author_id, title, slug, content, published)
VALUES (?, ?, ?, ?, ?)

// Get user's articles
SELECT * FROM articles WHERE author_id = ? ORDER BY created_at DESC

// Publish article
UPDATE articles SET published = 1 WHERE id = ? AND author_id = ?
```

### **Comments**
```javascript
// Add comment
INSERT INTO comments (article_id, user_id, body) 
VALUES (?, ?, ?)

// Get article comments
SELECT c.*, u.name FROM comments c
JOIN users u ON c.user_id = u.id
WHERE c.article_id = ? ORDER BY c.created_at DESC
```

---

## 🔧 Troubleshooting

### **Database Issues**
```bash
# Reinitialize database
rm blog.db
npm run db:migrate
```

### **JWT Errors**
```bash
# Regenerate secret
npx auth secret
```

### **Port Already In Use**
```bash
# Use custom port
npm run dev -- -p 3001
```

---

## 📦 Build & Deployment

### **Production Build**
```bash
npm run build
npm run start
```

### **Deploy to Vercel**
```bash
# Push to GitHub, then deploy from Vercel dashboard
```

**Environment Variables (Set in Vercel):**
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`

---

## 📝 License

MIT

---

## 🤝 Support

For issues or questions, refer to:
- [Next.js Docs](https://nextjs.org/docs)
- [NextAuth.js Docs](https://next-auth.js.org)
- [Zod Validation](https://zod.dev)
