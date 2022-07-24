import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { compare, hash } from 'bcrypt';
import { UserEntity } from 'src/users/users.entity';
import { Repository } from 'typeorm';
import { PasswordEntity } from './passwords.entity';
import { SessionsEntity } from './sessions.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(PasswordEntity)
    private passwordRepository: Repository<PasswordEntity>,
    @InjectRepository(SessionsEntity)
    private sessionRepository: Repository<SessionsEntity>,
  ) {}

  public static PASSWORD_SALT_ROUNDS = 10;

  async createPasswordForNewUser(
    userId: string,
    password: string,
  ): Promise<PasswordEntity> {
    const existing = await this.passwordRepository.findOne({
      where: { userId },
    });

    if (existing) {
      throw new UnauthorizedException('This user already has a password');
    }

    const newPassword = new PasswordEntity();
    newPassword.userId = userId;
    newPassword.password = await this.passToHash(password);
    return await this.passwordRepository.save(newPassword);
  }

  private async passToHash(password: string): Promise<string> {
    return await hash(password, AuthService.PASSWORD_SALT_ROUNDS);
  }

  private async matchPassHash(
    password: string,
    hash: string,
  ): Promise<boolean> {
    return (await compare(password, hash)) === true;
  }

  async createNewSession(username: string, password: string) {
    const user = await this.userRepository.findOne({ where: { username } });

    if (!user) {
      throw new NotFoundException('Invalid user');
    }

    const userPassword = await this.passwordRepository.findOne({
      where: { userId: user.id },
    });

    const passMatch = await this.matchPassHash(password, userPassword.password);

    if (!passMatch) {
      throw new UnauthorizedException('Invalid password');
    }
    const session = new SessionsEntity();
    session.userId = userPassword.userId;
    const savedSession = await this.sessionRepository.save(session);
    return savedSession;
  }

  async getUserFromSessionToken(token: string): Promise<UserEntity> {
    const session = await this.sessionRepository.findOne({
      where: { id: token },
    });
    if (!session) {
      throw new NotFoundException('Invalid session');
    }
    const user = await session.user;
    if (!user) {
      throw new UnauthorizedException('Invalid user');
    }
    return user;
  }
}
