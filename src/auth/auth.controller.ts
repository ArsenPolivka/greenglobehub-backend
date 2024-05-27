import { Controller, Post, Body, Res, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  async signUp(@Body('email') email: string, @Body('password') password: string, @Res() res: Response) {
    try {
      const result = await this.authService.signUp(email, password);

      if (result.session) {
        res.cookie('authToken', result.session.access_token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          maxAge: 3600000, // 1 hour
        });
      }

      return res.status(HttpStatus.CREATED).json(result);
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
    }
  }

  @Post('login')
  async login(@Body('email') email: string, @Body('password') password: string, @Res() res: Response) {
    try {
      const result = await this.authService.signIn(email, password);

      if (result.session) {
        res.cookie('authToken', result.session.access_token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          maxAge: 3600000, // 1 hour
        });
      }

      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      return res.status(HttpStatus.UNAUTHORIZED).json({ message: error.message });
    }
  }

  @Post('user')
  async getUser(@Body('token') token: string, @Res() res) {
    try {
      const data = await this.authService.getUser(token);
      return res.status(HttpStatus.OK).json(data);
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
    }
  }

  @Post('logout')
  async logout(@Body('token') token: string, @Res() res) {
    try {
      const data = await this.authService.logout(token);
      res.clearCookie('authToken');
      return res.status(HttpStatus.OK).json(data);
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
    }
  }
}
