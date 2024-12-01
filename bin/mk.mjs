#! /usr/bin/env node

import * as path from 'node:path'
import { program } from 'commander'

import { start } from '../app.mjs'

program
  .option('-p, --port <number>', 'port number', 9090)
  .option('-d, --dir <string>', 'working directory', '.')

program.parse(process.argv)

const options = program.opts()

const dir = path.isAbsolute(options.dir) ? options.dir : path.join(process.cwd(), options.dir)

start({
  ...options,
  dir,
})

