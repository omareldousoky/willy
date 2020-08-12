const config = {
    REACT_APP_BASE_URL: process.env.REACT_APP_BASE_URL || 'https://api.ds.halan.io',
    REACT_APP_MOHASSEL_URL: process.env.REACT_APP_MOHASSEL_URL || 'http://localhost:8081/',
    REACT_APP_LOGIN_URL: process.env.REACT_APP_LOGIN_URL || 'http://localhost:8080/',
    REACT_APP_GOOGLE_MAP_KEY: process.env.REACT_APP_GOOGLE_MAP_KEY || 'http://localhost:8081/',
}

module.exports = config;