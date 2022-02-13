import Fastify, { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'

import { Exception } from '@vyrnn/zeraph-exceptions'

import { Router } from './Router'

import { IMiddleware } from './Middleware'

import { Request, Response } from './Protocols';

import { InternalServerErrorException } from './Exceptions/index';

export class HttpServer {
  protected instance!: FastifyInstance

  constructor() {
    this.instance = Fastify()

    this.instance.setErrorHandler((
      error: Error,
      _request: FastifyRequest,
      response: FastifyReply,
    ) => {
      response.status(error instanceof Exception ? error.status : 500).send({
        message: error.message,
      })
    })
  }

  /**
   * Register middleware's for http server
   * 
   * @param middlewares 
   */
  public registerMiddleware = (...middlewares: IMiddleware[]) => {
    for (const { handle } of middlewares) {
      this.instance.addHook(
        'onRequest',
        handle,
      )
    }
  }

  /**
   * Prepare routes and start server on @port
   * 
   * @param port 
   * @param callback 
   */
  public listen = async (
    port: number,
    callback = () => {}
  ) => {
    Router.prepare(this.instance).then(() => {
      this.instance.listen(port, (error, _) => {
        if (error) {
          console.error(error)
        } else { callback() }
      })
    })
  }
}

export { Router, InternalServerErrorException, Request, Response }
