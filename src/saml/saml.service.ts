import { Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class SamlService {

  constructor(private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly configService: ConfigService){}

  async handleCallBackHandler(profile: any) {
    try {
        const email = profile.nameID;
    const firstName = profile.attributes?.firstName?.[0] ?? "";
    const lastName = profile.attributes?.lastName?.[0] ?? "";

      let targetUser = await this.usersService.findByEmail(email);

      if (!targetUser) {
        targetUser = await this.usersService.create({
          email,
          firstName,
          lastName
        });
      }

      // 2. Check if user is active
      if (!targetUser.isActive) {
        throw new UnauthorizedException('User account is deactivated');
      }
  
      // 3. Generate JWT token
      const jwt = await this.jwtService.signAsync(
        { sub: targetUser.id, username: targetUser.email },
      );

        // 4. Get frontend URL from config and build redirect
      const webUrl = this.configService.get<string>('FRONTEND_WEB_URL'); 
      if (!webUrl) {
        throw new InternalServerErrorException('Frontend web URL configuration is missing');
      }

      return `${webUrl}?status=SUCCESS&token=${encodeURIComponent(jwt)}`;
      }
    catch (error) {
      if (error instanceof UnauthorizedException || error instanceof InternalServerErrorException) {
        throw error;
      }
      console.error('SAML Callback Error:', error);
      throw new InternalServerErrorException('Error occurred while handling SAML callback');
    }
    }
}

