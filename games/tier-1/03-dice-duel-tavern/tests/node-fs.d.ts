declare module 'node:fs' {
  export function existsSync(path: string | URL): boolean;
  export function readFileSync(path: URL, encoding: 'utf8'): string;
  export function readFileSync(path: string, encoding: 'utf8'): string;
  export function readFileSync(path: string | URL): Uint8Array;
}

declare module 'node:crypto' {
  interface Hash {
    update(data: Uint8Array | string): Hash;
    digest(encoding: 'hex'): string;
  }

  export function createHash(algorithm: 'sha256'): Hash;
}
