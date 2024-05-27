import { Injectable } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';

@Injectable()
export class AuthService {
  private supabase;

  constructor() {
    this.supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
  }

  async signUp(email: string, password: string): Promise<any> {
    const { data, error } = await this.supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  async signIn(email: string, password: string): Promise<any> {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  async getUser(sessionToken: string): Promise<any> {
    const { data, error } = await this.supabase.auth.getUser(sessionToken);

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  async logout(sessionToken: string): Promise<any> {
    const { error } = await this.supabase.auth.signOut(sessionToken);

    if (error) {
      throw new Error(error.message);
    }

    return { message: 'Logged out successfully' };
  }
}
