import fs from 'fs-extra'
import { promisify } from 'util'
import { exec } from 'child_process'

export const asyncExec = promisify(exec)

export const task = {
  tokens: new Map(),
  start: token => {
    task.tokens.set(token, Date.now())
  },
  end: token => {
    const startTime = task.tokens.get(token)
    task.tokens.delete(token)
    const duration = Date.now() - startTime
    console.log(`${token}: ${duration}ms`)
  },
  /**
   * @template T
   * @param {string} token 
   * @param {() => T} callback 
   * @returns {Promise<T>}
   */
  run: async (token, callback) => {
    task.start(token)
    const rslt = await callback()
    task.end(token)
    return rslt
  },
}

export const changeMainEntryPointFilePath = async (tmp) => {
  let apiExtractorJson = await fs.readFile('api-extractor.json', 'utf-8')
  const mainEntryPointFilePath = `"mainEntryPointFilePath": "${tmp}/index.d.ts"`
  const re = /"mainEntryPointFilePath": ".*index.d.ts"/
  apiExtractorJson = apiExtractorJson.replace(re, mainEntryPointFilePath)
  await fs.writeFile('api-extractor.json', apiExtractorJson, 'utf-8')
}

export const restoreMainEntryPointFilePath = async () => {
  let apiExtractorJson = await fs.readFile('api-extractor.json', 'utf-8')
  const defaultMainEntryPointFilePath = `"mainEntryPointFilePath": "<projectFolder>/tmp/index.d.ts"`
  const re = /"mainEntryPointFilePath": ".*index.d.ts"/
  apiExtractorJson = apiExtractorJson.replace(re, defaultMainEntryPointFilePath)
  await fs.writeFile('api-extractor.json', apiExtractorJson, 'utf-8')
}
