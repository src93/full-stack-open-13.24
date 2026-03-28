const { test, after, before, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const User = require('../models/user')
const Blog = require('../models/blog')
const helper = require('./helper.test')

describe('Login API', () => {
  before(async () => {
    await User.deleteMany({})
    await Blog.deleteMany({})
    await helper.insertUser()
  })

  test('Login with valid credentials', async () => {
    const { body } = await helper.loginUser(api)
    assert.ok(body.token)
    assert.strictEqual(body.username, helper.initUser.username)
    assert.strictEqual(body.name, helper.initUser.name)
  })

  test('Login with invalid credentials', async () => {
    const invalidUser = {
      username: 'invalidUser',
      password: 'invalidPassword'
    }

    const response = await api
      .post('/api/login')
      .send(invalidUser)
      .expect(401)
      .expect('Content-Type', /application\/json/)

    const { body } = response
    assert.strictEqual(body.error, 'invalid username or password')
  })

  after(async () => {
    mongoose.connection.close()
  })
})