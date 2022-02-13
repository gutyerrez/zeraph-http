import { FastifyReply, FastifyRequest } from 'fastify'

export class Request {
  private request!: FastifyRequest

  constructor(
    request: FastifyRequest,
  ) { this.request = request }

  public query = <T>() => this.request.query as T

  public params = <T>(): T => {
    const requestParams = this.request.params as any

    const params = {} as any

    for (const key in requestParams) {
      if (requestParams.hasOwnProperty(key)) {
        params[key.replace(
          /_\w/g,
          (word) => word[1].toUpperCase(),
        )] = requestParams[key]
      }
    }

    return params as T
  }

  public body = <T>(): T => {
    const requestBody = this.request.body as any

    const params = {} as any

    for (const key in requestBody) {
      if (requestBody.hasOwnProperty(key)) {
        params[key.replace(
          /_\w/g,
          (word) => word[1].toUpperCase(),
        )] = requestBody[key]
      }
    }

    return params as T
  }
}

export class Response {
  private response!: FastifyReply

  constructor(
    fastifyResponse: FastifyReply,
  ) { this.response = fastifyResponse }

  public status = (status: number) => {
    this.response.status(status)

    return this
  }

  public json = (json?: object) => {
    this.response.header('Content-Type', 'application/json')

    this.response.send(json)
  }
}
