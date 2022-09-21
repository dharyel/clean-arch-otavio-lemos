import { RegisterUserOnMailingList } from '@/usecases/register-user-on-mailing-list'
import { SendEmail } from '@/usecases/send-email/send-email'
import { UseCase } from '@/usecases/ports/use-case'
import { User, UserData } from '@/entities'
import { Either, left, right } from '@/shared'
import { InvalidEmailError, InvalidNameError } from '@/entities/errors'
import { MailServiceError } from '@/usecases/errors'

export class RegisterAndSendEmail implements UseCase {
    private registerUserOnMailingList: RegisterUserOnMailingList
    private sendEmail: SendEmail

    constructor (registerUserOnMailingList: RegisterUserOnMailingList, sendEmail: SendEmail) {
        this.registerUserOnMailingList = registerUserOnMailingList
        this.sendEmail = sendEmail
    }

    async perform (request: UserData): Promise<Either<InvalidNameError | InvalidEmailError | MailServiceError, User>> {
        const userOrError: Either<InvalidNameError | InvalidEmailError, User> = User.create(request)

        if (userOrError.isLeft()) {
            return left(userOrError.value)
        }

        const user: User = userOrError.value
        const userData: UserData = { name: user.name.value, email: user.email.value }

        await this.registerUserOnMailingList.perform(userData)
        const result = await this.sendEmail.perform(userData)

        if (result.isLeft()) {
            return left(result.value)
        }

        return right(user)
    }
}