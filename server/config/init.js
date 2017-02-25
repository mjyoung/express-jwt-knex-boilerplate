import logger from '../lib/logger';

module.exports = () => {
  logger.info(`
    ████████╗███████╗███████╗████████╗     █████╗ ██████╗ ██╗
    ╚══██╔══╝██╔════╝██╔════╝╚══██╔══╝    ██╔══██╗██╔══██╗██║
       ██║   █████╗  ███████╗   ██║       ███████║██████╔╝██║
       ██║   ██╔══╝  ╚════██║   ██║       ██╔══██║██╔═══╝ ██║
       ██║   ███████╗███████║   ██║       ██║  ██║██║     ██║
       ╚═╝   ╚══════╝╚══════╝   ╚═╝       ╚═╝  ╚═╝╚═╝     ╚═╝
  `);
  // http://patorjk.com/software/taag/#p=display&f=Alligator2&t=PROS-API

  if (process.env.NODE_ENV) {
    logger.info(`Application loaded using the ${process.env.NODE_ENV} environment`);
  } else {
    logger.error('NODE_ENV is not defined! Using default development environment');
    process.env.NODE_ENV = 'development';
  }
};
