const router = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')

router.get('/', async (request, response, next) => {
  try {
    const user = await User.find({}).populate('blogs')
    return response.json(user)
  } catch (error) {
    next(error)
  }
})

router.post('/', async (request, response, next) => {
  const { body } = request

  if (!body) {
    return response.status(400).json({
      error: 'content missing'
    })
  }

  const { name, username, password } = body
  const ensurePasswordIsNotValid = !password || password.length < 3
  if (ensurePasswordIsNotValid) {
    return response.status(400).json({
      error: 'password must be at least 3 characters long'
    })
  }
  const saltRounds = 10
  const passwordHash = bcrypt.hashSync(password, saltRounds)
  const user = new User({
    name,
    username,
    passwordHash
  })
  try {
    const savedUser = await user.save()
    response.status(201).json(savedUser)
  } catch (error) {
    next(error)
  }
})

module.exports = router