import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class CreateUserDto {
    @ApiProperty({ example: 'test@example.com', description: '이메일' })
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty({ example: 'Password123', description: '비밀번호' })
    @IsNotEmpty()
    @MinLength(6)
    password: string;

    @ApiProperty({ example: '홍길동', description: '이름' })
    @IsNotEmpty()
    name: string;

    @ApiProperty({ example: '01012345678', description: '휴대폰번호' })
    @IsNotEmpty()
    phone: string;
}
