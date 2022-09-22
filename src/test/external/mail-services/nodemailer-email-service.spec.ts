import { NodemailerEmailService } from '@/external/mail-services'
import { MailServiceError } from '@/usecases/errors'
import { EmailOptions } from '@/usecases/send-email/ports/email-service'

const attachmentFilePath = '../resources/text.txt'
const fromName = 'From Name'
const fromEmail = 'from@mail.com'
const toName = 'To Name'
const toEmail = 'to@mail.com'
const subject = 'Test e-mail subject'
const emailBody = 'Hello world attachmen test'
const emailBodyHtml = '<b>Hello world!</b>'
const attachments = [{
    filename: attachmentFilePath,
    contentType: 'text/plain'
}]

const mailOptions: EmailOptions = {
    host: 'test',
    port: 867,
    username: 'test',
    password: 'test',
    from: `${fromName} ${fromEmail}`,
    to: `${toName}<${toEmail}>`,
    subject,
    text: emailBody,
    html: emailBodyHtml,
    attachments
}

jest.mock('nodemailer')
const nodemailer = require('nodemailer')
const sendMailMock = jest.fn().mockReturnValueOnce('ok')
nodemailer.createTransport.mockReturnValueOnce({
    sendMail: sendMailMock
})

describe('Nodemailer mail service adapter', () => {
    beforeEach(() => {
        sendMailMock.mockClear()
        nodemailer.createTransport.mockClear()
    })

    it('should return ok if email is sent', async () => {
        const nodemailer = new NodemailerEmailService()
        const result = await nodemailer.send(mailOptions)

        expect(result.value).toEqual(mailOptions)
    })

    it('should return error if email is not sent', async () => {
        const nodemailer = new NodemailerEmailService()

        sendMailMock.mockImplementationOnce(() => {
            throw new Error()
        })

        const result = await nodemailer.send(mailOptions)

        expect(result.value).toBeInstanceOf(MailServiceError)
    })
})
