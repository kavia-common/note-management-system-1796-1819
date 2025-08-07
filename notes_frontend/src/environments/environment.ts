export const environment = {
  production: false,
  apiUrl: (typeof process !== 'undefined' && process.env && process.env['NG_APP_API_URL']) ? process.env['NG_APP_API_URL'] : 'http://localhost:8080'
};
