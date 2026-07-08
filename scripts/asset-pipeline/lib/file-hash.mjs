import fs from 'fs';
import crypto from 'crypto';

export function sha256File(filePath) {
  if (!fs.existsSync(filePath)) {
    return null;
  }

  const hash = crypto.createHash('sha256');
  hash.update(fs.readFileSync(filePath));
  return hash.digest('hex');
}

