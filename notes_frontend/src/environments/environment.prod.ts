export const environment = {
  production: true,
  apiUrl: (typeof process !== 'undefined' && process.env && process.env['NG_APP_API_URL']) ? process.env['NG_APP_API_URL'] : 'https://api.example.com'
};
