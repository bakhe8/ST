export interface IFileSystem {
  readdir(path: string): Promise<string[]>;
  readFile(path: string, encoding: string): Promise<string>;
  readFileSync(path: string, encoding: string): string;
  access(path: string): Promise<void>;
  exists(path: string): Promise<boolean>;
  existsSync(path: string): boolean;
  getAbsolutePath(relative: string): string;
}
