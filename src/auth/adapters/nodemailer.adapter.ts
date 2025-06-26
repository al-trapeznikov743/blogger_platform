import nodemailer from 'nodemailer';
import {config} from '../../core/settings/config';

export const nodemailerService = {
  async sendEmail(email: string, code: string, template: (code: string) => string) {
    console.log('config-90-#########: ', config);

    const transporter = nodemailer.createTransport(
      /* {
      service: 'gmail',
      auth: {
        user: config.EMAIL,
        pass: config.EMAIL_PASS
      }
    } */
      {
        host: 'smtp.yandex.ru',
        port: 465,
        secure: true,
        auth: {
          user: config.EMAIL,
          pass: config.EMAIL_PASS
        }
      }
    );

    transporter.sendMail({
      from: `"Kek 👻" <${config.EMAIL}>`,
      to: email,
      subject: 'Your code is here',
      html: template(code)
    });
  }
};
