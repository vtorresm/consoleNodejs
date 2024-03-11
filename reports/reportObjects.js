import inquirer from 'inquirer';
import chalk from 'chalk';
import pkg from 'xlsx';
import fs from 'fs';
const { utils, readFile: readXLSXFile, writeFile: writeXLSXFile } = pkg;

async function gatherData() {
  const questions = [
    {
      type: 'list',
      name: 'Aplicación',
      message: 'Seleccione una Aplicación:',
      choices: [
        'Devoluciones',
        'Devoluciones Web',
        'Extranet',
        'Gestion Comercio',
        'Intercambio',
        'Interfaces Web',
      ], // Agrega tus opciones aquí
      validate: (input) => (input ? true : 'Este campo es obligatorio.'),
    },
    {
      name: 'Componente',
      message: 'Ingrese Componente:',
      validate: (input) => (input ? true : 'Este campo es obligatorio.'),
    },
    {
      name: 'TFS',
      message: 'Ingrese TFS:',
      validate: (input) => (input ? true : 'Este campo es obligatorio.'),
    },
    {
      name: 'Servidor BD',
      message: 'Ingrese Servidor BD:',
      validate: (input) => (input ? true : 'Este campo es obligatorio.'),
    },
    {
      name: 'Servidor Bash',
      message: 'Ingrese Servidor Bash:',
      validate: (input) => (input ? true : 'Este campo es obligatorio.'),
    },
    {
      type: 'list',
      name: 'Entorno',
      message: 'Seleccione un Entorno:',
      choices: ['Desarrollo', 'Certificación', 'Calidad', 'PreProducción'], // Agrega tus opciones aquí
      validate: (input) => (input ? true : 'Este campo es obligatorio.'),
    },
    {
      name: 'Ultimo Requerimiento',
      message: 'Ingrese Ultimo Requerimiento:',
      validate: (input) => (input ? true : 'Este campo es obligatorio.'),
    },
    {
      name: 'Fecha Ultimo Requerimiento',
      message: 'Ingrese Fecha Ultimo Requerimiento:',
      validate: (input) => (input ? true : 'Este campo es obligatorio.'),
    },
    {
      name: 'Observaciones',
      message: 'Ingrese Observaciones:',
      //validate: (input) => (input ? true : 'Este campo es obligatorio.'),
    },
  ];

  const answers = await inquirer.prompt(questions);

  let data = [answers]; // Convertimos las respuestas en un array para poder convertirlo en una hoja de Excel

  const filename = 'reporte.xlsx';

  // Si el archivo existe, leemos los datos existentes y los agregamos a los nuevos datos
  if (fs.existsSync(filename)) {
    const workbook = readXLSXFile(filename);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const existingData = utils.sheet_to_json(worksheet);
    data = existingData.concat(data);
  }

  const worksheet = utils.json_to_sheet(data);
  const workbook = utils.book_new();
  utils.book_append_sheet(workbook, worksheet, 'Reporte Objetos');
  writeXLSXFile(workbook, filename);
  console.log(
    chalk.blue('El reporte se ha generado con éxito en ' + filename + '.')
  );
}

gatherData();
