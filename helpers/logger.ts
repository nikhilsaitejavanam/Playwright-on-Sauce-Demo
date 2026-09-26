import winston from 'winston';
import path from 'path';

// Custom format for console output: keeps the ANSI color codes on the level tag
const consoleFormat = winston.format.printf(({ level, message, timestamp }) => {
  return `[${timestamp}] [${level}]: ${message}`;
});

// Custom format for file output: converts the level to uppercase without color codes
const fileFormat = winston.format.printf(({ level, message, timestamp }) => {
  return `[${timestamp}] [${level.toUpperCase()}]: ${message}`;
});

// Create the shared logger instance
export const logger = winston.createLogger({
  // Minimum log severity level to capture (error: 0, warn: 1, info: 2)
  level: 'info',
  transports: [
    // 1. Console Transport: Outputs colored logs directly to the terminal
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize({ all: false }), // Colors only the level tag (e.g. green INFO, red ERROR)
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        consoleFormat
      ),
    }),

    // 2. File Transport: Appends plain text logs into the target log file
    new winston.transports.File({
      filename: path.join(__dirname, '../log/test-execution.log'),
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        fileFormat
      ),
    }),
  ],
});