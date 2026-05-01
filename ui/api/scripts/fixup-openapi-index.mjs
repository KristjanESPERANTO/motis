import { readFileSync, writeFileSync } from 'node:fs';

const indexPath = new URL('../openapi/index.ts', import.meta.url);
let content = readFileSync(indexPath, 'utf8');

const exportLine = "export { client } from './client.gen';";

if (!content.includes(exportLine)) {
  if (!content.endsWith('\n')) {
    content += '\n';
  }
  content += `${exportLine}\n`;
  writeFileSync(indexPath, content);
}
