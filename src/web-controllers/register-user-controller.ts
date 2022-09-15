import { UserData } from '@/entities'
import { RegisterUserOnMailingList } from '@/usecases'
import { HttpRequest, HttpResponse } from '@/web-controllers'
import { badRequest, created } from '@/web-controllers/util'
import { MissingParamError } from '@/web-controllers/errors/missing-param-error'

export class RegisterUserController {
    constructor (private readonly usecase: RegisterUserOnMailingList) {}

    public async handle (request: HttpRequest): Promise<HttpResponse> {
        if (!(request.body.name) || !(request.body.email)) {
            let missingParam = !(request.body.name) ? 'name ' : ''
            missingParam += !(request.body.email) ? 'email' : ''

            console.log('missingParam', { missingParam, request })
            return badRequest(new MissingParamError(missingParam.trim()))
        }

        const userData: UserData = request.body
        const response = await this.usecase.registerUserOnMailingList(userData)

        if (response.isLeft()) {
            return badRequest(response.value)
        }

        if (response.isRight()) {
            return created(response.value)
        }
    }
}
