import { UserData } from '@/entities'
import { RegisterUserOnMailingList, UserRepository } from '@/usecases'
import { HttpRequest, HttpResponse } from '@/web-controllers'
import { InMemoryUserRepository } from '@/test/usecases/register-user-on-mailing-list/repository'
import { RegisterUserController } from '@/web-controllers/register-user-controller'
import { InvalidEmailError, InvalidNameError } from '@/entities/errors'
import { MissingParamError } from '@/web-controllers/errors/missing-param-error'
import { UseCase } from '@/usecases/ports/use-case'

describe('Register user web controller', () => {
    const users: UserData[] = []
    const repo: UserRepository = new InMemoryUserRepository(users)
    const usecase: UseCase = new RegisterUserOnMailingList(repo)
    const controller: RegisterUserController = new RegisterUserController(usecase)

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
        const requestWithInvalidName: HttpRequest = {
            body: {
                email: 'any@mail.com'
            }
        }

        const response: HttpResponse = await controller.handle(requestWithInvalidName)

        expect(response.statusCode).toEqual(400)
        expect(response.body).toBeInstanceOf(MissingParamError)
        expect((response.body as Error).message).toEqual('Missing parameter from request: name.')
    })

    it('should return status code 400 when request is missing user e-mail', async () => {
        const requestWithInvalidName: HttpRequest = {
            body: {
                name: 'Any Name'
            }
        }

        const response: HttpResponse = await controller.handle(requestWithInvalidName)

        expect(response.statusCode).toEqual(400)
        expect(response.body).toBeInstanceOf(MissingParamError)
        expect((response.body as Error).message).toEqual('Missing parameter from request: email.')
    })

    it('should return status code 400 when request is missing user e-mail and name', async () => {
        const requestWithInvalidName: HttpRequest = {
            body: {

            }
        }

        const response: HttpResponse = await controller.handle(requestWithInvalidName)

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

        const controller: RegisterUserController = new RegisterUserController(errorThrowingUseCaseStub)
        const response: HttpResponse = await controller.handle(request)

        expect(response.statusCode).toEqual(500)
        expect(response.body).toBeInstanceOf(Error)
    })
})
