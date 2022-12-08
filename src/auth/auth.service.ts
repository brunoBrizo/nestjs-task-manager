import { JwtToken } from './jwt-token.interface';
import { JwtPayload } from './jwt-payload.interface';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { UsersRepository } from './user.repository';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UsersRepository)
    private usersRepository: UsersRepository,
    private jwtService: JwtService,
  ) {}

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    return this.usersRepository.createUser(authCredentialsDto);
  }

  async signIn(authCredentialsDto: AuthCredentialsDto): Promise<JwtToken> {
    const { userName, password } = authCredentialsDto;

    const user = await this.usersRepository.findOne({ where: { userName } });

    const authenticated = await bcrypt.compare(password, user?.password);
    if (!authenticated) {
      throw new UnauthorizedException();
    }

    const payload: JwtPayload = { userName };
    const token = await this.jwtService.sign(payload);

    return { token };
  }
}
