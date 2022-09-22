import { EmailOptions } from '@/usecases/send-email/ports/email-service'

const attachments = [{
    filename: 'clean-architecture.pdf',
    path: 'https://otaviolemos.github.io/clean-architecture.pdf'
}]

export function getEmailOptions (): EmailOptions {
    const from = 'Dharyel | TheWiseDev<dshfoxdev@gmail.com>'
    const to = ''
    const mailOptions: EmailOptions = {
        host: process.env.EMAIL_HOST as string,
        port: Number.parseInt(process.env.EMAIL_PORT),
        username: process.env.EMAIL_USERNAME,
        password: process.env.EMAIL_PASSWORD,
        from,
        to,
        subject: 'Mensagem de teste',
        text: 'Texto da mensagem',
        html: '<b>Texto da mensagem</b>',
        attachments
    }

    return mailOptions
}
