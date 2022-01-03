const fastify = require('fastify')({ logger: true })
import { Prisma, PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()


fastify.route({
  method: 'GET',
  url: '/',
  // this function is executed for every request before the handler is executed
  // preHandler: async (request, reply) => {
  //   // E.g. check authentication
  // },
  handler: async (request:any, reply:any) => {
    reply
    .code(200)
    .header('Content-Type', 'application/json; charset=utf-8')
    .send({ hello: 'worlds' })
  }
})
fastify.route({
  method: 'POST',
  url: '/signup',
  // this function is executed for every request before the handler is executed
  preHandler: async (request:any, reply:any) => {
    // E.g. check authentication
    console.log(request.body)
  },
  handler: async (request:any, reply:any) => {
    const { name, email, notes } = request.body

  const noteData = notes?.map((note: Prisma.NoteCreateInput) => {
    return { title: note?.title, content: note?.content }
  })

  const result = await prisma.user.create({
    data: {
      name,
      email,
      notes: {
        create: noteData,
      },
    },
  })
  reply.send(result)
  }
})

fastify.route({
  method: 'GET',
  url: '/notes',
  // this function is executed for every request before the handler is executed
  // preHandler: async (request, reply) => {
  //   // E.g. check authentication
  // },
  handler: async (request:any, reply:any) => {
    const post = await prisma.note.findMany({})
    reply.send(post)
  }
})
const start = async () => {
  try {
    await fastify.listen(3000)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
start()