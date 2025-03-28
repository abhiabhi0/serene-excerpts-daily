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

#### Excerpt System
- `src/data/books/*.json`: Static JSON files containing spiritual texts and their excerpts
- `src/data/staticData.ts`: Manages static excerpt data and transforms books into flattened excerpts
- `src/services/excerptService.ts`: Service for managing excerpt retrieval and caching
- `src/hooks/useExcerptData.ts`: React hook for managing excerpt state and data fetching
- `src/components/ExcerptCard.tsx`: Main component for displaying excerpts
- `src/components/excerpt/RandomExcerptsTab.tsx`: Tab component for random excerpt display

#### Data Structures
```typescript
// Excerpt with metadata
interface ExcerptWithMeta {
  text: string;
  bookTitle?: string;
  bookAuthor?: string;
  translator?: string;
  amazonLink?: string;
  isLocal?: boolean;
  isFavorite?: boolean;
  id?: string;
  themes?: string[];
}

// Book structure
interface Book {
  metadata: {
    title: string;
    author?: string;
    translator?: string;
    amazonLink?: string;
    category?: string;
    language?: string;
    tags?: string[];
  };
  excerpts: {
    text: string;
    chapter?: string;
    verse?: string;
    commentary?: boolean;
    themes?: string[];
  }[];
}
```

### Excerpt System Flow

1. **Build Time Process**
   - `generate-static-excerpts.js` script runs
   - Reads all JSON files from `books` directory
   - Creates `staticExcerpts.json` with all excerpts
   - This file is stored in the GitHub repo

2. **App Initialization**
   - App loads `staticExcerpts.json`
   - Logs total number of available excerpts
   - Initializes empty cache in localStorage

3. **First Excerpt Display**
   - `useExcerptData` hook mounts
   - Calls `getNextExcerpt`
   - Since cache is empty:
     - Generates 15 random excerpts from `staticExcerpts`
     - Stores them in localStorage
     - Returns first excerpt
     - Logs remaining count (14)

4. **User Interaction Flow**
   - When user clicks "New Excerpt":
     - `handleNewExcerpt` is called
     - `getNextExcerpt` is called
     - Takes next excerpt from cache
     - Removes it from cache
     - Logs remaining count
   - When cache gets to 1 excerpt:
     - Generates new 15 random excerpts
     - Logs new cache size
     - Continues process

5. **Theme Change Handling**
   - `handleThemeSelect` is called
   - Clears current excerpt
   - Generates new cache filtered by theme
   - Returns first excerpt from new cache

### Cache Management

1. **Cache Structure**
   - Stores 15 random excerpts at a time
   - Uses localStorage for persistence
   - Maintains separate caches for different themes
   - Cache key: 'cached_excerpts'

2. **Cache Operations**
   - **Generation**: Creates new cache of 15 random excerpts
   - **Retrieval**: Gets and removes one excerpt at a time
   - **Update**: Regenerates cache when it gets low
   - **Persistence**: Saves cache state in localStorage

3. **Performance Optimizations**
   - Efficient loading (only 15 excerpts at a time)
   - Smooth user experience (no delay when clicking "New Excerpt")
   - Theme filtering support
   - Persistent cache across page reloads
   - Automatic cache regeneration when needed

### Debug Logging

The system includes strategic console logs to track:
1. Total available excerpts from static data
2. Cache generation and management
3. Remaining excerpts after each use

Example log sequence:
```
Loaded Static Excerpts: 376
Generating new cache of excerpts...
Generated new cache with 15 excerpts
Remaining excerpts in cache: 14
Remaining excerpts in cache: 13
...
```

### Data Flow

1. **Static Data Source**
   - Excerpts are stored in JSON files in `src/data/books/`
   - Each book file contains metadata and an array of excerpts
   - Excerpts include text, chapter/verse info, and thematic tags

