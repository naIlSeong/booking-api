import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePlaceInput, CreatePlaceOutput } from './dto/create-place.dto';
import { Place } from './entity/place.entity';

@Injectable()
export class PlaceService {
  constructor(
    @InjectRepository(Place) private readonly placeRepo: Repository<Place>,
  ) {}

  async createPlace(
    createPlaceInput: CreatePlaceInput,
  ): Promise<CreatePlaceOutput> {
    try {
      const exist = await this.placeRepo.findOne({
        placeName: createPlaceInput.placeName,
        placeLocation: createPlaceInput.placeLocation,
      });
      if (exist) {
        return {
          ok: false,
          error: 'Already place exist',
        };
      }
      await this.placeRepo.save(this.placeRepo.create({ ...createPlaceInput }));
      return {
        ok: true,
      };
    } catch (error) {
      return {
        ok: false,
        error: 'Unexpected Error',
      };
    }
  }
}
