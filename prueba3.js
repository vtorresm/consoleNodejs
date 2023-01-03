import readline from 'readline';
import chalk from 'chalk';
import pg from 'pg';
import pkg from 'exceljs';
import PDFDocument from 'pdfkit';
import { existsSync, mkdirSync, createWriteStream } from 'fs';

const { Client } = pg;
const { Workbook } = pkg;

// Configuración de la conexión a la base de datos PostgreSQL
const dbConfig = {
  user: 'postgres',
  host: 'localhost',
  database: 'pruebas',
  password: 'root',
  port: 5432,
};

// Configuración para exportar archivos
const exportPath = './exports/';
if (!existsSync(exportPath)) {
  mkdirSync(exportPath);
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question('Ingresa un nombre: ', async (nombre) => {
  rl.question('Ingresa una dirección: ', async (direccion) => {
    rl.close();

    // Guardar en la base de datos
    const client = new Client(dbConfig);
    await client.connect();

    const insertQuery = 'INSERT INTO agenda (nombre, direccion) VALUES ($1, $2) RETURNING *';
    const insertValues = [nombre, direccion];

    try {
      const result = await client.query(insertQuery, insertValues);
      const persona = result.rows[0];
      console.log(chalk.green('Persona guardada en la base de datos:'));
      console.log(persona);

      // Exportar a Excel
      const workbook = new Workbook();
      const worksheet = workbook.addWorksheet('Personas');
      worksheet.columns = [
        { header: 'ID', key: 'id', width: 10 },
        { header: 'Nombre', key: 'nombre', width: 30 },
        { header: 'Dirección', key: 'direccion', width: 50 },
      ];
      worksheet.addRow(persona);
      await workbook.xlsx.writeFile(`${exportPath}${nombre}_excel.xlsx`);
      console.log(chalk.blue('Datos exportados a Excel.'));

      // Exportar a PDF
      const pdfDoc = new PDFDocument();
      pdfDoc.pipe(createWriteStream(`${exportPath}${nombre}_pdf.pdf`));
      pdfDoc.fontSize(12).text(`ID: ${persona.id}\nNombre: ${persona.nombre}\nDirección: ${persona.direccion}`);
      pdfDoc.end();
      console.log(chalk.blue('Datos exportados a PDF.'));
    } catch (error) {
      console.error(chalk.red('Error al guardar/exportar datos:'), error);
    } finally {
      await client.end();
    }
  });
});
