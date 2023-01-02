// Importación de módulos
import readline from 'readline';
import chalk from 'chalk';
import pkg from 'pg';

const { Client } = pkg;

// Configuración de la base de datos PostgreSQL
const dbConfig = {
  user: 'postgres',
  password: 'root',
  host: 'localhost',
  port: 5432,
  database: 'pruebas',
};

// Creación del cliente PostgreSQL
const dbClient = new Client(dbConfig);

// Función para leer datos de la consola
function promptForData(promptMessage) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(promptMessage, (data) => {
      rl.close();
      resolve(data);
    });
  });
}

// Función principal
async function main() {
  console.log(chalk.green.bold('Bienvenido al programa de consola'));

  const nombre = await promptForData('Ingresa tu nombre: ');
  const edad = await promptForData('Ingresa tu edad: ');

  try {
    // Conexión a la base de datos
    await dbClient.connect();

    // Insertar datos en la base de datos
    const insertQuery = 'INSERT INTO personas (nombre, edad) VALUES ($1, $2)';
    await dbClient.query(insertQuery, [nombre, edad]);

    console.log(chalk.green('Datos guardados en la base de datos.'));
  } catch (error) {
    console.error(chalk.red('Error al guardar los datos:', error));
  } finally {
    // Cerrar la conexión a la base de datos
    await dbClient.end();
  }
}

// Ejecutar la función principal
main().catch((error) => {
  console.error(chalk.red('Error:', error));
});
