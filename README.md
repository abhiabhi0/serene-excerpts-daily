# Serene Excerpts Daily

A spiritual practice application that helps users maintain daily gratitudes and affirmations, with features for wisdom, breathwork, and more.

```
git checkout prod && git reset --hard main && git push --force origin prod && 
git switch main
```

## Project Structure

### Core Components

#### Authentication
- `src/context/AuthContext.tsx`: Manages authentication state and provides auth methods (signIn, signUp, signOut)
- `src/components/auth/SignIn.tsx`: Sign-in form component
- `src/components/auth/SignUp.tsx`: Sign-up form component
- `src/components/auth/ProtectedRoute.tsx`: Route wrapper for protected routes
- `src/pages/auth/callback.tsx`: Handles OAuth callbacks

#### Gratitude & Affirmations
- `src/hooks/useGratitudeAffirmationSync.ts`: Main hook for managing gratitude and affirmation data
  - Handles data synchronization between localStorage and Supabase DB
  - Provides methods for adding/removing items
  - Manages cache with keys: 'av_gratitudes', 'av_affirmations', 'av_practice_last_updated', 'av_practice_last_sync'
  - Syncs data every 5 minutes when user is logged in

- `src/components/excerpt/CollapsibleList.tsx`: Reusable component for displaying and managing lists
  - Used by both Gratitude and Affirmation sections
  - Handles expand/collapse functionality
  - Shows sign-in prompt for non-authenticated users
  - Manages input and item display

- `src/components/excerpt/GratitudeAffirmations.tsx`: Container component for both gratitude and affirmation sections
  - Uses useGratitudeAffirmationSync hook
  - Renders two CollapsibleList components

#### Pages
- `src/pages/Gratitude.tsx`: Gratitude practice page
- `src/pages/Affirmation.tsx`: Affirmation practice page
- `src/pages/Wisdom.tsx`: Daily wisdom page
- `src/pages/Breathwork.tsx`: Breathwork practice page
- `src/pages/Index.tsx`: Home page

### Data Flow

1. **Local Storage (Cache)**
   - Data is always stored in localStorage first for quick access
   - Cache keys:
     ```typescript
     const CACHE_KEYS = {
       GRATITUDES: 'av_gratitudes',
       AFFIRMATIONS: 'av_affirmations',
       LAST_UPDATED: 'av_practice_last_updated',
       LAST_SYNC: 'av_practice_last_sync'
     }
     ```

2. **Database (Supabase)**
   - Data is synced to Supabase when user is authenticated
   - Table: `user_practice_data`
   - Fields: user_id, gratitudes, affirmations, updated_at

3. **Sync Process**
   - On initial load: Load from cache first, then sync with DB
   - On user login: Sync cache to DB
   - On changes: Update cache immediately, then sync to DB
   - Periodic sync: Every 5 minutes when user is logged in

### Authentication Flow

1. **Sign Up**
   - User enters email and password
   - Account is created in Supabase
   - Cache is synced to DB
   - User is redirected to home

2. **Sign In**
   - User enters credentials
   - Session is created in Supabase
   - Cache is synced to DB
   - User is redirected to home

3. **Sign Out**
   - Session is cleared
   - Cache remains but is not synced
   - User is redirected to sign-in page

### User Experience

1. **Non-Authenticated Users**
   - Can view gratitudes and affirmations
   - Can add items (stored in cache)
   - Cannot delete items
   - See sign-in prompt when trying to save
   - Data persists in cache until browser clear

2. **Authenticated Users**
   - Full CRUD operations
   - Data syncs across devices
   - Automatic periodic sync
   - Data persists in both cache and DB

### Key Features

1. **Offline Support**
   - Works without internet
   - Data stored in localStorage
   - Syncs when connection is restored

2. **Data Persistence**
   - Browser cache for quick access
   - Supabase DB for cross-device sync
   - Automatic conflict resolution

3. **User Interface**
   - Clean, modern design
   - Responsive layout
   - Progressive enhancement
   - Clear feedback for actions

### Technical Stack

- React with TypeScript
- Supabase for authentication and database
- React Router for navigation
- Tailwind CSS for styling
- Shadcn UI components
- React Query for data management

### Development Guidelines

1. **Adding New Features**
   - Follow existing component structure
   - Use hooks for data management
   - Implement offline-first approach
   - Add proper TypeScript types

2. **Data Management**
   - Always update cache first
   - Then sync to DB if authenticated
   - Handle errors gracefully
   - Provide user feedback

3. **Authentication**
   - Use AuthContext for auth state
   - Protect routes as needed
   - Handle auth state changes
   - Sync data on auth changes

### Environment Setup

1. Required environment variables:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

2. Development:
   ```bash
   npm install
   npm run dev
   ```

3. Production:
   ```bash
   npm run build
   npm run preview
   ```

## Features

- Daily wisdom excerpts from various sources
- Theme-based excerpt filtering
- User authentication and data sync
- Progressive Web App (PWA) support
- Responsive design
- Dark/Light mode support

## Development

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on `.env.example`
4. Start the development server:
   ```bash
   npm run dev
   ```

## Environment Variables

The following environment variables are required:

- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key

### Setting Environment Variables in Netlify

1. Go to your Netlify dashboard
2. Select your site
3. Go to Site settings > Build & deploy > Environment
4. Add the following environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

## Deployment

The application is configured for deployment on Netlify. The build process is handled automatically through the following steps:

1. Build the application:
   ```bash
   npm run build
   ```
2. The `dist` directory contains the production-ready files
3. Netlify automatically deploys from the `dist` directory

## Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run preview`: Preview production build locally
- `npm run lint`: Run ESLint
- `npm run type-check`: Run TypeScript type checking

## Technologies Used

- React
- TypeScript
- Vite
- Tailwind CSS
- Supabase
- React Query
- Radix UI

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License.