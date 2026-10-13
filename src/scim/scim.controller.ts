import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { ScimService } from './scim.service';
import { CreateScimUserDto } from './dto/create-scim-user.dto';
import { UpdateScimDto } from './dto/update-scim.dto';

@Controller('scim/v2/Users')
export class ScimController {
  constructor(private readonly scimService: ScimService) {}


  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createScimUserDto: CreateScimUserDto) {
    return this.scimService.createUserFromScimResource(createScimUserDto);
  }

  @Get()
  async findAll() {
    return this.scimService.findAllScimUsers();
  } 

  async findOne(@Param('id') id: string) {
    return this.scimService.findOneScimUser(Number(id));
  }
  
}
