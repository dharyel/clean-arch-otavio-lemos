import { UserData } from '@/entities'
import { HttpRequest, HttpResponse } from '@/web-controllers'
import { badRequest, created, serverError } from '@/web-controllers/util'
import { MissingParamError } from '@/web-controllers/errors/missing-param-error'
import { UseCase } from '@/usecases/ports/use-case'

export class RegisterUserController {
    constructor (private readonly usecase: UseCase) {}

    public async handle (request: HttpRequest): Promise<HttpResponse> {
        try {
            if (!(request.body.name) || !(request.body.email)) {
                let missingParam = !(request.body.name) ? 'name ' : ''
                missingParam += !(request.body.email) ? 'email' : ''

                console.log('missingParam', { missingParam, request })
                return badRequest(new MissingParamError(missingParam.trim()))
            }

            const userData: UserData = request.body
            const response = await this.usecase.perform(userData)

            if (response.isLeft()) {
                return badRequest(response.value)
            }

            return created(response.value)
        } catch (error) {
            return serverError(error)
        }
    }
}
