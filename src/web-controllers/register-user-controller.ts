import { UserData } from '@/entities'
import { RegisterUserOnMailingList } from '@/usecases'
import { HttpRequest, HttpResponse } from '@/web-controllers'
import { created } from '@/web-controllers/util'

export class RegisterUserController {
    constructor (private readonly usecase: RegisterUserOnMailingList) {}

    public async handle (request: HttpRequest): Promise<HttpResponse> {
        const userData: UserData = request.body
        const response = await this.usecase.registerUserOnMailingList(userData)

        if (response.isRight()) {
            return created(response.value)
        }
    }
}
