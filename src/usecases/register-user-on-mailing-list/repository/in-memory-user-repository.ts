import { UserRepository } from '../ports/user-repository'
import { UserData } from '../user-data'

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
        const users = await this.repository.filter(user => {
            return user.email === email
        })

        if (users.length > 0) {
            return users[0]
        } else {
            return null
        }
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
