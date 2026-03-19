import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { Product } from './products.data';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all available products' })
  @ApiResponse({
    status: 200,
    description: 'List of all products',
    schema: {
      example: [
        { id: 'orange', name: 'Orange Set', price: 120, isPairDiscountEligible: true },
        { id: 'pink',   name: 'Pink Set',   price: 80,  isPairDiscountEligible: true },
      ],
    },
  })
  findAll(): Product[] {
    return this.productsService.findAll();
  }
}
