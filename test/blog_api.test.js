const { test, after, before, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const helper = require('./helper.test')

const Blog = require('../models/blog')
const User = require('../models/user')

let token = null

describe('Blog API', () => {
  before(async () => {
    await User.deleteMany({})
    await Blog.deleteMany({})
    await helper.initialBlog()
    await helper.insertUser()
    const { body: bodyUserLoged } = await helper.loginUser(api)
    token = bodyUserLoged.token
  })

  test('Blog are returned as json', async () => {
    await api
      .get('/api/blog')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('There are three post', async () => {
    const response = await api.get('/api/blog')

    assert.strictEqual(response.body.length, helper.initBlogs.length)
  })

  test('the post has the param id and not _id', async () => {
    const response = await api.get('/api/blog')
    assert.ok(response.body[0].id)
    assert.ok(!response.body[0]._id)
  })

  test('a valid post can be added', async () => {
    const newBlog = {
      title: 'new blog',
      author: 'Austin',
      url: 'http://www.austin.com',
      likes: 0
    }
    const response = await api
      .post('/api/blog')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const { body } = response
    assert.deepStrictEqual(newBlog, {
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes
    })

    const blogAfterPost = await helper.postsInDB()
    assert.strictEqual(blogAfterPost.length, helper.initBlogs.length + 1)
    assert.ok(blogAfterPost.some(blog => blog.id === body.id))
  })

  test('if likes is missing it will default to 0', async () => {
    const newBlog = {
      title: 'new blog',
      author: 'Austin',
      url: 'http://www.austin.com',
    }
    const response = await api
      .post('/api/blog')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    const { body } = response

    assert.strictEqual(body.likes, 0)
  })

  test('if title or url is missing it will return 400', async () => {
    const blogWithoutTitle = {
      author: 'Austin',
      url: 'http://www.austin.com',
    }
    const blogWithoutUrl = {
      title: 'new blog',
      author: 'Austin',
    }
    await api
      .post('/api/blog')
      .set('Authorization', `Bearer ${token}`)
      .send(blogWithoutTitle)
      .expect(400)

    await api
      .post('/api/blog')
      .set('Authorization', `Bearer ${token}`)
      .send(blogWithoutUrl)
      .expect(400)
  })

  test('delete a post without token', async () => {
    const blog = await Blog.findOne({ author: 'Austin' })
    const { id } = blog
    await api
      .delete(`/api/blog/${id}`)
      .expect(401)
  })

  test('delete a post', async () => {
    const blog = await Blog.findOne({ author: 'Austin' })
    const { id } = blog
    await api
      .delete(`/api/blog/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204)
  })

  test('update a post', async () => {
    const blog = await Blog.find({})
    const { id } = blog[0]
    const newBlog = {
      title: 'new blog',
      author: 'oher author'
    }
    const response = await api
      .put(`/api/blog/${id}`)
      .send(newBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    const { body } = response

    assert.strictEqual(body.title, newBlog.title)
    assert.strictEqual(body.author, newBlog.author)
  })

  test('a blog can be added by a user', async () => {
    const blogs = await api
      .get('/api/blog')
      .expect(200)
      .expect('Content-Type', /application\/json/)
    const { body } = blogs
    const blogSaved = body.find(blog => blog.author === 'Austin')
    assert.ok(blogSaved)
    assert.strictEqual(blogSaved.user.username, helper.initUser.username)
  })

  after(async () => {
    await mongoose.connection.close()
  })
})