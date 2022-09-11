import { Either, left } from '@/shared/either'
import { Email } from './email'
import { InvalidEmailError } from './errors/InvalidEmailError'
import { InvalidNameError } from './errors/InvalidNameError'
import { Name } from './name'
import { UserData } from './user-data'

export class User {
    static create (userData: UserData): Either<InvalidNameError | InvalidEmailError, User> {
        const nameOrError = Name.create(userData.name)

        if (nameOrError.isLeft()) {
            return left(new InvalidNameError())
        }

        const emailOrError = Email.create(userData.email)

        if (emailOrError.isLeft()) {
            return left(new InvalidEmailError())
        }
    }
}
