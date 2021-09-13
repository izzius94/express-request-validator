#!/usr/bin/env node

import yargs from 'yargs'
import { options as createOptions, handler as createHandler } from './create'

const cli = yargs.command(['create <class>'], 'Create a new request', createOptions, createHandler).argv

export { cli }
