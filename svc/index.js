// Importamos los módulos necesarios
import nw from 'node-windows';
import { exec } from 'child_process';

// Creamos una nueva instancia de EventLogger
const log = new nw.EventLogger('MiBachero');

// Configuración del servicio
const serviceConfig = {
  // Nombre del servicio
  name: 'MiBachero',
  // Descripción del servicio
  description: 'Este es un ejemplo de servicio MiBachero creado con node-windows',
  // Script que se ejecutará al iniciar el servicio
  script: 'C:\\prueba\\script.js',
  // Opciones adicionales para el servicio
  nodeOptions: [
    '--harmony',
    '--max-old-space-size=4096'
  ]
};

// Creamos una nueva instancia de la clase Service
const svc = new nw.Service(serviceConfig);

// Evento que se dispara cuando el servicio se instala
svc.on('install', function() {
  console.log('Servicio instalado');
  svc.start();
});

// Evento que se dispara cuando el servicio se inicia
svc.on('start', function() {
  console.log('Servicio iniciado');

  // Ejecutamos el archivo .bat
  exec('C:\\prueba\\archivo.bat', function(err) {
    if (err) {
      console.error(`Error al ejecutar el archivo .bat: ${err}`);
      log.error(`Error al ejecutar el archivo .bat: ${err}`);
    }
  });

  // Detenemos el servicio después de tres minutos
  setTimeout(function() {
    svc.stop();
  }, 60000); // 180000 milisegundos son 3 minutos
});

// Evento que se dispara cuando el servicio se detiene
svc.on('stop', function() {
  console.log('Servicio detenido');
});

// Evento que se dispara cuando el servicio se desinstala
svc.on('uninstall', function() {
  console.log('Servicio desinstalado');
});

// Evento que se dispara cuando ocurre un error al iniciar el servicio
svc.on('startFailed', function(error) {
  console.error(`Error al iniciar el servicio: ${error}`);
  log.error(`Error al iniciar el servicio: ${error}`);
});

// Evento que se dispara cuando ocurre un error al detener el servicio
svc.on('stopFailed', function(error) {
  console.error(`Error al detener el servicio: ${error}`);
  log.error(`Error al detener el servicio: ${error}`);
});

// Evento que se dispara cuando ocurre un error al desinstalar el servicio
svc.on('uninstallFailed', function(error) {
  console.error(`Error al desinstalar el servicio: ${error}`);
  log.error(`Error al desinstalar el servicio: ${error}`);
});

// Instalamos el servicio
svc.install();
//svc.uninstall();