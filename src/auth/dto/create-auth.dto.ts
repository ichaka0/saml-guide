import { IsNotEmpty, IsOptional, MinLength } from "class-validator";
import { IsString } from "class-validator/types/decorator/typechecker/IsString";

export class CreateAuthDto {

    @IsString({ message: 'Email must be a string' })
    @IsNotEmpty({ message: 'Email is required' })
    email: string;

    @IsString()
    @IsOptional()
    @MinLength(8, { message: 'Password must be at least 8 characters' })
    password: string;
}
