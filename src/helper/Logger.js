class Logger {
  static log(...args) {
    if (__DEV__) {
      console.log('[LOG]', ...args);
    }
  }

  static warn(...args) {
    if (__DEV__) {
      console.warn('[WARN]', ...args);
    }
  }

  static error(...args) {
    // Errors should show in both dev & prod
    console.error('[ERROR]', ...args);
  }

  static info(...args) {
    if (__DEV__) {
      console.info('[INFO]', ...args);
    }
  }

  // Optional: disable all logs (handy for prod hotfix)
  static disableAll() {
    console.log = () => {};
    console.warn = () => {};
    console.info = () => {};
  }
}

export default Logger;
