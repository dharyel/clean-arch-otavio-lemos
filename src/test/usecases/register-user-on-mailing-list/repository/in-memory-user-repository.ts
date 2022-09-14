import { UserRepository } from '../../../../usecases/register-user-on-mailing-list/ports/user-repository'
import { UserData } from '../../../../entities/user-data'

export class InMemoryUserRepository implements UserRepository {
    constructor (private readonly repository: UserData[]) {
        console.log(repository)
    }

    async add (user: UserData): Promise<void> {
        const exists = await this.exists(user)
        if (!exists) {
            this.repository.push(user)
        }
    }

    async findUserByEmail (email: string): Promise<UserData> {
        const user = await this.repository.find(user => user.email === email)

        return user || null
    }

    async findAllUsers (): Promise<UserData[]> {
        return await this.repository
    }

    async exists (user: UserData): Promise<boolean> {
        if (await this.findUserByEmail(user.email) === null) {
            return false
        }
        return true
    }
}