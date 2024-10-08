import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/users/user.service';
import * as bcrypt from 'bcryptjs';
import { LoginDto,RegisterUserDto } from './auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userService.findByEmail(email);
    if (user && await bcrypt.compare(pass, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.validateUser(email, password);
    if (user) {
      const payload = { email: user.email, name: user.name, id: user.id, role: user.role };
      return {
        access_token: this.jwtService.sign(payload),
      };
    }
    return null; 
  }

  async register(userDto: RegisterUserDto) {
    const hashedPassword = await bcrypt.hash(userDto.password, 10);
    const newUser = await this.userService.create({ ...userDto, password: hashedPassword });
    return newUser;
  }
}
