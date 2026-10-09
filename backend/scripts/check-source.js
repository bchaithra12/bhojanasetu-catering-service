import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const sourceDirectory = fileURLToPath(new URL('../src/', import.meta.url));

const collectJavaScriptFiles = (directory) =>
  readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = join(directory, entry.name);
    if (entry.isDirectory()) return collectJavaScriptFiles(entryPath);
    return entry.isFile() && entry.name.endsWith('.js') ? [entryPath] : [];
  });

const sourceFiles = collectJavaScriptFiles(sourceDirectory);
let hasErrors = false;

for (const sourceFile of sourceFiles) {
  const result = spawnSync(process.execPath, ['--check', sourceFile], { stdio: 'inherit' });
  if (result.status !== 0) hasErrors = true;
}

if (hasErrors) process.exitCode = 1;
else console.log(`Checked ${sourceFiles.length} backend JavaScript files.`);
