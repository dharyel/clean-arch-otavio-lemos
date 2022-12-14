import { UserData } from '@/entities'
import { InMemoryUserRepository } from '@/usecases/register-user-on-mailing-list/repository'

describe('In memory user repository', () => {
    it('should return null if user is not found', async () => {
        const users: UserData[] = []
        const sut = new InMemoryUserRepository(users)
        const user = await sut.findUserByEmail('any@email.com')
        expect(user).toBeNull()
    })

    it('should return user if it is found in the repository', async () => {
        const users: UserData[] = []
        const name = 'any_name'
        const email = 'any@email.com'
        const sut = new InMemoryUserRepository(users)
        await sut.add({ name, email })

        const user = await sut.findUserByEmail('any@email.com')

        expect(user.name).toBe('any_name')
    })

    it('should return all users in the repository', async () => {
        const users: UserData[] = [{ name: 'any_name', email: 'any_email' }, { name: 'second_name', email: 'second@email.com' }]
        const sut = new InMemoryUserRepository(users)
        const returnedUsers = await sut.findAllUsers()
        expect(returnedUsers.length).toBe(2)
    })
})
