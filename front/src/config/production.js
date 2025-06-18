// Configuration pour la production
export const config = {
  api: {
    baseUrl: 'https://back-at64.onrender.com/api',
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