import { RegisterUserController } from '@/web-controllers'
import { RegisterUserOnMailingList } from '@/usecases'
// import { InMemoryUserRepository } from '@/usecases/register-user-on-mailing-list/repository'
import { MongodbUserRepository } from '@/external/repositories/mongodb'

export const makeRegisterUserController = (): RegisterUserController => {
    // const inMemoryUserRepository = new InMemoryUserRepository([])
    // const registerUserOnMailingListUseCase = new RegisterUserOnMailingList(inMemoryUserRepository)
    const mongodbUserRepository = new MongodbUserRepository()
    const registerUserOnMailingListUseCase = new RegisterUserOnMailingList(mongodbUserRepository)
    const registerUserController = new RegisterUserController(registerUserOnMailingListUseCase)

    return registerUserController
}
