import { join } from 'path';

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { existsSync } from 'fs';

@Injectable()
export class FilesService {
  getStaticProductImage(imageName: string) {
    const path = join(__dirname, '../../static/products', imageName);

    if (!existsSync(path))
      throw new NotFoundException(`No product found with image ${imageName}`);

    return path;
  }
}
