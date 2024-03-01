import fs from 'fs'
import readline from 'readline'
import chalk from 'chalk'

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

rl.question(chalk.green('Por favor, introduce la ruta del directorio: '), (directorio) => {
  fs.readdir(directorio, (err, archivos) => {
    if (err) {
      console.error(chalk.red(err))
      return
    }

    archivos.forEach((archivo) => {
      const nombreArchivo = archivo.split('.')[0]
      const extension = archivo.split('.')[1]
      const nombreArchivoMayusculas = nombreArchivo.toUpperCase()

      fs.rename(
        `${directorio}\\${archivo}`,
        `${directorio}\\${nombreArchivoMayusculas}.${extension}`,
        (err) => {
          if (err) {
            console.error(chalk.red(err))
            return
          }

          console.log(chalk.green(`Se ha cambiado el nombre a ${nombreArchivoMayusculas}.${extension}`))
        }
      )
    })
  })

  rl.close()
})