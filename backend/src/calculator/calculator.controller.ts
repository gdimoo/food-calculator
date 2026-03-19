import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
  Ip,
} from '@nestjs/common';
import { CalculatorService } from './calculator.service';
import { RedSetService } from '../red-set/red-set.service';
import { CalculateDto } from './calculator.dto';

@Controller('calculate')
export class CalculatorController {
  constructor(
    private readonly calculatorService: CalculatorService,
    private readonly redSetService: RedSetService,
  ) {}

  @Post()
  calculate(@Body() dto: CalculateDto, @Ip() ip: string) {
    // Check Red Set restriction
    const hasRedSet = dto.items.some((item) => item.productId === 'red');
    if (hasRedSet) {
      if (!this.redSetService.canOrder(ip)) {
        throw new HttpException(
          'Red Set can only be ordered once per hour per customer',
          HttpStatus.TOO_MANY_REQUESTS,
        );
      }
      this.redSetService.recordOrder(ip);
    }

    return this.calculatorService.calculate(dto);
  }
}
