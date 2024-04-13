import fs from 'fs';
import path from 'path';
import os from 'os';

// Get the home directory and the desktop directory
const homedir = os.homedir();
const desktopDir = path.join(homedir, 'Desktop');

// Create the compare directory if it doesn't exist
const compareDir = path.join(desktopDir, 'comparar');
if (!fs.existsSync(compareDir)) {
  fs.mkdirSync(compareDir, { recursive: true });
  console.log(`Directory ${compareDir} created.`);
}

// Create the source, target, and output directories if they don't exist
const sourceDir = path.join(compareDir, 'bin-prod');
const targetDir = path.join(compareDir, 'bin-pre');
const outputDir = path.join(compareDir, 'directorio-diferencias');
const directories = [sourceDir, targetDir, outputDir];
directories.forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Directory ${dir} created.`);
  }
});

// Function to compare files
async function compareFiles(sourceFile, targetFile) {
  try {
    const sourceData = await fs.promises.readFile(sourceFile, 'utf8');
    const targetData = await fs.promises.readFile(targetFile, 'utf8');

    return sourceData === targetData
      ? 'No hay diferencias'
      : 'Existen diferencias';
  } catch (error) {
    console.error(`Error reading files: ${error}`);
  }
}

// Function to copy files
async function copyFile(sourceFile, targetFile) {
  try {
    await fs.promises.copyFile(sourceFile, targetFile);
    console.log(`Archivo copiado: ${targetFile}`);
  } catch (error) {
    console.error(`Error copying file: ${error}`);
  }
}

// Function to read files in a directory
async function readFiles(dir) {
  const files = await fs.promises.readdir(dir);

  for (const file of files) {
    console.log(`Archivo en ${dir}: ${file}`);
  }
}

// Function to compare directories
async function compareDirectories(sourceDir, targetDir) {
  try {
    const sourceFiles = await fs.promises.readdir(sourceDir);

    for (const file of sourceFiles) {
      const sourceFile = path.join(sourceDir, file);
      const targetFile = path.join(targetDir, file);

      if (fs.lstatSync(sourceFile).isDirectory()) {
        // If sourceFile is a directory, compare the directories recursively
        await compareDirectories(sourceFile, targetFile);
      } else {
        // If sourceFile is a file, compare the files
        const comparisonResult = await compareFiles(sourceFile, targetFile);

        if (comparisonResult === 'Existen diferencias') {
          await copyFile(sourceFile, path.join(outputDir, file));
        }
      }
    }

    // Compare the files in targetDir that are not in sourceDir
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

// Start the comparison
await compareDirectories(sourceDir, targetDir);

// Read files in both directories
await readFiles(sourceDir);
await readFiles(targetDir);
