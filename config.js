var config = {
  dev: {
    APP_URL: 'http://localhost:3000',
    API_URL: 'http:localhost:5000',
  },
  prod: {
    APP_URL: 'http:example.com',
    API_URL: 'http:localhost:5000',
  },
}

var env = process.env.NODE_ENV === 'prod' ? config.prod : config.dev
