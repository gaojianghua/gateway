import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
export class CreateUserDto {
  @ApiProperty({ description: '用户id', example: 123, })
  id?: string;

  @ApiProperty({ description: '真名', example: '高江华' })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: '邮箱', example: 'g598670138@163.com' })
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: '用户名', example: 'wolffy' })
  @IsNotEmpty()
  username: string;
}