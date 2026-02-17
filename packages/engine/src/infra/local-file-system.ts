import * as fs from 'fs/promises';
import * as fsSync from 'fs';
import * as path from 'path';
import { IFileSystem } from './file-system.interface.js';

export class LocalFileSystem implements IFileSystem {
    async readdir(dirPath: string): Promise<string[]> {
        const entries = await fs.readdir(dirPath, { withFileTypes: true });
        return entries.filter(e => e.isDirectory()).map(e => e.name);
    }

    async readFile(filePath: string, encoding: string = 'utf8'): Promise<string> {
        return (await fs.readFile(filePath, encoding as any)) as unknown as string;
    }

    readFileSync(filePath: string, encoding: string = 'utf8'): string {
        return fsSync.readFileSync(filePath, encoding as any) as unknown as string;
    }

    async access(filePath: string): Promise<void> {
        return fs.access(filePath);
    }

    async exists(filePath: string): Promise<boolean> {
        try {
            await fs.access(filePath);
            return true;
        } catch {
            return false;
        }
    }

    existsSync(filePath: string): boolean {
        return fsSync.existsSync(filePath);
    }

    getAbsolutePath(relative: string): string {
        return path.resolve(relative);
    }
}
