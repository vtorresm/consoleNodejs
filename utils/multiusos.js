import inquirer from 'inquirer';
import chalk from 'chalk';
import { writeFile } from 'fs';
import { utils, writeFile as writeXLSXFile } from 'xlsx';

async function registerData() {
  const questions = [
    {
      type: 'input',
      name: 'nombre',
      message: '¿Cuál es el nombre?',
    },
    {
      type: 'input',
      name: 'codigo',
      message: '¿Cuál es el código multiuso?',
    },
    {
      type: 'input',
      name: 'desarrollador',
      message: '¿Quién es el desarrollador?',
    },
    {
      type: 'input',
      name: 'fecha',
      message: '¿Cuál es la fecha de registro?',
    },
  ];

  console.log(chalk.cyan('Por favor, responde las siguientes preguntas:'));
  const answers = await inquirer.prompt(questions);

  const data = [answers]; // Convertir las respuestas en un array de objetos
  const worksheet = utils.json_to_sheet(data); // Convertir los datos en una hoja de trabajo
  const workbook = utils.book_new(); // Crear un nuevo libro de trabajo
  utils.book_append_sheet(workbook, worksheet, 'Datos'); // Añadir la hoja de trabajo al libro de trabajo

  writeXLSXFile(workbook, 'datos.xlsx'); // Escribir el libro de trabajo en un archivo .xlsx

  console.log(chalk.green('Los datos se han registrado con éxito en datos.xlsx.'));
}

registerData();