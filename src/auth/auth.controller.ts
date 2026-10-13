import { Controller, Get, Post, Body, Patch, Request,Param, Delete, UseGuards, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import type { Response } from "express";
import { LocalAuthGuard } from 'src/common/guards/loacalAuth.guard';
import { Public } from 'src/common/decorators/public.decorator';
import { SamlAuthGuard } from 'src/saml/saml.guard';
import { SamlService } from 'src/saml/saml.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, 
  private readonly samlService: SamlService
  ) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

@Public()
@Get('sso/saml/login')
@UseGuards(SamlAuthGuard)
async samlLogin() {
  //this route is handled by passport-saml
  return;
}
 @Public()
  @Post('sso/saml/ac')
  @UseGuards(SamlAuthGuard)
  async samlAssertionConsumer(
    @Req() req: any, @Res() res: Response
  ) {
  const redirectUrl =
    await this.samlService.handleCallBackHandler(req.user);
    return res.redirect(redirectUrl);
  }

  
@UseGuards(LocalAuthGuard)
@Post('logout')
async logout(@Request() req) {
  return req.logout();
}

}
