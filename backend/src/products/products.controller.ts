import { Controller, Get } from '@nestjs/common';
import { ProductsService } from './products.service';
import { Product } from './products.data';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  findAll(): Product[] {
    return this.productsService.findAll();
  }
}
