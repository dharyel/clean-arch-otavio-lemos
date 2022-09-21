import { MongodbUserRepository } from '@/external/repositories/mongodb'
import { MongoHelper } from '@/external/repositories/mongodb/helper/mongo-helper'

describe('Mongodb user repository', () => {
    beforeAll(async () => {
        await MongoHelper.connect(process.env.MONGO_URL as string)
    })

    afterAll(async () => {
        await MongoHelper.disconnect()
    })

    beforeEach(async () => {
        await MongoHelper.clearCollection('users')
    })

    it('when user is added, it should exist', async () => {
        const userRepository = new MongodbUserRepository()
        const user = {
            name: 'Any Name',
            email: 'any@mail.com'
        }
        await userRepository.add(user)

        expect(await userRepository.exists(user)).toBeTruthy()
    })

    it('should return all added users when call findAllUsers method', async () => {
        const userRepository = new MongodbUserRepository()
        await userRepository.add({
            name: 'any name',
            email: 'any@mail.com'
        })

        await userRepository.add({
            name: 'second name',
            email: 'second@mail.com'
        })

        const users = await userRepository.findAllUsers()

        expect(users[0].name).toBe('any name')
        expect(users[1].name).toBe('second name')
    })
})
