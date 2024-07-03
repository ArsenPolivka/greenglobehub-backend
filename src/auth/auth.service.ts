import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';
import { CreateAuthDto } from './dto/create-auth.dto';
import { SignInDto } from './dto/sign-in.dto';
import { User } from './entities/user.entity';

@Injectable()
export class AuthService {
  private supabase;

  constructor() {
    this.supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
  }

  async signUp(createAuthDto: CreateAuthDto): Promise<any> {
    const { name, email, password, confirmPassword } = createAuthDto;

    if (password !== confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    const { data, error } = await this.supabase.auth.signUp({ email, password });

    if (error) {
      throw new BadRequestException(error.message);
    }

    const { data: userData, error: userError } = await this.supabase
      .from('users')
      .insert([
        {
          uniqueId: data.user.id,
          name,
          email: data.user.email,
          registeredAt: new Date(),
        }
      ])
      .select()

    if (userError) {
      throw new BadRequestException(error.message);
    }

    return {
      ...userData[0],
      session: data.session.access_token
    };
  }

  async signIn(signInDto: SignInDto): Promise<any> {
    const { email, password } = signInDto;

    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new UnauthorizedException(error.message);
    }

    const { data: userData, error: userError } = await this.supabase
      .from('users')
      .select()
      .eq('email', email);

    if (userError) {
      throw new BadRequestException(error.message);
    }

    return {
      ...userData[0],
      session: data.session.access_token
    };
  }

  async getUser(sessionToken: string): Promise<User> {
    const { data, error } = await this.supabase.auth.getUser(sessionToken);

    if (error) {
      throw new BadRequestException(error.message);
    }

    const { data: userData, error: userError } = await this.supabase
      .from('users')
      .select()
      .eq('uniqueId', data.user.id)
      .single();

    if (userError) {
      throw new BadRequestException(userError.message);
    }

    return userData;
  }

  async getUserById(uniqueId: string): Promise<User> {
    const { data, error } = await this.supabase
      .from('users')
      .select()
      .eq('uniqueId', uniqueId)
      .single();

    if (error) {
      throw new BadRequestException(error.message);
    }

    return data;
  }

  async logout(sessionToken: string): Promise<any> {
    const { error } = await this.supabase.auth.signOut(sessionToken);

    if (error) {
      throw new BadRequestException(error.message);
    }

    return { message: 'Logged out successfully' };
  }
}
