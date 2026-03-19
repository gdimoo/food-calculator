import { Module } from '@nestjs/common';
import { CalculatorController } from './calculator.controller';
import { CalculatorService } from './calculator.service';
import { RedSetModule } from '../red-set/red-set.module';

@Module({
  imports: [RedSetModule],
  controllers: [CalculatorController],
  providers: [CalculatorService],
})
export class CalculatorModule {}
