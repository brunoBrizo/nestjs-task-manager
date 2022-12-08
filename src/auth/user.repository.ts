import { DataSource, Repository } from 'typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';

@Injectable()
export class UsersRepository extends Repository<User> {
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async createUser(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { userName, password } = authCredentialsDto;

    // Handle password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = this.create({
      userName,
      password: hashedPassword,
    });

    try {
      await this.save(user);
    } catch (error) {
      // duplicate error code
      if (error.code === '23505') {
        throw new ConflictException('User already in use');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
}
