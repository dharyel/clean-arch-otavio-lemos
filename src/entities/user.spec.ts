import { User } from './user'

describe('User domain entity', () => {
    it('should not create user with invalid e-mail address', () => {
        const invalidEmail = 'invalid_email'
        const error = User.create({ name: 'any_name', email: invalidEmail }).value as Error

        expect(error.name).toBe('InvalidEmailError')
        expect(error.message).toEqual(`Invalid email: ${invalidEmail}.`)
    })

    it('should not create user with invalid name(too few characters)', () => {
        const invalidName = 'O       '
        const error = User.create({ name: invalidName, email: 'any@mail.com' }).value as Error

        expect(error.name).toBe('InvalidNameError')
        expect(error.message).toEqual(`Invalid name: ${invalidName}.`)
    })

    // it('should not create user with invalid name(too many characters)', () => {
    //     const invalidName = 'O'.repeat(257)
    //     const error = User.create({ name: invalidName, email: 'any@mail.com' })

    //     expect(error).toEqual(left(new InvalidNameError()))
    // })

    it('should create user with valid data', () => {
        const validName = 'any_name'
        const validEmail = 'any@mail.com'
        const user: User = User.create({ name: validName, email: validEmail }).value as User

        expect(user.name.value).toEqual(validName)
        expect(user.email.value).toEqual(validEmail)
    })
})
