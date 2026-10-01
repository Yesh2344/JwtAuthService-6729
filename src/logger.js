import winston from 'winston';

/**
 * Winston logger configured for console output with timestamps.
 * In production you could add file transports or external log services.
 */
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.printf(
      ({ timestamp, level, message, stack }) =>
        `${timestamp} [${level.toUpperCase()}] ${stack || message}`
    )
  ),
  transports: [new winston.transports.Console()],
});

export default logger;