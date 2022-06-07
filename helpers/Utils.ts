import fs from 'fs'
import _ from 'lodash'

class Utils {
  static isPath(path: string): boolean {
    return fs.existsSync(path)
  }

  static makeDir(directory: string) {
    if (!Utils.isPath(directory)) fs.mkdirSync(directory, { recursive: true })
  }

  static readFile(filepath: string): Buffer | string {
    if (!Utils.isPath(filepath)) {
      throw new Error(`File does not exist: ${filepath}`)
    }

    return fs.readFileSync(filepath)
  }

  static readJSON(jsonFile: string) {
    const data = Utils.readFile(jsonFile) as string
    return JSON.parse(data)
  }

  static removeDir(directory: string) {
    if (Utils.isPath(directory)) fs.rmdirSync(directory, { recursive: true })
  }

  static removeFile(filepath: string) {
    if (Utils.isPath(filepath)) fs.unlinkSync(filepath)
  }

  static sample(collection: any): any {
    return _.sample(collection)
  }

  static sampleSize(collection: any, number: number): any {
    return _.sampleSize(collection, number)
  }
}

export { Utils }
