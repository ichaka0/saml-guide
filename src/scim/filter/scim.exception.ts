import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class ScimExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    
    let scimType: string | undefined = undefined;
    if (status === 409) scimType = 'uniqueness'; 

    response.status(status).json({
      schemas: ["urn:ietf:params:scim:api:messages:2.0:Error"],
      scimType,
      detail: exception.message,
      status: status.toString()
    });
  }
}