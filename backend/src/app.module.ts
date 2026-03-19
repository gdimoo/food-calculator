import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { CalculatorModule } from './calculator/calculator.module';

@Module({
  imports: [ProductsModule, CalculatorModule],
})
export class AppModule {}
