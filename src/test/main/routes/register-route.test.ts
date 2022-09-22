import request from 'supertest'
import app from '@/main/config/app'
import { MongoHelper } from '@/external/repositories/mongodb/helper/mongo-helper'

describe('Register route ', () => {
    beforeAll(async () => {
        await MongoHelper.connect(process.env.MONGO_URL as string)
    })

    afterAll(async () => {
        await MongoHelper.disconnect()
    })

    beforeEach(async () => {
        await MongoHelper.clearCollection('users')
    })

    it('should return an account on success', async () => {
        app.post('/test_cors', (req, res) => {
            res.send()
        })

        await request(app)
            .post('/api/register')
            .send({
                name: 'Any Name',
                email: 'any@mail.com'
            })
            .expect(200)
    })
})
