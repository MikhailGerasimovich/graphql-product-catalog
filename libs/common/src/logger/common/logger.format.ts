import { format } from 'winston';

function formatTimestamp(timestamp: string) {
  const date = new Date(timestamp);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

export const customFormat = format.printf(({ timestamp, level, stack, message }) => {
  return `${formatTimestamp(timestamp)} - [${level.toUpperCase().padEnd(7)}] - ${stack || message}`;
});
