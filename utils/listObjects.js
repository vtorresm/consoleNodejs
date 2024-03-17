import inquirer from 'inquirer';
import chalk from 'chalk';
import fs from 'fs';
import path from 'path';

async function listFiles() {
  const questions = [
    { name: 'directory', message: 'Ingrese la ruta del directorio:', validate: input => input ? true : 'Este campo es obligatorio.' },
    { name: 'startDate', message: 'Ingrese la fecha de inicio (YYYY-MM-DD):', validate: input => input ? true : 'Este campo es obligatorio.' },
    { name: 'endDate', message: 'Ingrese la fecha de fin (YYYY-MM-DD):', validate: input => input ? true : 'Este campo es obligatorio.' },
  ];

  const answers = await inquirer.prompt(questions);

  const startDate = new Date(answers.startDate);
  const endDate = new Date(answers.endDate);

  fs.readdir(answers.directory, (err, files) => {
    if (err) {
      console.log(chalk.red('Error al leer el directorio: ' + err));
    } else {
      console.log(chalk.green('Archivos en el directorio dentro del rango de fechas:'));
      files.forEach(file => {
        const filePath = path.join(answers.directory, file);
        fs.stat(filePath, (err, stats) => {
          if (err) {
            console.log(chalk.red('Error al obtener las estadísticas del archivo: ' + err));
          } else {
            const modifiedDate = new Date(stats.mtime);
            if (modifiedDate >= startDate && modifiedDate <= endDate) {
              console.log(chalk.blue(file));
            }
          }
        });
      });
    }
  });
}

listFiles();