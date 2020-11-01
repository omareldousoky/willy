const config = {
    REACT_APP_BASE_URL: process.env.REACT_APP_BASE_URL || 'https://api.test.halan.io',
    REACT_APP_MOHASSEL_URL: process.env.REACT_APP_MOHASSEL_URL || 'http://localhost:8081/',
    REACT_APP_LOGIN_URL: process.env.REACT_APP_LOGIN_URL || 'http://localhost:8080/',
    REACT_APP_GOOGLE_MAP_KEY: process.env.REACT_APP_GOOGLE_MAP_KEY || 'http://localhost:8081/',
    REACT_APP_DOMAIN: process.env.REACT_APP_DOMAIN || '',
    REACT_APP_LTS_SUBDOMAIN: process.env.REACT_APP_LTS_SUBDOMAIN || '',
}

module.exports = config;