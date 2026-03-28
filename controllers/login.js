const router = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

router.post('/', async (request, response, next) => {
  const { body } = request

  if (!body || !body.username || !body.password) {
    return response.status(400).json({
      error: 'content missing'
    })
  }
  const { username, password } = body

  try {
    const user = await User.findOne({ username })
    const isPasswordCorrect = user ? await bcrypt.compare(password, user.passwordHash) : false
    if (!isPasswordCorrect) {
      return response.status(401).json({
        error: 'invalid username or password'
      })
    }

    const userForToken = {
      username: user.username,
      id: user.id
    }
    const token = jwt.sign(userForToken, process.env.SECRET)
    response.status(200).json({
      token,
      username: user.username,
      name: user.name
    })
  } catch (error) {
    next(error)
  }
})

module.exports = router