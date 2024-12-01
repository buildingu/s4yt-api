import path from 'path';
import fs from 'fs';
import morgan from 'morgan';
import * as FileStreamRotator from 'file-stream-rotator';
import type { Express } from 'express';

const logFormat = ':method :url :status :response-time ms \n headers: :all-headers';

// Sets up morgan to stream output and/or the console, depending on environment settings
export const setupLogger = (app: Express) => {
  const logDir = path.resolve(process.cwd(), process.env.LOG_PATH || 'logs');

  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }

  const rotatingLogStream = FileStreamRotator.getStream({
    filename: `${logDir}/%DATE%`,
    frequency: process.env.LOG_FREQUENCY || 'daily',
    date_format: 'YYYY-MM-DD',
    size: process.env.LOG_SIZE || '100M',
    max_logs: '10',
    audit_file: `${logDir}/audit.json`,
    extension: '.log',
  });

  morgan.token("all-headers", (req) => {
    return JSON.stringify(req.headers, null, 2);
  });

  if (process.env.LOG_FILE_ON) {
    app.use(
      morgan(logFormat, {
        stream: rotatingLogStream
      }
    )); 
  }

  app.use(morgan(logFormat));
};
