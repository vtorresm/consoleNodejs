//const fs = require("fs");
import fs from 'fs'

const directorio = "C:\\NOC\\01.Produccion\\Scripts\\Nueva carpeta\\Funciones"; // Reemplaza por la ruta real

fs.readdir(directorio, (err, archivos) => {
  if (err) {
    console.error(err);
    return;
  }

  archivos.forEach((archivo) => {
    const nombreArchivo = archivo.split(".")[0];
    const extension = archivo.split(".")[1];
    const nombreArchivoMayusculas = nombreArchivo.toUpperCase();

    fs.rename(
      `${directorio}\\${archivo}`,
      `${directorio}\\${nombreArchivoMayusculas}.${extension}`,
      (err) => {
        if (err) {
          console.error(err);
          return;
        }

        console.log(`Se ha cambiado el nombre a ${nombreArchivoMayusculas}.${extension}`);
      }
      );
  });
});
