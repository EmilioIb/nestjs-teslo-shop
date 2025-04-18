import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

import { Response } from 'express';
import { diskStorage } from 'multer';

import { FilesService } from './files.service';

import { fileFilter, fileNamer } from './helpers';

@ApiTags('Files')
@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly configService: ConfigService,
  ) {}

  @Get('products/:imageName')
  @ApiResponse({
    status: 200,
    description: 'Image found',
  })
  @ApiResponse({ status: 404, description: 'Image not found' })
  findProductImage(
    @Res() res: Response,
    @Param('imageName') imageName: string,
  ) {
    const path = this.filesService.getStaticProductImage(imageName);
    return res.sendFile(path);
  }

  @Post('products')
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: fileFilter,
      //limits: { fileSize: 1000 },
      storage: diskStorage({
        destination: './static/products',
        filename: fileNamer,
      }),
    }),
  )
  @ApiResponse({
    status: 201,
    description: 'Image uploaded',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  uploadProductFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('Make sure that file is an image');
    const secureUrl = `${this.configService.get('HOST_API')}/files/products/${file.filename}`;
    return { secureUrl };
  }
}
