import { inspect } from 'util';

const LEVELS = {
  error: 0,
  warn: 1,
  info: 2,
  verbose: 3,
  debug: 4,
  silly: 5
};

const createLogger = ({ logLevel, debugMode, inspectOptions = {} }) => {
  const color = (colorNum, str) =>
    (debugMode && `\x1b[${colorNum}m${str}\x1b[0m`) || str;
  const red = str => color('31', str);
  const green = str => color('32', str);
  const yellow = str => color('33', str);
  const blue = str => color('34', str);

  inspectOptions = {
    colors: debugMode,
    ...inspectOptions
  };

  logLevel = (logLevel || (debugMode ? 'debug' : 'info')).toLowerCase();

  const logger = {
    color: {
      red,
      green,
      yellow,
      blue
    },

    log: (level, ...args) => {
      args = args.map(
        a =>
          a === Object(a)
            ? debugMode
              ? inspect(a, inspectOptions)
              : JSON.stringify(a)
            : a
      );
      args.unshift(level);
      !debugMode &&
        args.unshift(new Date().toISOString().replace(/[TZ]/g, ' '));
      console.log(...args); // eslint-disable-line no-console
    },

    error: (...args) => {
      logger.log(red('ERROR'), ...args);
    },

    warn: (...args) => {
      LEVELS[logLevel] >= LEVELS.warn && logger.log(yellow('WARN'), ...args);
    },

    info: (...args) => {
      LEVELS[logLevel] >= LEVELS.info && logger.log(blue('INFO'), ...args);
    },

    debug: (...args) => {
      LEVELS[logLevel] >= LEVELS.debug && logger.log(green('DEBUG'), ...args);
    },

    silly: (...args) => {
      LEVELS[logLevel] >= LEVELS.silly && logger.log('SILLY', ...args);
    }
  };

  return logger;
};

export default createLogger;
