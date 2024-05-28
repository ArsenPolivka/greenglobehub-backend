import { Injectable } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';

@Injectable()
export class AuthService {
  private supabase;
  private supabaseAdmin;

  constructor() {
    this.supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
    this.supabaseAdmin = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE);
  }

  async signUp(name: string, email: string, password: string, confirmPassword: string): Promise<any> {
    if (password !== confirmPassword) {
      throw new Error('Passwords do not match');
    }

    try {
      const { data, error } = await this.supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        throw new Error(error.message);
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
        throw new Error(userError.message);
      }

      return { userData, session: data.session };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async signIn(email: string, password: string): Promise<any> {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new Error(error.message);
    }

    const { data: userData, error: userError } = await this.supabase
      .from('users')
      .select()
      .eq('email', email);

    if (userError) {
      throw new Error(userError.message);
    }

    return { userData, session: data.session };
  }

  async getUser(sessionToken: string): Promise<any> {
    const { data, error } = await this.supabase.auth.getUser(sessionToken);

    if (error) {
      throw new Error(error.message);
    }

    const { data: userData, error: userError } = await this.supabase
      .from('users')
      .select()
      .eq('uniqueId', data.user.id);

    if (userError) {
      throw new Error(userError.message);
    }

    return userData[0] || userData;
  }

  async getUserById(uniqueId: string): Promise<any> {
    const { data, error } = await this.supabase
      .from('users')
      .select()
      .eq('uniqueId', uniqueId);

    if (error) {
      throw new Error(error.message);
    }

    return data[0] || data;
  }

  async logout(sessionToken: string): Promise<any> {
    const { error } = await this.supabase.auth.signOut(sessionToken);

    if (error) {
      throw new Error(error.message);
    }

    return { message: 'Logged out successfully' };
  }
}
