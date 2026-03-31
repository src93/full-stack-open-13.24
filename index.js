const app = require('./app')
const config = require('./utils/config')
const { sequelize, runMigrations } = require('./utils/sequelize')

const startServer = async () => {
  try {
    await sequelize.authenticate()
    await runMigrations()
    // await downVersion()
    console.log('✅ Database connected successfully')

    app.listen(config.PORT, () => {
      console.log(`🚀 Server running on port ${config.PORT}`)
    })
  } catch (error) {
    console.error('❌ Unable to connect to database:', error.message)
    process.exit(1)
  }
}

startServer()