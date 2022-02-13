import { FastifyRequest, FastifyReply } from 'fastify'

export interface IMiddleware {
  handle: (
    request: FastifyRequest,
    response: FastifyReply,
  ) => Promise<void>
}
