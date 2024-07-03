import { Controller, Post, Body, Res, HttpStatus, Get, Param } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { SignInDto } from './dto/sign-in.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  async signUp(@Body() createAuthDto: CreateAuthDto, @Res() res: Response) {
    try {
      const result = await this.authService.signUp(createAuthDto);

      if (result.session) {
        res.cookie('authToken', result.session.access_token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          maxAge: 3600000,
        });
      }

      return res.status(HttpStatus.CREATED).json(result);
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
    }
  }

  @Post('login')
  async login(@Body() signInDto: SignInDto, @Res() res: Response) {
    try {
      const result = await this.authService.signIn(signInDto);

      if (result.session) {
        res.cookie('authToken', result.session.access_token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          maxAge: 3600000,
        });
      }

      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      return res.status(HttpStatus.UNAUTHORIZED).json({ message: error.message });
    }
  }

  @Post('user')
  async getUser(@Body('token') token: string, @Res() res: Response) {
    try {
      const data = await this.authService.getUser(token);
      return res.status(HttpStatus.OK).json(data);
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
    }
  }

  @Get('user/:id')
  async getUserById(@Param('id') uniqueId: string, @Res() res: Response) {
    try {
      const data = await this.authService.getUserById(uniqueId);
      return res.status(HttpStatus.OK).json(data);
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
    }
  }

  @Post('logout')
  async logout(@Body('token') token: string, @Res() res: Response) {
    try {
      const data = await this.authService.logout(token);
      res.clearCookie('authToken');
      return res.status(HttpStatus.OK).json(data);
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
    }
  }
}
