import { Controller, Get, UseGuards, Req, Res } from '@nestjs/common';
import { GoogleAuthGuard } from './google.guard/google.guard';

@Controller('auth')
export class AuthController {
  @Get('google/login')
  @UseGuards(GoogleAuthGuard)
  googleAuth(@Req() req, @Res() res) {
    console.log('Initiating Google OAuth login');
  }
  @Get('google/redirect')
  @UseGuards(GoogleAuthGuard)
  async handleGoogleCallback(@Req() req, @Res() res) {
    console.log('Google OAuth callback received');
    console.log('User authenticated:', req.user);

    if (!req.user) {
      return res.status(401).json({ message: 'Authentication failed' });
    }

    const token = req.user.token;

    return res.json({
      message: 'Google login successful',
      user: req.user,
      token: token,
    });
  }
}
