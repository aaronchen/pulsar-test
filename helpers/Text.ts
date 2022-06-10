import { DateTime } from 'luxon'

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
const DIGITS = '0123456789'
const PUNCTUATION = `!"#$%&'()*+,-./:;<=>?@[\\]^_\`{|}~`

class Text {
  static daySince(
    days: number,
    options: { format?: string; timezone?: string } = { format: 'LL/dd/yyyy', timezone: 'local' }
  ): string {
    const _format = options.format ?? 'LL/dd/yyyy'
    const _timezone = options.timezone ?? 'local'

    if (days >= 0) {
      return DateTime.now().setZone(_timezone).plus({ days }).toFormat(_format)
    } else {
      return DateTime.now().setZone(_timezone).minus({ days }).toFormat(_format)
    }
  }

  static toDateTime(dateString: string, format = 'LL/dd/yyyy', timezone = 'local'): DateTime {
    return DateTime.fromFormat(dateString, format, { zone: timezone })
  }

  static random(
    size = 10,
    options: { letters?: boolean; digits?: boolean; whitespace?: boolean; punctuation?: boolean } = {
      letters: true,
      digits: true,
      whitespace: false,
      punctuation: false
    }
  ): string {
    options = { letters: true, digits: true, whitespace: false, punctuation: false, ...options }

    let characters = ''
    let result = ''

    if (options.letters) characters += LETTERS
    if (options.digits) characters += DIGITS
    if (options.whitespace) characters += ' '
    if (options.punctuation) characters += PUNCTUATION

    for (let i = 0; i < size; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length))
    }

    return result
  }

  static timestamp(format = 'yyyyLLddHHmmss'): string {
    return DateTime.now().toFormat(format)
  }
}

export { Text }
