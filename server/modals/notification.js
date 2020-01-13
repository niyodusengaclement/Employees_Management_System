import nodemailer from 'nodemailer';
import Nexmo from 'nexmo';

class SendNotification {
  SendNotification(reciever, message) {
    this.sendEmail(reciever, message);
    this.sendSms(reciever, message);
  }

  async sendEmail(reciever, message) {
    try {
      this.sender = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: process.env.MAILERUSER,
          pass: process.env.MAILERPASS,
        },
      });

      this.mailOptions = {
        from: `Awesomity ${process.env.MAILERUSER}`,
        to: reciever.email,
        subject: 'Employee registration message',
        text: `Hello ${reciever.employee_name}
        ${message}
        The Awesomity Team `,
      };
      return await this.sender.sendMail(this.mailOptions);
    } catch (err) {
      return err;
    }
  }

  sendSms(reciever, message) {
    try {
      this.nexmo = new Nexmo({
        apiKey: process.env.SMS_API_KEY,
        apiSecret: process.env.SMS_API_SECRET,
      });

      const from = 'Awesomity';
      const to = reciever.phone;
      const text = `Hi ${reciever.employee_name}, ${message} 
      The Awesomity Team`;
      return this.nexmo.message.sendSms(from, to, text);
    } catch (err) {
      return err;
    }
  }
}

export default new SendNotification();
