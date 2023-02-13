#!/usr/bin/env node

import chokidar from 'chokidar'
import { build } from './build.mjs'

const tryBuild = async () => {
  try {
    await build()
  } catch (error) {
    console.error(`Build failed:`)
    console.error(error)
  }
}

chokidar.watch('src').on('change', async () => {
  tryBuild()
})

tryBuild()
