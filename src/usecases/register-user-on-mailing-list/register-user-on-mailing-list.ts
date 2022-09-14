import { InvalidEmailError, InvalidNameError } from '../../entities/errors'
import { User, UserData } from '../../entities'
import { Either, left, right } from '../../shared'
import { UserRepository } from './'

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
