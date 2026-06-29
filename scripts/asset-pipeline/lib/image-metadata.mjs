import fs from 'fs';
import path from 'path';

function readUInt24BE(buffer, offset) {
  return (buffer[offset] << 16) + (buffer[offset + 1] << 8) + buffer[offset + 2];
}

function readJpegDimensions(buffer) {
  let offset = 2;
  while (offset < buffer.length) {
    if (buffer[offset] !== 0xff) break;
    const marker = buffer[offset + 1];
    const length = buffer.readUInt16BE(offset + 2);
    if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
      return {
        width: buffer.readUInt16BE(offset + 7),
        height: buffer.readUInt16BE(offset + 5)
      };
    }
    offset += 2 + length;
  }
  return { width: null, height: null };
}

export function readImageMetadata(filePath) {
  if (!fs.existsSync(filePath)) {
    return { exists: false, path: filePath };
  }

  const buffer = fs.readFileSync(filePath);
  const ext = path.extname(filePath).toLowerCase();
  const metadata = {
    exists: true,
    path: filePath,
    extension: ext,
    format: 'unknown',
    width: null,
    height: null
  };

  if (buffer.length >= 24 && buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) {
    metadata.format = 'PNG';
    metadata.width = buffer.readUInt32BE(16);
    metadata.height = buffer.readUInt32BE(20);
    return metadata;
  }

  if (buffer.length >= 10 && buffer.subarray(0, 3).toString('ascii') === 'GIF') {
    metadata.format = 'GIF';
    metadata.width = buffer.readUInt16LE(6);
    metadata.height = buffer.readUInt16LE(8);
    return metadata;
  }

  if (buffer.length >= 26 && buffer.subarray(0, 4).toString('ascii') === 'RIFF' && buffer.subarray(8, 12).toString('ascii') === 'WEBP') {
    metadata.format = 'WEBP';
    const chunk = buffer.subarray(12, 16).toString('ascii');
    if (chunk === 'VP8X') {
      metadata.width = readUInt24BE(Buffer.from([buffer[26], buffer[25], buffer[24]]), 0) + 1;
      metadata.height = readUInt24BE(Buffer.from([buffer[29], buffer[28], buffer[27]]), 0) + 1;
    }
    return metadata;
  }

  if (buffer.length >= 26 && buffer.subarray(0, 2).toString('ascii') === 'BM') {
    metadata.format = 'BMP';
    metadata.width = buffer.readInt32LE(18);
    metadata.height = Math.abs(buffer.readInt32LE(22));
    return metadata;
  }

  if (buffer.length >= 4 && buffer[0] === 0xff && buffer[1] === 0xd8) {
    metadata.format = 'JPEG';
    const dimensions = readJpegDimensions(buffer);
    metadata.width = dimensions.width;
    metadata.height = dimensions.height;
    return metadata;
  }

  return metadata;
}
