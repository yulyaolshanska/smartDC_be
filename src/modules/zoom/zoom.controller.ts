import { Controller, Body, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ZoomService } from './zoom.service';

@Controller('zoom')
export class ZoomController {
  constructor(private readonly zoomService: ZoomService) {}

  @ApiOperation({ summary: 'Get signature' })
  @Post()
  getSignature(@Body() credentials: any): Promise<any> {
    return this.zoomService.handleSignature(credentials);
  }
}
