const config = {
  port: process.env.PORT || 3000,
  auth: {
    secret: process.env.AUTH_SECRET || 'super-secret-thing-here-37hAGSD'
  }
};

module.exports = config;