2. **Data Loading**
   - On build time: Books are imported and transformed into flattened excerpts
   - On runtime: Excerpts are loaded into memory and cached
   - Cache is maintained per theme and all excerpts

3. **Caching System**
   - In-memory cache using Map structure
   - Cache keys: theme name or 'all' for unfiltered excerpts
   - Cache lifetime: 30 minutes (gcTime)
   - Cache freshness: 5 minutes (staleTime)

4. **Random Excerpt Selection**
   - User can request random excerpts
   - Can filter by theme
   - System checks cache first
   - If not in cache, filters and caches results
   - Returns random excerpt from filtered/cached set

5. **User Features**
   - View random excerpts
   - Filter by theme
   - Save favorites
   - Share excerpts
   - View book details and purchase links
   - Add personal excerpts

6. **Performance Optimizations**
   - Lazy loading of excerpt cards
   - Preloading of excerpt data
   - Efficient caching system
   - Optimized filtering and random selection

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

## Static Excerpts System

The app uses a static excerpts system for efficient content delivery. Here's how it works:

### Source Data Structure
- Book data is stored in JSON files in `src/data/books/`
- Each book file contains:
  ```json
  {
    "metadata": {
      "title": "string",
      "author": "string (optional)",
      "translator": "string (optional)",
      "amazonLink": "string (optional)",
      "category": "string (optional)",
      "language": "string (optional)",
      "tags": ["string (optional)"]
    },
    "excerpts": [
      {
        "text": "string",
        "chapter": "string (optional)",
        "verse": "string (optional)",
        "commentary": "boolean (optional)",
        "themes": ["string (optional)"]
      }
    ]
  }
  ```

### Build Process
1. The `generate-static-excerpts.js` script:
   - Reads all JSON files from the `books` directory
   - Flattens the book structure into a single array of excerpts
   - Generates deterministic IDs for each excerpt
   - Creates `staticExcerpts.json` with the flattened structure

### Deterministic ID Generation
- Each excerpt gets a unique, stable ID based on:
  - Source file name
  - Excerpt text
  - Chapter and verse information
- IDs are generated using SHA-256 hashing
- First 8 characters of the hash are used as the ID
- Same excerpt always gets the same ID, even across different builds

### Runtime Usage
- The app loads `staticExcerpts.json` at startup
- The `useExcerptData` hook uses this data to:
  - Generate random excerpts
  - Filter by themes
  - Manage the cache of 15 excerpts

### Data Flow
```
books/*.json → generate-static-excerpts.js → staticExcerpts.json → useExcerptData hook
```

### Benefits
- Pre-processes data at build time
- Reduces runtime processing
- Makes data easily accessible in the browser
- Maintains all book metadata with each excerpt
- Ensures stable IDs for excerpts across builds

## Data Flow

### Static Data Source
- Excerpts are pre-processed at build time
- Source data stored in JSON files in `src/data/books/`
- Build script generates optimized `staticExcerpts.json`
- Each excerpt has a deterministic ID based on content

### Data Loading Process
1. Initial load:
   - Loads static excerpts from JSON
   - Initializes excerpt cache
   - Sets up theme filtering

2. Runtime operations:
   - Random excerpt selection
   - Theme-based filtering
   - Cache management
   - User interaction handling

### Caching System
- Maintains a cache of 15 excerpts
- Cache is regenerated when:
  - User requests new excerpt
  - Theme is changed
  - Cache is empty
- Cache persists across page reloads
- Optimized for performance

### Random Excerpt Selection
- Uses weighted random selection
- Considers:
  - Theme preferences
  - Previous excerpts
  - Commentary ratio
- Ensures diverse content delivery

### User Features
- Theme filtering
- Daily excerpt viewing
- Personal gratitude tracking
- Affirmation management
- Offline support

### Performance Optimizations
- Static data pre-processing
- Efficient caching system
- Optimized random selection
- Minimal runtime processing
- Deterministic IDs for stable references
