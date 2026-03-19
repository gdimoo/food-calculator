import { IsArray, IsOptional, IsString, IsNumber, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class OrderItemDto {
  @ApiProperty({ example: 'orange', description: 'Product ID' })
  @IsString()
  productId: string;

  @ApiProperty({ example: 2, description: 'Quantity (minimum 1)', minimum: 1 })
  @IsNumber()
  @Min(1)
  quantity: number;
}

export class CalculateDto {
  @ApiProperty({ type: [OrderItemDto], description: 'List of items to order' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @ApiProperty({ example: 'VIP001', description: 'Member card number for 10% discount', required: false })
  @IsOptional()
  @IsString()
  memberCardNumber?: string;
}
