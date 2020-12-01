import { Module } from '@nestjs/common';
import { PlaceService } from './place.service';
import { PlaceResolver } from './place.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Place } from './entity/place.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Place])],
  providers: [PlaceService, PlaceResolver],
})
export class PlaceModule {}
