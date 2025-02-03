import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'dev.lovable.excerpt',
  appName: 'Excerpt',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;