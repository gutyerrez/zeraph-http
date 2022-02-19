import { Request, Response } from '../../../Protocols'

export abstract class AbstractAdapter {
  public abstract handle: (request: Request, response: Response) => Promise<void>
}
