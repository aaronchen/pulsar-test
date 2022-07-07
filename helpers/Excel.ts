import * as XLSX from 'xlsx'

type ExcelCellAddress = {
  columnIndex: number
  rowIndex: number
}

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

  getCell(cellAddress: string | ExcelCellAddress, sheetName?: string): XLSX.CellObject {
    if ((cellAddress as ExcelCellAddress).columnIndex !== undefined) {
      return this.getWorkSheet(sheetName)[
        XLSX.utils.encode_cell({
          c: (cellAddress as ExcelCellAddress).columnIndex,
          r: (cellAddress as ExcelCellAddress).rowIndex
        })
      ]
    } else {
      return this.getWorkSheet(sheetName)[XLSX.utils.encode_cell(XLSX.utils.decode_cell(cellAddress as string))]
    }
  }

  getWorkSheet(sheetName?: string): XLSX.WorkSheet {
    if (sheetName) {
      if (this.hasSheetName(sheetName)) {
        this.worksheet = this.workbook.Sheets[sheetName]
      } else {
        throw new Error(`${sheetName} is not found`)
      }
    }

    return this.worksheet
  }

  hasSheetName(sheetName: string): boolean {
    return this.workbook.SheetNames.includes(sheetName)
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

  static hasSheetName(excel: Uint8Array | ArrayBuffer | string, sheetName: string): boolean {
    return new Excel(excel).hasSheetName(sheetName)
  }

  static getCellValue(
    excel: Uint8Array | ArrayBuffer | string,
    cellAddress: string | ExcelCellAddress,
    sheetName?: string
  ): string | number | boolean | Date | undefined {
    return new Excel(excel).getCell(cellAddress, sheetName).v
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
