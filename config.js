var config = {
  dev: {
    APP_URL: 'http://localhost:3000',
    API_URL: 'http://localhost:5000',
  },
  prod: {
    APP_URL: 'http://openmatches.org',
    API_URL: 'http://localhost:5000',
  },
}

const env = process.env.NODE_ENV === 'prod' ? config.prod : config.dev
exports.env = env
