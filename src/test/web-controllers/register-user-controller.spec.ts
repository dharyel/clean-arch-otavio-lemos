import { UserData } from '@/entities'
import { RegisterUserOnMailingList, UserRepository } from '@/usecases'
import { HttpRequest, HttpResponse } from '@/web-controllers'
import { InMemoryUserRepository } from '@/usecases/register-user-on-mailing-list/repository'
import { RegisterAndSendEmailController } from '@/web-controllers/register-and-send-email-controller'
import { InvalidEmailError, InvalidNameError } from '@/entities/errors'
import { MissingParamError } from '@/web-controllers/errors/missing-param-error'
import { UseCase } from '@/usecases/ports/use-case'
import { EmailOptions, EmailService } from '@/usecases/send-email/ports/email-service'
import { MailServiceError } from '@/usecases/errors'
import { Either, right } from '@/shared'
import { SendEmail } from '../usecases/send-email'
import { RegisterAndSendEmail } from '@/usecases/register-and-send-email/register-and-send-email'

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

describe('Register user web controller', () => {
    class MailServiceStub implements EmailService {
        async send (mailOptions: EmailOptions): Promise<Either<MailServiceError, EmailOptions>> {
            return right(mailOptions)
        }
    }

    const users: UserData[] = []

    const repo: UserRepository = new InMemoryUserRepository(users)
    const registerUseCase: RegisterUserOnMailingList = new RegisterUserOnMailingList(repo)
    const mailServiceStub = new MailServiceStub()
    const sendEmailUseCase: SendEmail = new SendEmail(mailOptions, mailServiceStub)
    const registerAndSendEmailUseCase: RegisterAndSendEmail = new RegisterAndSendEmail(registerUseCase, sendEmailUseCase)
    const controller: RegisterAndSendEmailController = new RegisterAndSendEmailController(registerAndSendEmailUseCase)

    class ErrorThrowingUseCaseStub implements UseCase {
        async perform (request: any) : Promise<void> {
            throw new Error()
        }
    }

    const errorThrowingUseCaseStub: UseCase = new ErrorThrowingUseCaseStub()

    it('should return status code 201 when request contains valid user data', async () => {
        const request: HttpRequest = {
            body: {
                email: 'any@mail.com',
                name: 'Any Name'
            }
        }

        const response: HttpResponse = await controller.handle(request)

        expect(response.statusCode).toEqual(201)
        expect(response.body).toEqual(request.body)
    })

    it('should return status code 400 when request contains invalid name', async () => {
        const requestWithInvalidName: HttpRequest = {
            body: {
                email: 'any@mail.com',
                name: 'A'
            }
        }

        const response: HttpResponse = await controller.handle(requestWithInvalidName)

        expect(response.statusCode).toEqual(400)
        expect(response.body).toBeInstanceOf(InvalidNameError)
    })

    it('should return status code 400 when request contains invalid e-mail', async () => {
        const requestWithInvalidEmail: HttpRequest = {
            body: {
                email: 'invalid_mail.com',
                name: 'Any Name'
            }
        }

        const response: HttpResponse = await controller.handle(requestWithInvalidEmail)

        expect(response.statusCode).toEqual(400)
        expect(response.body).toBeInstanceOf(InvalidEmailError)
    })

    it('should return status code 400 when request is missing user name', async () => {
        const requestWithMissingName: HttpRequest = {
            body: {
                email: 'any@mail.com'
            }
        }

        const response: HttpResponse = await controller.handle(requestWithMissingName)

        expect(response.statusCode).toEqual(400)
        expect(response.body).toBeInstanceOf(MissingParamError)
        expect((response.body as Error).message).toEqual('Missing parameter from request: name.')
    })

    it('should return status code 400 when request is missing user e-mail', async () => {
        const requestWithMissingEmail: HttpRequest = {
            body: {
                name: 'Any Name'
            }
        }

        const response: HttpResponse = await controller.handle(requestWithMissingEmail)

        expect(response.statusCode).toEqual(400)
        expect(response.body).toBeInstanceOf(MissingParamError)
        expect((response.body as Error).message).toEqual('Missing parameter from request: email.')
    })

    it('should return status code 400 when request is missing user e-mail and name', async () => {
        const requestWithMissingNameAndEmail: HttpRequest = {
            body: {

            }
        }

        const response: HttpResponse = await controller.handle(requestWithMissingNameAndEmail)

        expect(response.statusCode).toEqual(400)
        expect(response.body).toBeInstanceOf(MissingParamError)
        expect((response.body as Error).message).toEqual('Missing parameter from request: name email.')
    })

    it('should return status code 500 when server raises', async () => {
        const request: HttpRequest = {
            body: {
                email: 'any@mail.com',
                name: 'Any Name'
            }
        }

        const controller: RegisterAndSendEmailController = new RegisterAndSendEmailController(errorThrowingUseCaseStub)
        const response: HttpResponse = await controller.handle(request)

        expect(response.statusCode).toEqual(500)
        expect(response.body).toBeInstanceOf(Error)
    })
})
