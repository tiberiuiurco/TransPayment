const winston = require("winston");
const { format } = require("winston");
const { splat, combine, timestamp, label, printf, simple } = format;

const customFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} ${level}: ${message}, ${stack}`;
});

// const myFormatter = winston.format((info) => {
//   const { message } = info;

//   if (info.data) {
//     info.message = `${message} ${JSON.stringify(info.data)}`;
//     delete info.data; // We added `data` to the message so we can delete it
//   }

//   return info;
// })();

const logger = winston.createLogger({
  // levels: {
  //   error: 0,
  //   warn: 1,
  //   info: 2,
  //   http: 3,
  //   verbose: 4,
  //   debug: 5,
  //   silly: 6,
  // },
  level: "info",
  format: combine(
    winston.format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    customFormat,
    winston.format.simple()
  ),
  transports: [
    new winston.transports.Console({
      timestamp: true,
      colorize: true,
    }),
  ],
});

module.exports = logger;
