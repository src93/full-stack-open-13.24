const router = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Session = require('../models/sessions')
const ActiveUser = require('../models/active-users')

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

    const userActive = await ActiveUser.findOne({ where: { username } })
    if (!userActive || !userActive.active) {
      return response.status(403).json({
        error: 'user is not active'
      })
    }

    const userForToken = {
      username: user.username,
      id: user.id
    }
    const token = jwt.sign(userForToken, process.env.SECRET)
    await Session.create({
      token,
      user_id: userActive.id,
    })
    response.status(200).json({
      token,
      username: user.username,
      name: user.name
    })
  } catch (error) {
    console.error('Login error:', error)
    next(error)
  }
})

router.delete('/', async (request, response, next) => {
  try {
    const tokenBD = await Session.findOne({ where: { token: request.token } })
    if (!tokenBD) {
      return response.status(401).json({
        error: 'User session not found. Please log in again.'
      })
    }
    await Session.destroy({ where: { user_id: tokenBD.user_id } })
    return response.status(204).end()
  } catch (error) {
    console.error('Logout error:', error)
    next(error)
  }
})

module.exports = router