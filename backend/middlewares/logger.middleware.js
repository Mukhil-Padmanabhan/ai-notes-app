const fs = require('fs');
const path = require('path');

/**
 * @description Logs all the API hits on to access.log file
 */

const logDirectory = path.join(__dirname, '../logs');
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory);
}

const logStream = fs.createWriteStream(path.join(logDirectory, 'access.log'), { flags: 'a' });

const loggerMiddleware = (req, res, next) => {
  const start = Date.now();
  const { method, url, ip } = req;

  res.on('finish', () => {
    const responseTime = Date.now() - start;
    const log = `${new Date().toISOString()} | ${ip} | ${method} ${url} | ${res.statusCode} | ${responseTime}ms\n`;
    logStream.write(log);
  });

  next();
};

module.exports = loggerMiddleware;
