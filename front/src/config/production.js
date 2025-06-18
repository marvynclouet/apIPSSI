// Configuration pour la production
export const config = {
  api: {
    baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:5001/api',
    timeout: 10000
  },
  
  app: {
    name: 'GSB Pharmacy',
    version: '1.0.0',
    environment: 'production'
  },
  
  features: {
    enableNotifications: true,
    enableAnalytics: true,
    enableErrorReporting: true
  }
};

export default config; 