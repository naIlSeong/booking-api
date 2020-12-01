import { Module } from '@nestjs/common';
import { PlaceService } from './place.service';
import { PlaceResolver } from './place.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Place } from './entity/place.entity';
import { PlaceLocation } from './entity/location.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Place, PlaceLocation])],
  providers: [PlaceService, PlaceResolver],
})
export class PlaceModule {}
