const readline = require('readline');
const {Client} = require('pg');

// Configuración de la conexión a PostgreSQL
const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'pruebas',
  password: 'root',
  port: 5432, // Puerto predeterminado de PostgreSQL
});

// Función para leer datos desde la consola
function promptUserForData(promptText) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(promptText, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

async function main() {
  try {
    await client.connect();
    console.log('Conectado a la base de datos PostgreSQL');

    const nombre = await promptUserForData('Ingresa un nombre: ');
    const edad = await promptUserForData('Ingresa la edad: ');

    const query = 'INSERT INTO personas (nombre, edad) VALUES ($1, $2)';
    await client.query(query, [nombre, edad]);
    console.log('Datos guardados en la base de datos.');

    await client.end();
    console.log('Desconectado de la base de datos PostgreSQL');
  } catch (error) {
    console.error('Error:', error);
  }
}

main();
