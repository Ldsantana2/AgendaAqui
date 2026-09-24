import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { Appointment } from '@prisma/client';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;
  private readonly logger = new Logger(EmailService.name);
  private readonly logoUrl = 'https://agendaquisaude.com.br/images/AGENDAQUI_FUNDO_TRANSPARENTE@4x.png';

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.hostinger.com',
      port: 465,
      secure: true,
      auth: {
        user: 'no-reply@agendaquisaude.com.br',
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  /**
   * Send a registration confirmation email
   * @param to Recipient email address
   * @param name Recipient name
   */
  async sendRegistrationConfirmation(to: string, name: string): Promise<void> {

    try {
      await this.transporter.sendMail({
        from: '"AgendeAqui" <no-reply@agendaquisaude.com.br>',
        to,
        subject: 'Bem-vindo ao Agenda Aqui Saúde - Cadastro Realizado com Sucesso',
        html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid ##DFECFF; border-radius: 5px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="${this.logoUrl}" alt="Logo AgendeAqui" style="max-width: 200px;" />
          </div>
          <h2 style="color: #2D39A6;">Olá, ${name}!</h2>
          <p>Seu cadastro no Agenda Aqui Saúde foi realizado com sucesso.</p>
          <p>Agora você pode agendar consultas e serviços de saúde de forma rápida e prática.</p>
          <p>Acesse sua conta através do nosso site ou aplicativo para começar a usar.</p>
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid ##DFECFF;">
            <p style="font-size: 12px; color: #666;">
              Este é um email automático, por favor não responda.
              Se você não solicitou este cadastro, por favor ignore este email.
            </p>
          </div>
        </div>
      `,
      });
      this.logger.log(`Registration confirmation email sent to ${to}`);
    } catch (error) {
      this.logger.error(`Failed to send registration email to ${to}`, error.stack);
    }
  }


  /**
   * Send a password reset code email
   * @param to Recipient email address
   * @param code Password reset code
   */
  async sendPasswordResetCode(to: string, code: string): Promise<void> {
    try {
      const frontendUrl = process.env.FRONTEND_URL;
      const resetUrl = `${frontendUrl}/reset-password`;

      await this.transporter.sendMail({
        from: '"Agenda Aqui Saúde" <no-reply@agendaquisaude.com.br>',
        to,
        subject: 'Agenda Aqui Saúde - Recuperação de Senha',
        html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #DFECFF; border-radius: 5px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="${this.logoUrl}" alt="Logo AgendeAqui" style="max-width: 200px;" />
          </div>

          <h2 style="color: #2D39A6;">Recuperação de Senha</h2>
          <p>Você solicitou a recuperação de senha para sua conta no AgendeAqui.</p>
          <p><strong>Para redefinir sua senha, siga os dois passos abaixo:</strong></p>

          <p>1. Clique no botão abaixo para acessar a página de redefinição de senha:</p>
          <div style="text-align: center; margin: 20px 0;">
            <a href="${resetUrl}" style="display: inline-block; background-color: #2D39A6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Acessar Página de Redefinição</a>
          </div>

          <p>2. Na página de redefinição, digite o código abaixo:</p>
          <div style="background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
            ${code}
          </div>

          <p><strong>Importante:</strong> Você precisa tanto acessar o link quanto digitar o código para redefinir sua senha.</p>
          <p>Este código expira em 10 minutos.</p>
          <p>Se você não solicitou esta recuperação de senha, por favor ignore este email.</p>

          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #DFECFF;">
            <p style="font-size: 12px; color: #666;">
              Este é um email automático, por favor não responda.
            </p>
          </div>
        </div>
      `,
      });

      this.logger.log(`Password reset code email sent to ${to}`);
    } catch (error) {
      this.logger.error(`Failed to send password reset email to ${to}`, error.stack);
    }
  }

  /**
   * Send an appointment confirmation email with action buttons
   * @param to Recipient email address
   * @param patientName Patient name
   * @param appointment Appointment details
   * @param doctorName Doctor name
   * @param appointmentDate Formatted appointment date
   * @param appointmentTime Formatted appointment time
   * @param baseUrl Base URL for confirmation/cancellation links
   */
  async sendAppointmentConfirmation(
    to: string,
    patientName: string,
    appointment: Appointment,
    doctorName: string,
    appointmentDate: string,
    appointmentTime: string,
    baseUrl: string
  ): Promise<void> {
    try {
      const confirmUrl = `${baseUrl}/appointment/confirm/${appointment.id}`;
      const cancelUrl = `${baseUrl}/appointment/cancel/${appointment.id}`;

      await this.transporter.sendMail({
        from: '"Agenda Aqui Saúde" <no-reply@agendaquisaude.com.br>',
        to,
        subject: 'Confirmação de Agendamento - Agenda Aqui Saúde',
        html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid ##DFECFF; border-radius: 5px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="${this.logoUrl}" alt="Logo AgendeAqui" style="max-width: 200px;" />
          </div>

          <h2 style="color: #2D39A6;">Olá, ${patientName}!</h2>
          <p>Sua consulta foi agendada com sucesso.</p>

          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #333;">Detalhes da Consulta:</h3>
            <p><strong>Médico:</strong> ${doctorName}</p>
            <p><strong>Data:</strong> ${appointmentDate}</p>
            <p><strong>Horário:</strong> ${appointmentTime}</p>
          </div>

          <p>Por favor, confirme sua presença ou cancele caso não possa comparecer:</p>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${confirmUrl}" style="display: inline-block; background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin-right: 10px; font-weight: bold;">Confirmar Presença</a>
            <a href="${cancelUrl}" style="display: inline-block; background-color: #f44336; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Cancelar Presença</a>
          </div>

          <p>Caso tenha alguma dúvida, entre em contato conosco.</p>

          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid ##DFECFF;">
            <p style="font-size: 12px; color: #666;">
              Este é um email automático, por favor não responda.
            </p>
          </div>
        </div>
      `,
      });

      this.logger.log(`Appointment confirmation email sent to ${to}`);
    } catch (error) {
      this.logger.error(`Failed to send appointment confirmation email to ${to}`, error.stack);
    }
  }

  /**
   * Send a doctor verification code email
   * @param to Recipient email address
   * @param doctorName Doctor name
   * @param clinicName Clinic name
   * @param code Verification code
   * @param baseUrl Base URL for verification
   */
  async sendDoctorVerificationCode(
    to: string,
    doctorName: string,
    clinicName: string,
    code: string,
    baseUrl: string
  ): Promise<void> {
    try {
      const verifyUrl = `${baseUrl}/doctor/verify`;

      await this.transporter.sendMail({
        from: '"Agenda Aqui Saúde" <no-reply@agendaquisaude.com.br>',
        to,
        subject: 'Verificação de Cadastro Médico - Agenda Aqui Saúde',
        html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #DFECFF; border-radius: 5px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="${this.logoUrl}" alt="Logo AgendeAqui" style="max-width: 200px;" />
          </div>

          <h2 style="color: #2D39A6;">Olá, Dr(a). ${doctorName}!</h2>
          <p>A clínica <strong>${clinicName}</strong> cadastrou você como médico no sistema Agenda Aqui Saúde.</p>
          <p>Para ativar seu cadastro e criar o vínculo com a clínica, por favor utilize o código de verificação abaixo:</p>

          <div style="background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
            ${code}
          </div>

          <p>Acesse <a href="${verifyUrl}">${verifyUrl}</a> e insira o código para ativar seu cadastro.</p>
          <p>Este código expira em 48 horas.</p>

          <p>Caso você não reconheça esta solicitação, por favor ignore este email.</p>

          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #DFECFF;">
            <p style="font-size: 12px; color: #666;">
              Este é um email automático, por favor não responda.
            </p>
          </div>
        </div>
      `,
      });

      this.logger.log(`Doctor verification code email sent to ${to}`);
    } catch (error) {
      this.logger.error(`Failed to send doctor verification email to ${to}`, error.stack);
    }
  }
}
