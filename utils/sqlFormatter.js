import inquirer from 'inquirer';
import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import { formatDialect } from 'sql-formatter';

async function formatSQL() {
  const questions = [
    { name: 'folderPath', message: 'Ingrese la ruta de la carpeta:', validate: input => input ? true : 'Este campo es obligatorio.' },
  ];

  const answers = await inquirer.prompt(questions);

  let folderPath = path.normalize(answers.folderPath);
  if (!path.isAbsolute(folderPath)) {
    console.log(chalk.red('La ruta de la carpeta debe ser absoluta.'));
    return;
  }

  if (!fs.existsSync(folderPath)) {
    console.log(chalk.red('La carpeta no existe en la ruta proporcionada.'));
    return;
  }

  const backupFolderPath = path.join(folderPath, 'BK');
  if (!fs.existsSync(backupFolderPath)) {
    fs.mkdirSync(backupFolderPath);
  }

  fs.readdir(folderPath, (err, files) => {
    if (err) {
      console.log(chalk.red('Error al leer la carpeta: ' + err));
      return;
    }

    files.forEach(file => {
      if (path.extname(file) === '.sql') {
        const filePath = path.join(folderPath, file);
        const backupFilePath = path.join(backupFolderPath, `BK_${file}`);

        fs.copyFile(filePath, backupFilePath, (err) => {
          if (err) {
            console.log(chalk.red('Error al hacer la copia de seguridad del archivo: ' + err));
          } else {
            console.log(chalk.green('Copia de seguridad creada con éxito en ' + backupFilePath + '.'));

            fs.readFile(filePath, 'utf8', (err, data) => {
              if (err) {
                console.log(chalk.red('Error al leer el archivo: ' + err));
              } else {
                const formattedSQL = formatDialect(data, { dialect: 'plsql' });
                fs.writeFile(filePath, formattedSQL, 'utf8', (err) => {
                  if (err) {
                    console.log(chalk.red('Error al escribir el archivo formateado: ' + err));
                  } else {
                    console.log(chalk.blue('Archivo SQL formateado con éxito.'));
                  }
                });
              }
            });
          }
        });
      }
    });
  });
}

formatSQL();
