import { IMiddleware } from '../../Middleware'

import { Request, Response } from '../../Protocols'

export class Route {
  public url: string
  public method: 'GET' | 'POST' | 'PUT' | 'DELETE'

  public handlers: IMiddleware[] = []

  public callback: (request: Request, response: Response) => void

  constructor(
    url: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    callback: (request: Request, response: Response) => void,
    ...middlewares: { new(): IMiddleware }[]
  ) {
    this.url = url
    this.method = method
    this.callback = callback

    for (const Middleware of middlewares) {
      this.handlers.push(
        new Middleware(),
      )
    }
  }

  public middleware = (
    ...middlewares: { new(): IMiddleware }[]
  ) => {
    for (const Middleware of middlewares) {
      this.handlers.push(
        new Middleware(),
      )
    }
  }
}
