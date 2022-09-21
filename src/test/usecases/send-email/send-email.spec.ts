import { Either, Right, right } from '@/shared'
import { MailServiceError } from '@/usecases/errors/mail-service-error'
import { EmailOptions, EmailService } from '@/usecases/send-email/ports/email-service'
import { SendEmail } from '@/usecases/send-email/send-email'

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

class MailServiceStub implements EmailService {
    async send (mailOptions: EmailOptions): Promise<Either<MailServiceError, EmailOptions>> {
        return right(mailOptions)
    }
}

describe('Send email to user', () => {
    it('should email user with valid name and email address', async () => {
        const mailServiceStub = new MailServiceStub()
        const useCase = new SendEmail(mailOptions, mailServiceStub)
        const response = await useCase.perform({
            name: toName,
            email: toEmail
        })
        expect(response).toBeInstanceOf(Right)
    })
})
