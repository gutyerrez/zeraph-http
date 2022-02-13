import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'

import { Route } from '../Router/Route'

import { Request, Response } from '../Protocols'

import { InternalServerErrorException } from '../Exceptions'

export class Router {
  private static ROUTES: Route[] = []

  public static prepare = async (fastifyInstance: FastifyInstance) => {
    for await (const {
      url,
      method,
      handlers,
      callback,
    } of Router.ROUTES) {
      fastifyInstance.route({
        url,
        method,
        preHandler: async (fastifyRequest: FastifyRequest, fastifyResponse: FastifyReply) => {
          for await (const { handle } of handlers) {
            await handle(
              fastifyRequest,
              fastifyResponse,
            )
          }
        },
        handler: async (fastifyRequest: FastifyRequest, fastifyResponse: FastifyReply) => {
          const request = new Request(fastifyRequest)
          const response = new Response(fastifyResponse)

          return callback(request, response)
        },
      })
    }
  }

  public static get = (
    path: string,
    callback: (
      request: Request,
      response: Response
    ) => Promise<void>,
  ): Route => Router.registerRoute(path, 'GET', callback)

  public static post = (
    path: string,
    callback: (
      request: Request,
      response: Response
    ) => Promise<void>,
  ): Route => Router.registerRoute(path, 'POST', callback)

  public static put = (
    path: string,
    callback: (
      request: Request,
      response: Response
    ) => Promise<void>,
  ): Route => Router.registerRoute(path, 'PUT', callback)

  public static delete = (
    path: string,
    callback: (
      request: Request,
      response: Response
    ) => Promise<void>,
  ): Route => Router.registerRoute(path, 'DELETE', callback)

  private static registerRoute = (
    path: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    callback: (request: Request, response: Response) => Promise<void>,
  ): Route => {
    const route = Router.ROUTES[
      Router.ROUTES.push(
        new Route(
          path,
          method,
          callback,
        ),
      ) - 1
    ]

    if (!route) {
      throw new InternalServerErrorException()
    }

    return route
  }
}
