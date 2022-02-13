import { Exception } from '@vyrnn/zeraph-exceptions'

export class InternalServerErrorException extends Exception {
  constructor(
    status: number = 500,
    message: string = 'internal server error'
  ) { super(status, message) }
}
