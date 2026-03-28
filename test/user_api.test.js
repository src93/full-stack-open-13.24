const { test, after, before, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const User = require('../models/user')
const Blog = require('../models/blog')
const helper = require('./helper.test')

describe('User API', () => {
  before(async () => {
    await User.deleteMany({})
    await Blog.deleteMany({})
  })

  test('Add user valid', async () => {
    const response = await api
      .post('/api/user')
      .send(helper.initUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const { body } = response
    assert.deepStrictEqual({
      name: helper.initUser.name,
      username: helper.initUser.username
    }, {
      name: body.name,
      username: body.username
    })
  })

  test('Add user invalid', async () => {
    const newUser = {
      name: 'Austin',
      username: 'austin',
      password: 'pa'
    }
    const anotherInvalidUser = {
      name: 'Austin',
      username: 'au',
      password: 'password'
    }
    await api
      .post('/api/user')
      .send(newUser)
      .expect(400)
    await api
      .post('/api/user')
      .send(anotherInvalidUser)
      .expect(400)
  })

  test('User create a blog', async() => {
    const blog = helper.initBlogs[0]
    const { body: bodyUserLoged } = await helper.loginUser(api)
    const token = bodyUserLoged.token
    const response = await api
      .post('/api/blog')
      .set('Authorization', `Bearer ${token}`)
      .send(blog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    const users = await api
      .get('/api/user')
      .expect(200)
      .expect('Content-Type', /application\/json/)
    const user = users.body[0]
    assert.ok(user.blogs)
    assert.ok(user.blogs.length > 0)
    assert.strictEqual(user.blogs[0].title, response.body.title)
    assert.strictEqual(user.blogs[0].author, response.body.author)
  })

  after(async () => {
    mongoose.connection.close()
  })
})
