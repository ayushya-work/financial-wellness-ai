// Logger utility - structured logging for production-grade application

const config = require('../config');

const LogLevel = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3
};

const levelName = {
  0: 'DEBUG',
  1: 'INFO',
  2: 'WARN',
  3: 'ERROR'
};

class Logger {
  constructor(module) {
    this.module = module;
    this.level = LogLevel[config.logLevel.toUpperCase()] || LogLevel.INFO;
  }

  log(levelNum, message, data = {}) {
    if (levelNum < this.level) return;

    const timestamp = new Date().toISOString();
    const level = levelName[levelNum];
    const output = {
      timestamp,
      level,
      module: this.module,
      message,
      ...data
    };

    if (levelNum >= LogLevel.ERROR) {
      console.error(JSON.stringify(output));
    } else {
      console.log(JSON.stringify(output));
    }
  }

  debug(message, data) {
    this.log(LogLevel.DEBUG, message, data);
  }

  info(message, data) {
    this.log(LogLevel.INFO, message, data);
  }

  warn(message, data) {
    this.log(LogLevel.WARN, message, data);
  }

  error(message, data) {
    this.log(LogLevel.ERROR, message, data);
  }
}

module.exports = Logger;
