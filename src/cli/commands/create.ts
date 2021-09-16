import { Argv, ParseCallback } from 'yargs'
import { writeFileSync, existsSync, mkdirSync } from 'fs'
import { join } from 'path'

const template = `import {HttpRequest} from '@izzius94/express-request-validator';

export default class :className extends HttpRequest {
    protected rules() {
        // Define here your rules
        return {
        }
    }
}
`

const options = (yargs: Argv): ParseCallback => {
  return yargs.positional('class', {
    describe: 'The name of the class of the request',
    type: 'string'
  }).options('path', {
    describe: 'The path to the save the generated request validation file',
    default: process.cwd()
  }).option('force', {
    describe: 'Force overwrite of the file',
    type: 'boolean',
    default: false
  })
}

/**
 *
 * @param argv
 * @returns
 */
const handler = (argv: {path: string, class: string, force: boolean}): void => {
  /**
     * If a path is provided append it to the the current working directory, otherwise
     * use the current working directory
     */
  let path = argv.path === process.cwd() ? process.cwd() : join(process.cwd(), argv.path)

  /**
     * Creating recursively the file path if it doesn't exists
     * */
  if (!existsSync(path)) {
    mkdirSync(path, { recursive: true })
  }

  const classFile = camelToSnakeCase(argv.class)

  /**
     * Generating the new file appending the '.ts' extension if not present
     */
  path = `${path}/${classFile.substring(classFile.length - 3) === '.ts' ? classFile : `${classFile}.ts`}`

  /**
     * If the file exists and the flag --force is not set exit the program to not wrongly overwrite
     * the file.
     */
  if (existsSync(path) && !argv.force) {
    console.error(`File ${path} already exists! If you want to overwrite it use the --force flag`)
    return
  }

  /**
     * Writing the new file
     */
  writeFileSync(path, template.replace(':className', argv.class))
}

const camelToSnakeCase = (str: string): string => str.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`).substring(1)

export { options, handler }
