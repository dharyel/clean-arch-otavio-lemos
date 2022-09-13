import { InvalidEmailError } from '@/entities/errors/InvalidEmailError'
import { InvalidNameError } from '@/entities/errors/InvalidNameError'
import { User } from '@/entities/user'
import { UserData } from '@/entities/user-data'
import { Either, left, right } from '@/shared/either'
import { UserRepository } from './ports/user-repository'

export class RegisterUserOnMailingList {
    constructor (private readonly userRepo: UserRepository) {}

    public async registerUserOnMailingList (request: UserData): Promise<Either<InvalidNameError | InvalidEmailError, UserData>> {
        const userOrError: Either<InvalidNameError | InvalidEmailError, User> = User.create(request)

        if (userOrError.isLeft()) {
            return left(userOrError.value)
        }

        if (!(await this.userRepo.exists(request))) {
            await this.userRepo.add(request)
        }

        return right(request)
    }
}
