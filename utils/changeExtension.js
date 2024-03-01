import fs from 'fs'
import readline from 'readline'
import chalk from 'chalk'
import inquirer from 'inquirer'
import path from 'path'

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

        const extensiones = [...new Set(archivos.map(archivo => path.extname(archivo)))]

        inquirer.prompt([
            {
                type: 'checkbox',
                name: 'extensiones',
                message: '¿Qué extensiones de archivo te gustaría cambiar?',
                choices: extensiones
            },
            {
                type: 'input',
                name: 'nuevaExtension',
                message: 'Introduce la nueva extensión:',
            }
        ]).then((answers) => {
            archivos.forEach((archivo) => {
                const extension = path.extname(archivo)

                if (answers.extensiones.includes(extension)) {
                    const nombreArchivo = path.basename(archivo, extension)
                    const nuevoNombre = `${directorio}\\${nombreArchivo}.${answers.nuevaExtension}`

                    fs.rename(
                        path.join(directorio, archivo),
                        nuevoNombre,
                        (err) => {
                            if (err) {
                                console.error(chalk.red(err))
                                return
                            }

                            console.log(chalk.green(`Se ha cambiado la extensión de ${archivo} a ${nombreArchivo}.${answers.nuevaExtension}`))
                        }
                    )
                }
            })
        })
    })

    rl.close()
})