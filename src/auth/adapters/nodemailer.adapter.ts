import nodemailer from 'nodemailer';
import {config} from '../../core/settings/config';

export const nodemailerService = {
  async sendEmail(
    email: string,
    code: string,
    template: (code: string) => string
  ): Promise<boolean> {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: config.EMAIL,
        pass: config.EMAIL_PASS
      }
    });

    const info = await transporter.sendMail({
      from: `"Kek 👻" <${config.EMAIL}>`,
      to: email,
      subject: 'Your code is here',
      html: template(code)
    });

    return !!info;
  }
};
