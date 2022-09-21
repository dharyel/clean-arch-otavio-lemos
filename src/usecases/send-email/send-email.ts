import { User, UserData } from '@/entities'
import { InvalidEmailError, InvalidNameError } from '@/entities/errors'
import { Either, left } from '@/shared'
import { UseCase } from '@/usecases/ports/use-case'
import { MailServiceError } from '../errors/mail-service-error'
import { EmailOptions, EmailService } from './ports/email-service'

export class SendEmail implements UseCase {
    constructor (private readonly emailOptions: EmailOptions, private readonly emailService: EmailService) {}

    async perform (userData: UserData): Promise<Either<InvalidNameError | InvalidEmailError | MailServiceError, EmailOptions>> {
        const userOrError: Either<InvalidNameError | InvalidEmailError, User> = User.create(userData)

        if (userOrError.isLeft()) {
            return left(userOrError.value)
        }

        const user = userOrError.value

        const greetings = `E aí, <b>${user.name}</b>. Beleza?`
        const customizedHtml = `${greetings}<br><br>${this.emailOptions.html}`
        const { host, port, username, password, from, subject, text, attachments } = this.emailOptions

        const emailInfo: EmailOptions = {
            host,
            port,
            username,
            password,
            from,
            to: user.name + '<' + user.email + '>',
            subject,
            text,
            html: customizedHtml,
            attachments
        }

        return await this.emailService.send(emailInfo)
    }
}
