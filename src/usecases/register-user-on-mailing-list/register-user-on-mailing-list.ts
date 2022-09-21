import { User, UserData } from '@/entities'
import { UserRepository } from '@/usecases/register-user-on-mailing-list/ports'
import { UseCase } from '@/usecases/ports/use-case'

export class RegisterUserOnMailingList implements UseCase {
    constructor (private readonly userRepo: UserRepository) {}

    public async perform (request: User): Promise<UserData> {
        const userData: UserData = { name: request.name.value, email: request.email.value }

        if (!(await this.userRepo.exists(userData))) {
            await this.userRepo.add(userData)
        }

        return userData
    }
}
