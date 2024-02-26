// service.js
import { Service } from 'node-windows';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import os from 'os';
import fs from 'fs';
import { spawn } from 'child_process';
import dotenv from 'dotenv';

dotenv.config();

//const password = process.env.PASSWORD;

// Ruta al archivo .bat que se ejecutará
const batFilePath = 'C:\\Bachero\\Operations.bat';

// Obtén __dirname en módulos ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuración del servicio
const svc = new Service({
  name: 'ResetOperations',
  description:
    'Servicio ResetOperations creado con node-windows para monitorerar el bachero Operations.bat y ejecutarlo cada 5 minutos.',
  script: join(__dirname, 'app.js'), // Ruta al archivo principal de tu aplicación
});

// Método para ejecutar el archivo .bat
function executeBatFile() {
  // Verificar si el archivo .bat existe
  if (!fs.existsSync(batFilePath)) {
    console.error(`El archivo ${batFilePath} no existe.`);
    return;
  }

  // Ejecutar el archivo .bat
  console.log('Ejecutando archivo Operations.bat...');
  // Aquí puedes agregar cualquier lógica adicional que necesites, como la duración de la ejecución, etc.
  const bat = spawn(batFilePath);

  // Manejar eventos de salida y error
  bat.stdout.on('data', (data) => {
    console.log(data.toString());
  });

  bat.stderr.on('data', (data) => {
    console.error(data.toString());

    // Obtén la fecha y hora actual
    const date = new Date();

    // Formatea la fecha y hora como una cadena en el formato YYYY-MM-DD HH:MM:SS
    const dateTimeString = `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(
      date.getHours()
    ).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(
      date.getSeconds()
    ).padStart(2, '0')}`;

    // Crea el nombre del archivo de log con la fecha
    const logFileName = `C:\\logs\\error-${dateTimeString.slice(0, 10)}.log`;

    // Registrar el error con la fecha y hora
    fs.appendFileSync(logFileName, `${dateTimeString} - ${data.toString()}\n`);
  });

  bat.on('exit', (code) => {
    console.log(
      `Proceso de archivo Operations.bat finalizado con código ${code}`
    );
  });
}

// Configurar el servicio
svc.on('install', () => {
  console.log('Servicio instalado.');
  // Configurar la autenticación del servicio
  svc.logOnAs.domain = process.env.DOMAIN;
  svc.logOnAs.account = process.env.ACCOUNT;
  svc.logOnAs.password = process.env.PASSWORD;

  // Obtén el nombre del usuario local actual
  const localUser = os.userInfo().username;

  // Comprueba si el usuario local y el dominio son los mismos que los de las variables de entorno
  if (
    localUser === process.env.ACCOUNT &&
    os.hostname() === process.env.DOMAIN
  ) {
    // Ejecutar el archivo .bat después de la instalación
    executeBatFile();
  } else {
    // Si no, registra un mensaje de error
    const errorMessage = `El usuario local (${localUser}) o el dominio (${os.hostname()}) no coinciden con las variables de entorno (${
      process.env.ACCOUNT
    }, ${process.env.DOMAIN}).`;
    console.error(errorMessage);

    // Y escribe el mensaje de error en el archivo .log
    const date = new Date();
    const dateTimeString = `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(
      date.getHours()
    ).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(
      date.getSeconds()
    ).padStart(2, '0')}`;
    const logFileName = `C:\\logs\\error-${dateTimeString.slice(0, 10)}.log`;
    fs.appendFileSync(logFileName, `${dateTimeString} - ${errorMessage}\n`);
  }
});

svc.on('uninstall', () => {
  console.log('Servicio desinstalado.');
});

// Instalar o desinstalar el servicio según el argumento de línea de comandos
if (process.argv[2] === 'install') {
  svc.install();
} else if (process.argv[2] === 'uninstall') {
  svc.uninstall();
} else {
  console.error('Uso: node app.js install|uninstall');
}
