const { Sequelize } = require('sequelize')
const { Umzug, SequelizeStorage } = require('umzug')
const dataBaseUrl = process.env.DATABASE_URL

let sequelize = new Sequelize(dataBaseUrl, {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
})

const runMigrations = async () => {
  const migrator = new Umzug({
    migrations: {
      glob: 'migrations/*.js',
    },
    storage: new SequelizeStorage({ sequelize, tableName: 'migrations' }),
    context: sequelize.getQueryInterface(),
    logger: console,
  })

  const migrations = await migrator.up()
  console.log('Migrations up to date', {
    files: migrations.map((mig) => mig.name),
  })
}

const downVersion = async () => {
  const migrator = new Umzug({
    migrations: {
      glob: 'migrations/*.js',
    },
    storage: new SequelizeStorage({ sequelize, tableName: 'migrations' }),
    context: sequelize.getQueryInterface(),
    logger: console,
  })

  const migrations = await migrator.down()
  console.log('Migrations down to date', {
    files: migrations.map((mig) => mig.name),
  })
}

module.exports = {
  sequelize,
  runMigrations,
  downVersion,
}