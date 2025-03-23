# Serene Excerpts Daily

A modern web application that provides daily wisdom excerpts and helps users cultivate mindfulness through daily rituals.

## Project Structure

```
src/
├── components/         # Reusable UI components
│   ├── ui/            # Base UI components (buttons, inputs, etc.)
│   └── ...            # Feature-specific components
├── contexts/          # React context providers
├── hooks/             # Custom React hooks
├── lib/               # Utility functions and shared logic
├── pages/             # Page components
├── services/          # API and data services
├── types/             # TypeScript type definitions
└── utils/             # Helper functions
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