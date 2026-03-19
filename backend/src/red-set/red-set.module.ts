import { Module } from '@nestjs/common';
import { RedSetService } from './red-set.service';

@Module({
  providers: [RedSetService],
  exports: [RedSetService],
})
export class RedSetModule {}
