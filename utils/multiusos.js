import inquirer from 'inquirer';
import chalk from 'chalk';
import pkg from 'xlsx';
const { utils, readFile: readXLSXFile, writeFile: writeXLSXFile } = pkg;

async function registerData() {
  const questions = [
    {
      type: 'input',
      name: 'nombre',
      message: '¿Cuál es el nombre de la IPR/PET?',
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

  let workbook;
  try {
    workbook = readXLSXFile('datos.xlsx'); // Leer el archivo Excel existente
  } catch (err) {
    workbook = utils.book_new(); // Si el archivo no existe, crear un nuevo libro de trabajo
  }

  const worksheetName = 'Datos';
  let worksheet = workbook.Sheets[worksheetName];

  if (!worksheet) {
    worksheet = utils.json_to_sheet([]);
    utils.book_append_sheet(workbook, worksheet, worksheetName);
  }

  const data = utils.sheet_to_json(worksheet); // Convertir la hoja de trabajo en un array de objetos
  data.push(answers); // Agregar las nuevas respuestas

  // Convertir los encabezados a mayúsculas
  const newData = data.map(item => {
    const newItem = {};
    for (const key in item) {
      newItem[key.toUpperCase()] = item[key];
    }
    return newItem;
  });

  const newWorksheet = utils.json_to_sheet(newData); // Convertir los datos en una nueva hoja de trabajo
  workbook.Sheets[worksheetName] = newWorksheet; // Actualizar la hoja de trabajo existente

  writeXLSXFile(workbook, 'datos.xlsx'); // Escribir el libro de trabajo en un archivo .xlsx

  console.log(chalk.green('Los datos se han registrado con éxito en datos.xlsx.'));
}

registerData();