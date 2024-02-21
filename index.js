import pkg from 'pg';

const { Pool } = pkg;

// Configura la conexión a la base de datos
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'PolarisDB',
  password: 'Vtorremo2024',
  port: 5432,
});

// Realiza una consulta y procesa los resultados
pool.query('SELECT * FROM list_pass', (error, result) => {
  if (error) {
    console.error('Error al realizar la consulta:', error);
  } else {
    // Imprime los resultados como un array de objetos
    console.log('Array de objetos desde la base de datos:', result.rows);
  }

  // Cierra la conexión al finalizar la consulta
  pool.end();
});
