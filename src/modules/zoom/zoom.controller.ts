import { Controller, Body, Post } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { ZoomService } from './zoom.service';
import { ZoomCredentials } from './types';

@Controller('zoom')
export class ZoomController {
  constructor(private readonly zoomService: ZoomService) {}

  @ApiOperation({ summary: 'Get signature' })
  @Post()
  getSignature(@Body() credentials: ZoomCredentials): Promise<string> {
    return this.zoomService.handleSignature(credentials);
  }
}
