import { User, UserData } from '@/entities'
import { Either, right } from '@/shared'
import { RegisterUserOnMailingList, UserRepository } from '@/usecases'
import { MailServiceError } from '@/usecases/errors'
import { RegisterAndSendEmail } from '@/usecases/register-and-send-email/register-and-send-email'
import { InMemoryUserRepository } from '@/usecases/register-user-on-mailing-list/repository'
import { EmailOptions, EmailService } from '@/usecases/send-email/ports/email-service'
import { SendEmail } from '../send-email'

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

class MailServiceMock implements EmailService {
    sendCount = 0

    async send (mailOptions: EmailOptions): Promise<Either<MailServiceError, EmailOptions>> {
        this.sendCount++
        return right(mailOptions)
    }
}

describe('Register and send email to user', () => {
    it('should add user with complete data to mailing list', async () => {
        const users: UserData[] = []

        const repo: UserRepository = new InMemoryUserRepository(users)
        const registerUseCase: RegisterUserOnMailingList = new RegisterUserOnMailingList(repo)
        const mailServiceMock = new MailServiceMock()
        const sendEmailUseCase: SendEmail = new SendEmail(mailOptions, mailServiceMock)
        const registerAndSendEmailUseCase: RegisterAndSendEmail = new RegisterAndSendEmail(registerUseCase, sendEmailUseCase)
        const name = 'any_name'
        const email = 'any@email.com'
        const response: User = (await registerAndSendEmailUseCase.perform({ name, email })).value as User
        const user = await repo.findUserByEmail('any@email.com')

        expect(user.name).toBe('any_name')
        expect(response.name.value).toBe('any_name')
        expect(mailServiceMock.sendCount).toBe(1)
        expect(response.name.value).toBe('any_name')
    })
})
