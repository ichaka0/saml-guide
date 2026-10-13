import { Controller, Get, Request, Response} from '@nestjs/common';
import { AppService } from './app.service';
import { resolve } from 'path';
import type { Response as ExpressResponse } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

@Get()
async homepage(@Response() res: ExpressResponse) {
  res.sendFile(resolve('saml-guide/src/index.html'));
}
}
