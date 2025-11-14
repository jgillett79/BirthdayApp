# 🎂 BirthdayApp

A modern, family-friendly birthday and anniversary tracking application with AI-powered gift suggestions.

## Features

- 🎉 **Track Birthdays & Anniversaries** - Never forget an important date
- 👨‍👩‍👧‍👦 **Family Member Management** - Organize events by family members
- 🔔 **Smart Notifications** - Configurable reminders for upcoming events
- 🎁 **AI Gift Suggestions** - Get personalized gift ideas powered by AI
- 🌍 **Global Ready** - Built with security and GDPR compliance in mind
- 📱 **Responsive Design** - Works beautifully on desktop and mobile
- 🚀 **Ready for iOS** - Architecture supports future React Native app

## Tech Stack

**Frontend:**
- React 18 with TypeScript
- Vite for fast development
- TailwindCSS for styling
- React Query for data fetching
- React Router for navigation

**Backend:**
- Vercel Serverless Functions
- PostgreSQL (Vercel Postgres)
- JWT Authentication
- bcrypt for password hashing

**Deployment:**
- Vercel (Frontend + API)
- Vercel Postgres (Database)

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Vercel account
- A Vercel Postgres database (created through Vercel dashboard)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd BirthdayApp
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```

3. **Set up environment variables**

   Create `.env` in the root directory:
   ```bash
   cp .env.example .env
   ```

   Create `.env` in the client directory:
   ```bash
   cp client/.env.example client/.env
   ```

   Update the `.env` file with your Vercel Postgres credentials (available in your Vercel dashboard).

4. **Initialize the database**

   Run the schema.sql file in your Vercel Postgres dashboard or use a PostgreSQL client:
   ```bash
   psql $POSTGRES_URL -f api/db/schema.sql
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

   This will start:
   - Frontend on http://localhost:3000
   - API on http://localhost:3001

## Deployment to Vercel

### 1. Install Vercel CLI
```bash
npm i -g vercel
```

### 2. Login to Vercel
```bash
vercel login
```

### 3. Link your project
```bash
vercel link
```

### 4. Set up Vercel Postgres

1. Go to your Vercel Dashboard
2. Navigate to Storage → Create Database → Postgres
3. Once created, go to the `.env.local` tab and copy all environment variables
4. Add them to your Vercel project:
   ```bash
   vercel env add POSTGRES_URL
   vercel env add POSTGRES_PRISMA_URL
   vercel env add JWT_SECRET
   # ... add all other variables
   ```

### 5. Initialize the database

1. Go to your Vercel Postgres dashboard
2. Click on "Query" tab
3. Copy the contents of `api/db/schema.sql` and run it

### 6. Deploy
```bash
vercel --prod
```

Your app is now live! 🎉

## Environment Variables

### Root `.env` (Backend)
- `POSTGRES_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret key for JWT tokens (generate a random string)
- `OPENAI_API_KEY` (optional) - For AI gift suggestions
- `ANTHROPIC_API_KEY` (optional) - Alternative for AI gift suggestions

### Client `.env` (Frontend)
- `VITE_API_URL` - API endpoint (use `/api` for production)

## Project Structure

```
BirthdayApp/
├── api/                      # Backend serverless functions
│   ├── auth/                 # Authentication endpoints
│   ├── events/               # Event management endpoints
│   ├── gifts/                # Gift ideas and suggestions
│   ├── family-members/       # Family member endpoints
│   ├── db/                   # Database schema and utilities
│   ├── middleware/           # Auth middleware
│   └── utils/                # Utility functions
├── client/                   # Frontend React app
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── pages/            # Page components
│   │   ├── services/         # API service layer
│   │   ├── contexts/         # React contexts
│   │   └── types/            # TypeScript types
│   └── public/               # Static assets
├── shared/                   # Shared types between frontend and backend
└── vercel.json              # Vercel configuration
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

### Events
- `GET /api/events` - Get all events
- `POST /api/events` - Create event
- `GET /api/events/:id` - Get event by ID
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event
- `GET /api/events/upcoming` - Get upcoming events

### Family Members
- `GET /api/family-members` - Get all family members
- `POST /api/family-members` - Create family member

### Gifts
- `GET /api/gifts` - Get gift ideas
- `POST /api/gifts` - Create gift idea
- `POST /api/gifts/suggestions` - Get AI gift suggestions

## Security Features

- Password hashing with bcrypt
- JWT token-based authentication
- SQL injection prevention
- CORS configuration
- Input validation
- Secure environment variable handling

## Future Enhancements

- [ ] iOS app with React Native
- [ ] Email/Push notifications
- [ ] Calendar integration (Google Calendar, Apple Calendar)
- [ ] Gift purchase tracking
- [ ] Multi-user family accounts
- [ ] Photo uploads for events
- [ ] Recurring event reminders
- [ ] Gift history tracking
- [ ] Social sharing features
- [ ] Multiple languages support

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

ISC

## Support

For issues and questions, please open an issue on GitHub.
