import { HttpResponse } from '@/web-controllers'

export const created = (data: any): HttpResponse => {
    return {
        statusCode: 201,
        body: data
    }
}
