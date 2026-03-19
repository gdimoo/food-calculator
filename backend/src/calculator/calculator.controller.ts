import { Controller, Post, Body, HttpException, HttpStatus, Ip } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { CalculatorService } from './calculator.service';
import { RedSetService } from '../red-set/red-set.service';
import { CalculateDto } from './calculator.dto';

@ApiTags('calculator')
@Controller('calculate')
export class CalculatorController {
  constructor(
    private readonly calculatorService: CalculatorService,
    private readonly redSetService: RedSetService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Calculate order total with discounts' })
  @ApiBody({ type: CalculateDto })
  @ApiResponse({
    status: 200,
    description: 'Calculation result with discount breakdown',
    schema: {
      example: {
        totalBeforeDiscount: 290,
        pairDiscounts: [{ productId: 'orange', pairs: 1, discountAmount: 12 }],
        totalPairDiscount: 12,
        memberCardDiscount: 27.8,
        finalTotal: 250.2,
      },
    },
  })
  @ApiResponse({
    status: 429,
    description: 'Red Set already ordered within the hour',
    schema: { example: { message: 'Red Set can only be ordered once per hour', minutesRemaining: 42 } },
  })
  calculate(@Body() dto: CalculateDto, @Ip() ip: string) {
    const hasRedSet = dto.items.some((item) => item.productId === 'red');
    if (hasRedSet) {
      if (!this.redSetService.canOrder(ip)) {
        throw new HttpException(
          {
            message: 'Red Set can only be ordered once per hour',
            minutesRemaining: this.redSetService.minutesRemaining(ip),
          },
          HttpStatus.TOO_MANY_REQUESTS,
        );
      }
      this.redSetService.recordOrder(ip);
    }

    return this.calculatorService.calculate(dto);
  }
}
