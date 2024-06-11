import { Controller, Post, Body, HttpException, HttpStatus, Res } from '@nestjs/common';
import { EmailService } from './email.service';
import { Response } from 'express';
import { SubscribeEmailDto } from './dto/subscribe-email.dto';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('send')
  async sendEmail(
    @Body() body: { to: string; subject: string; content: string; recipientName?: string },
    @Res() res: Response
  ): Promise<void> {
    const { to, subject, content, recipientName } = body;

    try {
      await this.emailService.sendEmail(to, subject, content, recipientName);
      res.status(HttpStatus.OK).json({ message: 'Email sent successfully' });
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
    }
  }

  @Post('subscribe')
  async subscribeEmail(@Body() subscribeEmailDto: SubscribeEmailDto): Promise<{ message: string }> {
    const { email } = subscribeEmailDto;
    try {
      await this.emailService.subscribeEmail(email);
      return { message: `Subscribed ${email} successfully and a confirmation email has been sent` };
    } catch (error) {
      throw new HttpException({ message: `Failed to subscribe email: ${error.message}` }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
