import { inspect } from 'util';

const LEVELS = {
  error: 0,
  warn: 1,
  info: 2,
  verbose: 3,
  debug: 4,
  silly: 5
};

const termColors = {
  red: '31',
  green: '32',
  olive: '33',
  blue: '34'
};

const createLogger = (options = {}) => {
  let {
    logLevel = 'info',
    debugMode = false,
    isNode = true,
    inspectOptions = {}
  } = options;

  const color = (color, str) => {
    if (!debugMode) return [str];

    if (isNode) {
      return [`\x1b[${termColors[color]}m${str}\x1b[0m`];
    }

    return [`%c${str}`, `color: ${color};`];
  };
  const red = str => color('red', str);
  const green = str => color('green', str);
  const yellow = str => color('olive', str); // olive in the browser gets better
  const blue = str => color('blue', str);

  inspectOptions = {
    colors: debugMode,
    ...inspectOptions
  };

  logLevel = logLevel.toLowerCase();

  const logger = {
    color: {
      red,
      green,
      yellow,
      blue
    },

    _prepareArgs: (level, ...args) => {
      args = args.map(a =>
        a === Object(a) && isNode
          ? debugMode
            ? inspect(a, inspectOptions)
            : JSON.stringify(a)
          : a
      );
      args.unshift(level);
      !debugMode &&
        args.unshift(new Date().toISOString().replace(/[TZ]/g, ' '));
      return args;
    },

    log: (logFunc, ...args) => {
      // eslint-disable-next-line no-console
      const log = console && (console[logFunc] || console.log);
      log && log(...logger._prepareArgs(...args));
    },

    error: (...args) => {
      logger.log('error', ...red('ERROR'), ...args);
    },

    warn: (...args) => {
      LEVELS[logLevel] >= LEVELS.warn &&
        logger.log('warn', ...yellow('WARN'), ...args);
    },

    info: (...args) => {
      LEVELS[logLevel] >= LEVELS.info &&
        logger.log('info', ...blue('INFO'), ...args);
    },

    debug: (...args) => {
      LEVELS[logLevel] >= LEVELS.debug &&
        logger.log('debug', ...green('DEBUG'), ...args);
    },

    silly: (...args) => {
      LEVELS[logLevel] >= LEVELS.silly && logger.log('silly', 'SILLY', ...args);
    }
  };

  return logger;
};

export default createLogger;
