import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from '../common/dtos/pagination.dto';

import { Auth, GetUser } from '../auth/decorators';
import { ValidRoles } from '../auth/interfaces';
import { User } from '../auth/entities/user.entity';
import { Product } from './entities';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @Auth()
  @ApiResponse({
    status: 201,
    description: 'Product was created',
    type: Product,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized. Token related' })
  @ApiResponse({ status: 403, description: 'Forbidden. Token related' })
  @ApiBearerAuth()
  create(@Body() createProductDto: CreateProductDto, @GetUser() user: User) {
    return this.productsService.create(createProductDto, user);
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Products obtained',
    type: [Product],
  })
  findAll(@Query() paginationDto: PaginationDto) {
    return this.productsService.findAll(paginationDto);
  }

  @Get(':searchTerm')
  @ApiResponse({
    status: 200,
    description: 'Product obtained',
    type: Product,
  })
  @ApiResponse({
    status: 404,
    description: 'Product not found',
  })
  findOne(@Param('searchTerm') searchTerm: string) {
    return this.productsService.findOnePlain(searchTerm);
  }

  @Patch(':id')
  @Auth(ValidRoles.admin)
  @ApiResponse({
    status: 200,
    description: 'Product updated',
    type: Product,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized. Token related' })
  @ApiResponse({ status: 403, description: 'Forbidden. Token related' })
  @ApiResponse({
    status: 404,
    description: 'Product not found',
  })
  @ApiBearerAuth()
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProductDto: UpdateProductDto,
    @GetUser() user: User,
  ) {
    return this.productsService.update(id, updateProductDto, user);
  }

  @Delete(':id')
  @Auth(ValidRoles.admin)
  @ApiResponse({
    status: 200,
    description: 'Product deleted',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized. Token related' })
  @ApiResponse({ status: 403, description: 'Forbidden. Token related' })
  @ApiResponse({
    status: 404,
    description: 'Product not found',
  })
  @ApiBearerAuth()
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.remove(id);
  }
}
