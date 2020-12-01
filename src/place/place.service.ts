import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePlaceInput, CreatePlaceOutput } from './dto/create-place.dto';
import { DeletePlaceInput, DeletePlaceOutput } from './dto/delete-place.dto';
import { EditPlaceInput, EditPlaceOutput } from './dto/edit-place.dto';
import { PlaceDetailInput, PlaceDetailOutput } from './dto/place-detail.dto';
import {
  ToggleIsAvialableInput,
  ToggleIsAvialableOutput,
} from './dto/toggle-IsAvailable.dto';
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

  async toggleIsAvailable({
    id: placeId,
  }: ToggleIsAvialableInput): Promise<ToggleIsAvialableOutput> {
    try {
      const place = await this.placeRepo.findOne({ id: placeId });
      if (!place) {
        return {
          ok: false,
          error: 'Place not found',
        };
      }
      place.isAvailable = !place.isAvailable;
      await this.placeRepo.save(place);
      return {
        ok: true,
        isAvailable: place.isAvailable,
      };
    } catch (error) {
      return {
        ok: false,
        error: 'Unexpected Error',
      };
    }
  }

  async editPlace(editPlaceInput: EditPlaceInput): Promise<EditPlaceOutput> {
    try {
      const place = await this.placeRepo.findOne({
        id: editPlaceInput.placeId,
      });
      if (!place) {
        return {
          ok: false,
          error: 'Place not found',
        };
      }
      await this.placeRepo.save([
        { id: editPlaceInput.placeId, ...editPlaceInput },
      ]);

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

  async deletePlace({ placeId }: DeletePlaceInput): Promise<DeletePlaceOutput> {
    try {
      const place = await this.placeRepo.findOne({
        id: placeId,
      });
      if (!place) {
        return {
          ok: false,
          error: 'Place not found',
        };
      }
      if (place.inUse === true || place.isAvailable === true) {
        return {
          ok: false,
          error: "Check 'inUse' and 'isAvailable' is false",
        };
      }
      await this.placeRepo.delete(placeId);
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

  async placeDetail({ placeId }: PlaceDetailInput): Promise<PlaceDetailOutput> {
    try {
      const place = await this.placeRepo.findOne({
        where: {
          id: placeId,
        },
        relations: ['bookings'],
      });
      if (!place) {
        return {
          ok: false,
          error: 'Place not found',
        };
      }

      return {
        ok: true,
        place,
      };
    } catch (error) {
      return {
        ok: false,
        error: 'Unexpected Error',
      };
    }
  }
}
