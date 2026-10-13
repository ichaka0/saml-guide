import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { User } from '@node-saml/passport-saml/lib/types';
import { Repository } from 'typeorm/browser/repository/Repository.js';
import { CreateScimUserDto } from './dto/create-scim-user.dto';

@Injectable()
export class ScimService {

  constructor(private readonly userRepository: Repository<User>) { }

  private formatToScimResource(internalUser: any) {
    return {
      schemas: ['urn:ietf:params:scim:schemas:core:2.0:User'],
      id: internalUser.id.toString(),
      userName: internalUser.email,
      name: {
        givenName: internalUser.firstName,
        familyName: internalUser.lastName
      },
      emails: [
        {
          value: internalUser.email,
          type: 'work',
          primary: true
        }
      ],
      active: internalUser.isActive,
      meta: {
        resourceType: 'User',
      }
    }
  }

  async createUserFromScimResource(createScimUserDto: CreateScimUserDto) {

    const emailToFind = createScimUserDto.emails?.find(e => e.primary)?.value
      || createScimUserDto.emails?.[0]?.value;

    if (!emailToFind) {
      throw new ConflictException('Email is required to create a SCIM user');
    }

    const existingUser = await this.userRepository.findOne({ where: { email: createScimUserDto.emails } });
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }
    const user = this.userRepository.create({
      email: emailToFind,
      firstName: createScimUserDto.name?.givenName || '',
      lastName: createScimUserDto.name?.familyName || '',
      isActive: createScimUserDto.active ?? true,
    });

    const savedUser = await this.userRepository.save(user);
    return this.formatToScimResource(savedUser);
  }

  async findAllScimUsers() {
    const users = await this.userRepository.find();
    return {
       schemas: ['urn:ietf:params:scim:api:messages:2.0:ListResponse'],
      totalResults: users.length,
      itemsPerPage: users.length,
      startIndex: 1,
      Resources: users.map(user => this.formatToScimResource(user))
    }
  }

  async findOneScimUser(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.formatToScimResource(user);
  }
}
