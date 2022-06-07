import { DateTime } from 'luxon'

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
const DIGITS = '0123456789'
const PUNCTUATION = `!"#$%&'()*+,-./:;<=>?@[\\]^_\`{|}~`

class Text {
  static daySince(
    days: number,
    options: { format?: string; timezone?: string } = { format: 'LL/dd/yyyy', timezone: 'local' }
  ): string {
    options = { format: 'LL/dd/yyyy', timezone: 'local', ...options }

    if (days >= 0) {
      return DateTime.now().setZone(options.timezone).plus({ days }).toFormat(options.format)
    } else {
      return DateTime.now().setZone(options.timezone).minus({ days }).toFormat(options.format)
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
