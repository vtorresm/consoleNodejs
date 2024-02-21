import fs from 'fs';

const filePath = 'C:\\prueba\\file.txt';
const content = 'Hola Mundo probando el servicio de windows';

fs.writeFile(filePath, content, (err) => {
  if (err) {
    console.error('Error writing to file:', err);
    return;
  }

  console.log('File created successfully.');

  setTimeout(() => {
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error('Error deleting file:', err);
        return;
      }

      console.log('File deleted successfully.');
    });
  }, 120000); // 2 minutes in milliseconds
});
//Generame un codigo que me permita crear un .txt con el siguiente contenido: "Hola Mundo" por dos minutos y luego se cierre el archivo.
