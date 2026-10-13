import { PassportStrategy } from "@nestjs/passport";
import { ConfigService } from "@nestjs/config";
import { Strategy, SamlConfig, Profile } from '@node-saml/passport-saml';
import { Injectable, UnauthorizedException } from "@nestjs/common";


@Injectable()
export class SamlStrategy extends PassportStrategy(Strategy, 'saml') {
  

  constructor(configService: ConfigService) {

        const rawCert = configService.get<string>('SAML_CERT');
        if (!rawCert) {
            throw new Error('SAML_CERT is not defined');
        }

        // Ensure quotes and multi-line breaks are parsed cleanly
        const cleanCert = rawCert.replace(/\\n/g, '\n').replace(/"/g, '');

        super({
            entryPoint: configService.get("SAML_ENTRY_POINT"),
            callbackUrl: configService.get("SAML_CALLBACK_URL"),
            issuer: configService.get("SAML_ISSUER"),
            idpIssuer: configService.get("IDP_ISSUER"),
            idpCert: cleanCert,
            wantAssertionsSigned: true,
            wantAuthnResponseSigned: false,
            identifierFormat: null,
            acceptedClockSkewMs: 5000, 
        } as SamlConfig,
       (profile: any, done: any) => done(null, profile) );
        
    }

   async validate(profile: Profile | null): Promise<any> {
    if (!profile) {
      throw new UnauthorizedException('No SAML profile returned by IdP');
    }

    console.log('--- SAML Login Success! ---');
    console.log('User Profile Data:', profile);

    // Return the user object to attach it to req.user in your controller
    return profile;
  }

}
