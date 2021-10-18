import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { AuthCredentialDto } from './dto/auth-credential.dto';
import { JwtPayload } from './jwt-payload.interface';
import { UserRepository } from './user.repository';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService
  ) {}

  async signUp(
    authCredentialsDto: AuthCredentialDto
  ): Promise<{ accessToken: string }> {
    const user = await this.userRepository.signUp(authCredentialsDto);

    const { username } = user;

    const payload: JwtPayload = { username, user_id: user.id };
    const accessToken: string = this.jwtService.sign(payload);

    return { accessToken };
  }

  async signIn(
    authCredentialsDto: AuthCredentialDto
  ): Promise<{ accessToken: string }> {
    const { username, password } = authCredentialsDto;

    const user = await this.userRepository.findOne({ username: username });

    if (user && (await bcrypt.compare(password, user.password))) {
      const payload: JwtPayload = { username, user_id: user.id };
      const accessToken: string = this.jwtService.sign(payload);

      return { accessToken };
    }

    throw new UnauthorizedException('Please check your credential');
  }
}
