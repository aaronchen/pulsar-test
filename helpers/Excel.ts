import _ from 'lodash'
import * as XLSX from 'xlsx'

class Excel {
  protected workbook: XLSX.WorkBook
  protected worksheet: XLSX.WorkSheet

  constructor(excel: Uint8Array | ArrayBuffer | string, options?: any) {
    if (typeof excel === 'string') {
      this.workbook = Excel.readFile(excel as string, options)
    } else if (excel instanceof Uint8Array || excel instanceof ArrayBuffer) {
      this.workbook = Excel.read(excel, options)
    } else {
      throw new TypeError('Argument `excel` can only be Uint8Array, ArrayBuffer, or string')
    }

    this.worksheet = this.workbook.Sheets[this.workbook.SheetNames[0]]
  }

  getCell(cellAddress: string | { c: number; r: number }, sheetName?: string): XLSX.CellObject {
    if ((cellAddress as XLSX.CellAddress).c !== undefined) {
      return this.getWorkSheet(sheetName)[XLSX.utils.encode_cell(cellAddress as XLSX.CellAddress)]
    } else {
      return this.getWorkSheet(sheetName)[XLSX.utils.encode_cell(XLSX.utils.decode_cell(cellAddress as string))]
    }
  }

  getWorkSheet(sheetName?: string): XLSX.WorkSheet {
    if (sheetName) {
      if (this.hasSheetName(sheetName)) {
        this.worksheet = this.getWorkSheets()[sheetName]
      } else {
        throw new Error(`WorkSheet "${sheetName}" cannot not found`)
      }
    }

    return this.worksheet
  }

  getWorkSheets(): { [sheet: string]: XLSX.WorkSheet } {
    return this.workbook.Sheets
  }

  getWorkSheetNames(): string[] {
    return this.workbook.SheetNames
  }

  hasSheetName(sheetName: string): boolean {
    return this.getWorkSheetNames().includes(sheetName)
  }

  toCsv(sheetName?: string): string {
    return XLSX.utils.sheet_to_csv(this.getWorkSheet(sheetName))
  }

  toJson(sheetName?: string): unknown[] {
    return XLSX.utils.sheet_to_json(this.getWorkSheet(sheetName))
  }

  toText(sheetName?: string): string {
    return XLSX.utils.sheet_to_txt(this.getWorkSheet(sheetName))
  }

  static getCellValue(
    excel: Uint8Array | ArrayBuffer | string,
    cellAddress: string | { c: number; r: number },
    sheetName?: string
  ): string | number | boolean | Date | undefined {
    return new Excel(excel).getCell(cellAddress, sheetName).v
  }

  static hasSheetName(excel: Uint8Array | ArrayBuffer | string, sheetName: string): boolean {
    return new Excel(excel).hasSheetName(sheetName)
  }

  static isEqual(excel1: Uint8Array | ArrayBuffer | string, excel2: Uint8Array | ArrayBuffer | string): boolean {
    const _excel1 = new Excel(excel1)
    const _excel2 = new Excel(excel2)
    const _excel1SheetNames = _excel1.getWorkSheetNames()
    const _excel2SheetNames = _excel2.getWorkSheetNames()

    if (!_.isEqual(_excel1SheetNames, _excel2SheetNames)) {
      return false
    }

    for (const sheetName of _excel1SheetNames) {
      const _sheet1Json = _excel1.toJson(sheetName)
      const _sheet2Json = _excel2.toJson(sheetName)

      if (!_.isEqual(_sheet1Json, _sheet2Json)) {
        return false
      }
    }

    return true
  }

  static read(data: Uint8Array | ArrayBuffer, options?: any): XLSX.WorkBook {
    return XLSX.read(data, options)
  }

  static readFile(filename: string, options?: any): XLSX.WorkBook {
    return XLSX.readFile(filename, options)
  }

  static toCsv(excel: Uint8Array | ArrayBuffer | string, sheetName?: string): string {
    return new Excel(excel).toCsv(sheetName)
  }

  static toJson(excel: Uint8Array | ArrayBuffer | string, sheetName?: string): unknown[] {
    return new Excel(excel).toJson(sheetName)
  }

  static toText(excel: Uint8Array | ArrayBuffer | string, sheetName?: string): string {
    return new Excel(excel).toText(sheetName)
  }
}

export { Excel }
