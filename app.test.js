process.env.NODE_ENV = 'test'
const chai = require('chai')
const chaiHttp = require('chai-http')
const should = chai.should()
const { MongoMemoryServer } = require('mongodb-memory-server')
const { app, mongoose } = require('./app')
chai.use(chaiHttp)
const agent = chai.request.agent(app)

const mongod = new MongoMemoryServer()
const connect = async () => {
  const uri = await mongod.getUri()

  const mongooseOpts = {
    useNewUrlParser: true,
    autoReconnect: true,
    reconnectTries: Number.MAX_VALUE,
    reconnectInterval: 1000,
  }

  await mongoose.connect(uri, mongooseOpts)
}

const closeDatabase = async () => {
  await mongoose.connection.dropDatabase()
  await mongoose.connection.close()
  return await mongod.stop()
}

const clearCloseDatabase = async (done) => {
  const collections = mongoose.connection.collections

  for (const key in collections) {
    const collection = collections[key]
    await collection.deleteMany()
  }
  await mongoose.connection.dropDatabase()
  return await mongoose.connection.close()
}

before(async () => {
  await connect()
})

describe('POST /auth/signup', () => {
  it('it should register user', (done) => {
    agent
      .post('/auth/signup')
      .send({ email: 'deepmal933@gmail.com', pass: '5673dejoE@' })
      .end((err, res) => {
        res.should.have.status(200)
        done()
      })
  })
})

describe('POST /auth/signin', () => {
  it('it should give login error', (done) => {
    agent
      .post('/auth/signin')
      .send()
      .end((err, res) => {
        res.should.have.status(401)
        done()
      })
  })

  it('it should give login error', (done) => {
    agent
      .post('/auth/signin')
      .send({ email: 'deepmal933@gmail.com', pass: '5673dejoE' })
      .end((err, res) => {
        res.should.have.status(401)
        done()
      })
  })

  it('it should give login success', (done) => {
    agent
      .post('/auth/signin')
      .send({ email: 'deepmal933@gmail.com', pass: '5673dejoE@' })
      .end((err, res) => {
        res.should.have.status(200)
        done()
      })
  })

  it('it should give email exit error', (done) => {
    agent
      .post('/auth/signin')
      .send({ email: 'deepmal933@gmail.com', pass: '56smkas' })
      .end((err, res) => {
        res.should.have.status(401)
        done()
      })
  })
})

describe('GET /user', () => {
  it('it should get user', (done) => {
    agent.get('/user').end((err, res) => {
      res.should.have.status(200)
      done()
    })
  })

  it('it should get unauthorize error', (done) => {
    chai
      .request(app)
      .get('/user')
      .end((err, res) => {
        res.should.have.status(401)
        done()
      })
  })
})

describe('GET /auth/signout', () => {
  it('it should logout the user', (done) => {
    agent.get('/auth/signout').end((err, res) => {
      res.should.have.status(201)
      done()
    })
  })
})

after(async () => {
  await clearCloseDatabase()
})
