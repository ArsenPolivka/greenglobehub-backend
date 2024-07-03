import { Injectable, Logger } from '@nestjs/common';
import { EmailClient, EmailMessage, KnownEmailSendStatus } from '@azure/communication-email';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private emailClient: EmailClient;
  private subscriptions: string[] = [];

  constructor() {
    const connectionString = process.env.AZURE_EMAIL_CONNECTION_STRING;

    if (!connectionString) {
      throw new Error('Azure Email Connection String is not defined');
    }

    this.emailClient = new EmailClient(connectionString);
  }

  async sendEmail(to: string, subject: string, body: string, recipientName?: string): Promise<void> {
    const senderAddress = process.env.EMAIL_SENDER_ADDRESS;
    if (!senderAddress) {
      throw new Error('Email Sender Address is not defined');
    }

    const emailMessage: EmailMessage = {
      senderAddress: senderAddress,
      content: {
        subject: subject,
        plainText: body,
      },
      recipients: {
        to: [{ address: to, displayName: recipientName || 'Recipient' }],
      },
    };

    try {
      const poller = await this.emailClient.beginSend(emailMessage);
      const result = await poller.pollUntilDone();

      if (result.status === KnownEmailSendStatus.Succeeded) {
        this.logger.log(`Email sent successfully to ${to}`);
      } else {
        this.logger.error(`Failed to send email to ${to}: ${result.error.message}`);
      }
    } catch (error) {
      this.logger.error(`Error sending email to ${to}: ${error.message}`);
    }
  }

  async subscribeEmail(email: string): Promise<void> {
    if (!this.subscriptions.includes(email)) {
      this.subscriptions.push(email);
      this.logger.log(`Subscribed ${email} to email list`);

      // Send confirmation email
      const subject = 'Subscription Confirmation';
      const body = 'Thank you for subscribing to our email list!';
      await this.sendEmail(email, subject, body);
    } else {
      this.logger.log(`${email} is already subscribed`);
    }
  }

  getSubscriptions(): string[] {
    return this.subscriptions;
  }
}
