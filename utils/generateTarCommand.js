import inquirer from 'inquirer';
import chalk from 'chalk';
import fs from 'fs';

async function generateTarCommand() {
  const tarNameQuestion = {
    type: 'input',
    name: 'tarName',
    message: '¿Cuál es el nombre del archivo tar?',
  };

  const directoryQuestion = {
    type: 'input',
    name: 'directory',
    message: 'Ingresa la ruta del directorio:',
  };

  console.log(chalk.cyan('Por favor, responde las siguientes preguntas:'));
  const tarNameAnswer = await inquirer.prompt(tarNameQuestion);
  const directoryAnswer = await inquirer.prompt(directoryQuestion);

  fs.readdir(directoryAnswer.directory, (err, files) => {
    if (err) {
      console.log(chalk.red(`Error al leer el directorio: ${err}`));
    } else {
      const modifiedFiles = files.map(file => {
        if (file === 'profile_sgciprod') {
          return './' + file;
        } else if (file === 'crontab_sgciprod') {
          return 'cron/' + file;
        } else {
          return 'bin/' + file;
        }
      });

      const filesString = modifiedFiles.join(' ');
      const tarCommand = `tar -cvf ${tarNameAnswer.tarName}.tar ${filesString}`;

      console.log(chalk.green('El comando tar generado es:'));
      console.log(chalk.yellow(tarCommand));
    }
  });
}

generateTarCommand();