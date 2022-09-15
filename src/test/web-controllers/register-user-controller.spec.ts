import { UserData } from '@/entities'
import { RegisterUserOnMailingList, UserRepository } from '@/usecases'
import { HttpRequest, HttpResponse } from '@/web-controllers'
import { InMemoryUserRepository } from '@/test/usecases/register-user-on-mailing-list/repository'
import { RegisterUserController } from '@/web-controllers/register-user-controller'

describe('Register user web controller', () => {
    it('should return status code 201 when request contains valid user data', async () => {
        const request: HttpRequest = {
            body: {
                email: 'any@mail.com',
                name: 'Any Name'
            }
        }

        const users: UserData[] = []
        const repo: UserRepository = new InMemoryUserRepository(users)
        const usecase: RegisterUserOnMailingList = new RegisterUserOnMailingList(repo)
        const controller: RegisterUserController = new RegisterUserController(usecase)

        const response: HttpResponse = await controller.handle(request)

        expect(response.statusCode).toEqual(201)
        expect(response.body).toEqual(request.body)
    })
})
