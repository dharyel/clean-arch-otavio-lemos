import { HttpResponse } from '@/web-controllers'

export const ok = (data: any): HttpResponse => {
    return {
        statusCode: 200,
        body: data
    }
}

export const created = (data: any): HttpResponse => {
    return {
        statusCode: 201,
        body: data
    }
}

export const badRequest = (data: any): HttpResponse => {
    return {
        statusCode: 400,
        body: data
    }
}

export const serverError = (data: any): HttpResponse => {
    return {
        statusCode: 500,
        body: data
    }
}
