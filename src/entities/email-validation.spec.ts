import { Email } from './email'

describe('Email validation', () => {
    it('should not accept null strings', () => {
        const email = null

        expect(Email.validate(email)).toBeFalsy()
    })

    it('should not accept empty string', () => {
        const email = ''

        expect(Email.validate(email)).toBeFalsy()
    })

    it('should not accept local-part larger than 64 chars', () => {
        const email = 'l'.repeat(65) + '@mail.com'

        expect(Email.validate(email)).toBeFalsy()
    })

    it('should accept valid email', () => {
        const email = 'any@mail.com'

        expect(Email.validate(email)).toBeTruthy()
    })
})