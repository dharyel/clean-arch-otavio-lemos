import { Either, left, right } from '@/shared'
import { MailServiceError } from '@/usecases/errors'
import { EmailOptions, EmailService } from '@/usecases/send-email/ports/email-service'
import * as nodemailer from 'nodemailer'

export class NodemailerEmailService implements EmailService {
    async send (options: EmailOptions): Promise<Either<MailServiceError, EmailOptions>> {
        try {
            const transporter = nodemailer.createTransport({
                host: options.host,
                port: options.port,
                auth: {
                    user: options.username,
                    pass: options.password
                }
            })

            await transporter.sendMail({
                from: options.from,
                to: options.to,
                subject: options.subject,
                text: options.text,
                html: options.html,
                attachments: options.attachments
            })

            return right(options)
        } catch (error) {
            return left(new MailServiceError())
        }
    }
}
