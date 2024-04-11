import inquirer from 'inquirer';
import chalk from 'chalk';
import fs from 'fs';
import path from 'path';

// Función principal
async function listFiles() {
  // Preguntas para el usuario
  const questions = [
    {
      name: 'directory',
      message: 'Ingrese la ruta del directorio:',
      validate: (input) => (input ? true : 'Este campo es obligatorio.'),
    },
    {
      name: 'startDate',
      message: 'Ingrese la fecha de inicio (YYYY-MM-DD):',
      validate: (input) => (input ? true : 'Este campo es obligatorio.'),
    },
    {
      name: 'endDate',
      message: 'Ingrese la fecha de fin (YYYY-MM-DD):',
      validate: (input) => (input ? true : 'Este campo es obligatorio.'),
    },
  ];

  // Obtener respuestas del usuario
  const answers = await inquirer.prompt(questions);

  // Convertir las fechas de inicio y fin a objetos Date
  const startDate = new Date(answers.startDate);
  const endDate = new Date(answers.endDate);

  // Leer el directorio
  fs.readdir(answers.directory, (err, files) => {
    if (err) {
      console.log(chalk.red('Error al leer el directorio: ' + err));
    } else {
      console.log(
        chalk.green('Archivos en el directorio dentro del rango de fechas:')
      );
      // Iterar sobre los archivos
      files.forEach((file) => {
        const filePath = path.join(answers.directory, file);
        // Obtener las estadísticas del archivo
        fs.stat(filePath, (err, stats) => {
          if (err) {
            console.log(
              chalk.red('Error al obtener las estadísticas del archivo: ' + err)
            );
          } else {
            const modifiedDate = new Date(stats.mtime);
            // Verificar si la fecha de modificación está dentro del rango especificado
            if (modifiedDate >= startDate && modifiedDate <= endDate) {
              console.log(chalk.blue(file));
            }
          }
        });
      });
    }
  });
}

// Ejecutar la función principal
listFiles();
