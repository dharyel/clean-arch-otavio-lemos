import { UserData } from '@/entities/'
import { UserRepository } from '@/usecases/register-user-on-mailing-list/ports/'
import { RegisterUserOnMailingList } from '@/usecases/register-user-on-mailing-list/'
import { InMemoryUserRepository } from '@/usecases/register-user-on-mailing-list/repository'

describe('Register user on mailing list use case', () => {
    it('should add user with complete data to mailing list', async () => {
        const users: UserData[] = []

        const repo: UserRepository = new InMemoryUserRepository(users)
        const usecase: RegisterUserOnMailingList = new RegisterUserOnMailingList(repo)
        const name = 'any_name'
        const email = 'any@email.com'
        const response = await usecase.perform({ name, email })
        const user = await repo.findUserByEmail('any@email.com')

        expect(user.name).toBe('any_name')
        expect(response.value.name).toBe('any_name')
    })
})
