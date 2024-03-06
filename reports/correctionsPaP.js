import sqlite3 from 'sqlite3';
import inquirer from 'inquirer';
import chalk from 'chalk';
import pkg from 'xlsx';
const { utils, writeFile: writeXLSXFile } = pkg;

const db = new sqlite3.Database('./data.db');

function createTable() {
  db.run(`CREATE TABLE IF NOT EXISTS data (
    IPR_PBKO TEXT,
    Descripcion TEXT,
    Fecha_PaP TEXT,
    Fecha_Correccion TEXT,
    Hora TEXT,
    Desarrollador TEXT
  )`, (err) => {
    if (err) {
      console.error(chalk.red('Error creating table.'));
      process.exit(1);
    }
  });
}

async function registerData() {
  const questions = [
    { name: 'IPR_PBKO', message: 'Ingrese IPR ó PBKO:', validate: input => input ? true : 'Este campo es obligatorio.' },
    { name: 'Descripcion', message: 'Ingrese Descripción:', validate: input => input ? true : 'Este campo es obligatorio.' },
    { name: 'Fecha_PaP', message: 'Ingrese Fecha PaP:', validate: input => input ? true : 'Este campo es obligatorio.' },
    { name: 'Fecha_Correccion', message: 'Ingrese Fecha de Corrección:', validate: input => input ? true : 'Este campo es obligatorio.' },
    { name: 'Hora', message: 'Ingrese Hora:', validate: input => input ? true : 'Este campo es obligatorio.' },
    { name: 'Desarrollador', message: 'Ingrese Desarrollador:', validate: input => input ? true : 'Este campo es obligatorio.' },
  ];

  const answers = await inquirer.prompt(questions);

  return new Promise((resolve) => {
    try {
      db.run(
        `INSERT INTO data (IPR_PBKO, Descripcion, Fecha_PaP, Fecha_Correccion, Hora, Desarrollador) VALUES (?, ?, ?, ?, ?, ?)`,
        [answers.IPR_PBKO, answers.Descripcion, answers.Fecha_PaP, answers.Fecha_Correccion, answers.Hora, answers.Desarrollador],
        (err) => {
          if (err) {
            console.error(chalk.red('Error inserting data.'));
            console.log(chalk.bgRed(err));
            resolve(false); // Devuelve false si hay un error
          } else {
            console.log(chalk.green('Los datos se han registrado con éxito en la base de datos.'));
            resolve(true); // Devuelve true si la inserción fue exitosa
          }
        }
      );
    } catch (err) {
      console.error(chalk.red('An error occurred.'));
      resolve(false); // Devuelve false si hay un error
    }
  });
}

async function generateReport() {
  let data = [];
  db.each(
    'SELECT * FROM data',
    (err, row) => {
      if (err) {
        console.error(chalk.red('Error fetching data.'));
        return;
      }
      data.push(row);
    },
    (err) => {
      if (err) {
        console.error(chalk.red('Error completing data fetch.'));
        return;
      }

      const worksheet = utils.json_to_sheet(data);
      const workbook = utils.book_new();
      utils.book_append_sheet(workbook, worksheet, 'Reporte');
      writeXLSXFile(workbook, 'reporte.xlsx');
      console.log(chalk.green('El reporte se ha generado con éxito en reporte.xlsx.'));
    }
  );
}

createTable();
registerData().then((success) => {
  if (success) {
    generateReport();
  }
});