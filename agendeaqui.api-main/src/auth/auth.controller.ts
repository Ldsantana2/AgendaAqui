import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Ip,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { IsPublic } from './decorators/is-public.decorator';
import {
  CreateClinicDto,
  CreateDoctorDto,
  CreateUserDto,
} from './dto/create-user.dto';
import { CreateAdminDto } from './dto/create-admin.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateAuthRequestDto } from './dto/create-auth-request.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ValidateTokenDto } from './dto/validate-token.dto';
import { SetNewPasswordDto } from './dto/set-new-password.dto';
import { DoctorService } from '../doctor/doctor.service';
import { PatientService } from '../patient/patient.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly doctorService: DoctorService,
    private readonly patientService: PatientService,
  ) {}

  @IsPublic()
  @ApiOperation({ summary: 'Realiza login no sistema' })
  @ApiBody({ type: CreateAuthRequestDto })
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() createAuthRequestDto: CreateAuthRequestDto, @Req() req) {
    const { email, password } = createAuthRequestDto;

    let ip = req.ip || req.connection.remoteAddress || null;

    if (ip === '::1' || ip === '::ffff:127.0.0.1') {
      ip = '127.0.0.1';
    }

    if (ip && ip.startsWith('::ffff:')) {
      ip = ip.substring(7);
    }

    console.log('Client IP:', ip);
    return this.authService.login(email, password, ip);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obter dados do usuario logado.' })
  @Get('me')
  async getMe(@Req() req) {
    return await this.authService.findOne(req.user.id);
  }

  @IsPublic()
  @ApiOperation({ summary: 'Cadastra um novo usuário no sistema' })
  @ApiBody({ type: CreateUserDto })
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.createUser(createUserDto);
  }

  @IsPublic()
  @ApiOperation({ summary: 'Cadastra um novo médico no sistema' })
  @ApiBody({ type: CreateDoctorDto })
  @Post('register-doctor')
  @HttpCode(HttpStatus.CREATED)
  async registerDoctor(
    @Body() createDoctorDto: CreateDoctorDto,
  ) {
    return this.authService.createDoctor(createDoctorDto);
  }

  @IsPublic()
  @ApiOperation({ summary: 'Cadastra uma nova clinica no sistema' })
  @ApiBody({ type: CreateClinicDto })
  @Post('register-clinic')
  @HttpCode(HttpStatus.CREATED)
  async registerClinic(
    @Body() createClinicDto: CreateClinicDto,
  ) {
    return this.authService.createClinic(createClinicDto);
  }

  @IsPublic()
  @ApiOperation({ summary: 'Cadastra um novo administrador no sistema' })
  @ApiBody({ type: CreateAdminDto })
  @Post('register-admin')
  @HttpCode(HttpStatus.CREATED)
  async registerAdmin(
    @Body() createAdminDto: CreateAdminDto,
  ) {
    return this.authService.createAdmin(createAdminDto);
  }

  @IsPublic()
  @ApiOperation({ summary: 'Obtem um novo token de acesso' })
  @ApiBody({ type: RefreshTokenDto })
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshToken(refreshTokenDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Deslogar do sistema' })
  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(@Req() req) {
    const userId = req.user.id;
    return this.authService.logout(userId);
  }

  @IsPublic()
  @ApiOperation({ summary: 'Recuperação de Senha' })
  @ApiBody({ type: ForgotPasswordDto })
  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    await this.authService.forgotPassword(forgotPasswordDto.email);
    return {
      message:
        'Se este e-mail estiver cadastrado, um código de recuperação foi enviado.',
    };
  }

  @IsPublic()
  @ApiBody({ type: ValidateTokenDto })
  @ApiOperation({ summary: 'Validar token de recuperação de senha' })
  @Post('validate-token')
  @HttpCode(HttpStatus.OK)
  async validateToken(@Body() validateTokenDto: ValidateTokenDto) {
    const isValid = await this.authService.validateToken(validateTokenDto.code);
    if (!isValid) {
      return { valid: false, message: 'Código inválido ou expirado.' };
    }
    return { valid: true, message: 'Código válido.' };
  }

  @IsPublic()
  @ApiBody({ type: SetNewPasswordDto })
  @ApiOperation({ summary: 'Resetar senha' })
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() setNewPasswordDto: SetNewPasswordDto) {
    await this.authService.resetPassword(
      setNewPasswordDto.code,
      setNewPasswordDto.newPassword,
      setNewPasswordDto.confirmPassword,
    );
    return { message: 'Senha redefinida com sucesso.' };
  }
}
