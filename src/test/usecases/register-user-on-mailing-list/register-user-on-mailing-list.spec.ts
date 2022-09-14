import { UserData } from '../../../entities/user-data'
import { UserRepository } from '../../../usecases/register-user-on-mailing-list/ports/user-repository'
import { RegisterUserOnMailingList } from '../../../usecases/register-user-on-mailing-list/register-user-on-mailing-list'
import { InMemoryUserRepository } from './repository/in-memory-user-repository'

describe('Register user on mailing list use case', () => {
    it('should add user with complete data to mailing list', async () => {
        const users: UserData[] = []

        const repo: UserRepository = new InMemoryUserRepository(users)
        const usecase: RegisterUserOnMailingList = new RegisterUserOnMailingList(repo)
        const name = 'any_name'
        const email = 'any@email.com'
        const response = await usecase.registerUserOnMailingList({ name, email })
        const user = await repo.findUserByEmail('any@email.com')

        expect(user.name).toBe('any_name')
        expect(response.value.name).toBe('any_name')
    })

    it('should not add user with invalid e-mail to mailing list', async () => {
        const users: UserData[] = []

        const repo: UserRepository = new InMemoryUserRepository(users)
        const usecase: RegisterUserOnMailingList = new RegisterUserOnMailingList(repo)
        const name = 'any_name'
        const invalidEmail = 'invalid.mail'
        const response = (await usecase.registerUserOnMailingList({ name, email: invalidEmail })).value as Error
        const user = await repo.findUserByEmail('invalid.mail')

        expect(user).toBe(null)
        expect(response.name).toEqual('InvalidEmailError')
    })

    it('should not add user with invalid name to mailing list ', async () => {
        const users: UserData[] = []

        const repo: UserRepository = new InMemoryUserRepository(users)
        const usecase: RegisterUserOnMailingList = new RegisterUserOnMailingList(repo)
        const invalidName = ''
        const email = 'any@email.com'
        const response = (await usecase.registerUserOnMailingList({ name: invalidName, email })).value as Error
        const user = await repo.findUserByEmail('any@email.com')

        expect(user).toBe(null)
        expect(response.name).toEqual('InvalidNameError')
    })
})