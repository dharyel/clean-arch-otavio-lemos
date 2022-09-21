import { UserData } from '@/entities'
import { Either } from '@/shared'
import { UseCase } from '@/usecases/ports/use-case'
import { MailServiceError } from '../errors/mail-service-error'
import { EmailOptions, EmailService } from './ports/email-service'

export class SendEmail implements UseCase {
    constructor (private readonly emailOptions: EmailOptions, private readonly emailService: EmailService) {}

    async perform (userData: UserData): Promise<Either<MailServiceError, EmailOptions>> {
        const greetings = `E aí, <b>${userData.name}</b>. Beleza?`
        const customizedHtml = `${greetings}<br><br>${this.emailOptions.html}`
        const { host, port, username, password, from, subject, text, attachments } = this.emailOptions

        const emailInfo: EmailOptions = {
            host,
            port,
            username,
            password,
            from,
            to: userData.name + '<' + userData.email + '>',
            subject,
            text,
            html: customizedHtml,
            attachments
        }

        return await this.emailService.send(emailInfo)
    }
}
