import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'dev.lovable.dailyexcerpts',
  appName: 'Daily Excerpts',
  webDir: 'dist',
  server: {
    url: 'https://53a94054-57ef-43cc-8207-e0135bc2c602.lovableproject.com?forceHideBadge=true',
    cleartext: true
  }
};

export default config;