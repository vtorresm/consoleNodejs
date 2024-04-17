import inquirer from 'inquirer';
import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import beautify from 'xml-beautifier';

async function formatXML() {
  const questions = [
    { name: 'filePath', message: 'Ingrese la ruta del archivo XML:', validate: input => input ? true : 'Este campo es obligatorio.' },
  ];

  const answers = await inquirer.prompt(questions);

  let filePath = path.normalize(answers.filePath);
  if (!path.isAbsolute(filePath)) {
    console.log(chalk.red('La ruta del archivo debe ser absoluta.'));
    return;
  }

  if (!fs.existsSync(filePath)) {
    console.log(chalk.red('El archivo no existe en la ruta proporcionada.'));
    return;
  }

  const fileName = path.basename(filePath);
  const directoryPath = path.dirname(filePath);
  const backupFilePath = path.join(directoryPath, `BK_${fileName}`);

  fs.copyFile(filePath, backupFilePath, (err) => {
    if (err) {
      console.log(chalk.red('Error al hacer la copia de seguridad del archivo: ' + err));
    } else {
      console.log(chalk.green('Copia de seguridad creada con éxito en ' + backupFilePath + '.'));

      fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
          console.log(chalk.red('Error al leer el archivo: ' + err));
        } else {
          const formattedXML = beautify(data);
          fs.writeFile(filePath, formattedXML, 'utf8', (err) => {
            if (err) {
              console.log(chalk.red('Error al escribir el archivo formateado: ' + err));
            } else {
              console.log(chalk.blue('Archivo XML formateado con éxito.'));
            }
          });
        }
      });
    }
  });
}

formatXML();