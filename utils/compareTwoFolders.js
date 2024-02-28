import fs from 'fs';
import path from 'path';
import os from 'os';

const homedir = os.homedir();
const desktopDir = path.join(homedir, 'Desktop');
const compareDir = path.join(desktopDir, 'comparar');

const sourceDir = path.join(compareDir, 'bin-prod');
const targetDir = path.join(compareDir, 'bin-pre');
const outputDir = path.join(compareDir, 'directorio-diferencias');
//const filesDir = path.join(compareDir, 'files');

// Check if directories exist, if not, create them
[sourceDir, targetDir, outputDir].forEach(dir => {
//[sourceDir, targetDir, outputDir, filesDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Directory ${dir} created.`);
  }
});

  // Función para comparar archivos
async function compareFiles(sourceFile, targetFile) {
  try {
    const sourceData = await fs.promises.readFile(sourceFile, 'utf8');
    const targetData = await fs.promises.readFile(targetFile, 'utf8');

    return sourceData === targetData ? 'No hay diferencias' : 'Existen diferencias';
  } catch (error) {
    console.error(`Error reading files: ${error}`);
  }
}

// Función para copiar archivos
async function copyFile(sourceFile, targetFile) {
  try {
    await fs.promises.copyFile(sourceFile, targetFile);
    console.log(`Archivo copiado: ${targetFile}`);
  } catch (error) {
    console.error(`Error copying file: ${error}`);
  }
}
// Función para leer archivos
async function readFiles(dir) {
  const files = await fs.promises.readdir(dir);

  for (const file of files) {
    console.log(`Archivo en ${dir}: ${file}`);
  }
}

// Función para comparar directorios
async function compareDirectories(sourceDir, targetDir) {
  try {
    const files = await fs.promises.readdir(sourceDir);

    for (const file of files) {
      const sourceFile = path.join(sourceDir, file);
      const targetFile = path.join(targetDir, file);

      if (fs.lstatSync(sourceFile).isDirectory()) {
        // If sourceFile is a directory, compare the directories
        await compareDirectories(sourceFile, targetFile);
      } else {
        // If sourceFile is a file, compare the files
        const comparisonResult = await compareFiles(sourceFile, targetFile);

        if (comparisonResult === 'Existen diferencias') {
          await copyFile(sourceFile, path.join(outputDir, file));
        }
      }
    }

    // Also compare the files in targetDir that are not in sourceDir
    const targetFiles = await fs.promises.readdir(targetDir);

    for (const file of targetFiles) {
      const sourceFile = path.join(sourceDir, file);
      const targetFile = path.join(targetDir, file);

      if (!fs.existsSync(sourceFile)) {
        // If sourceFile does not exist, copy targetFile to outputDir
        await copyFile(targetFile, path.join(outputDir, file));
      }
    }
  } catch (error) {
    console.error(`Error comparing directories: ${error}`);
  }
}

// Iniciar comparación
await compareDirectories(sourceDir, targetDir);

// Leer archivos de ambos directorios
await readFiles(sourceDir);
await readFiles(targetDir);