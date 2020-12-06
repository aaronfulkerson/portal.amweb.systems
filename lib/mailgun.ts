import mailgun from 'mailgun.js'
const mgClient = mailgun.client({ username: 'api', key: process.env.MAILGUN_SK })
export interface MailgunMessage {
  from: string
  to: string[]
  subject: string
  text: string
  html: string
}
export const send = async function (message: MailgunMessage) {
  return await mgClient.messages.create(process.env.MAILGUN_DOMAIN, message)
}
