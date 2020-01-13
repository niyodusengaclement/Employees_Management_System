import nodemailer from 'nodemailer';

class SendNotification {
  SendNotification(reciever, message) {
    this.sendEmail(reciever, message);
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
}

export default new SendNotification();
