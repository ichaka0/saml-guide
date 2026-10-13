import { IsArray, IsBoolean, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class NameDto {
  @IsString() @IsOptional() givenName: string;
  @IsString() @IsOptional() familyName: string;
}

class EmailDto {
  @IsString() @IsNotEmpty() value: string;
  @IsString() @IsOptional() type: string;
  @IsBoolean() @IsOptional() primary: boolean;
}

export class CreateScimUserDto {
  @IsArray() @IsNotEmpty() schemas: string[];
  @IsString() @IsNotEmpty() userName: string; // Typically the email or primary unique identifier
  
  @ValidateNested()
  @Type(() => NameDto)
  @IsOptional()
  name: NameDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EmailDto)
  @IsOptional()
  emails: EmailDto[];

  @IsBoolean()
  @IsOptional()
  active?: boolean;
}
