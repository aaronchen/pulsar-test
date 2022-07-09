type MessageQueuedEmail = {
  QueueEmailID: number
  From: string
  FromName: string
  To: string
  ToName: string
  Cc: string
  Bcc: string
  Subject: string
  Body: string
  Created: Date
  Sent: Date
}

export { MessageQueuedEmail }
