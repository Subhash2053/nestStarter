import { Module } from '@nestjs/common';
import { SocialsService } from './socials.service';

@Module({
  providers: [SocialsService]
})
export class SocialsModule {}
