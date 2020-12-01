import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CreateLocationInput,
  CreateLocationOutput,
} from './dto/create-loaction.dto';
import { CreatePlaceInput, CreatePlaceOutput } from './dto/create-place.dto';
import { DeletePlaceInput, DeletePlaceOutput } from './dto/delete-place.dto';
import { EditPlaceInput, EditPlaceOutput } from './dto/edit-place.dto';
import { PlaceDetailInput, PlaceDetailOutput } from './dto/place-detail.dto';
import {
  ToggleIsAvialableInput,
  ToggleIsAvialableOutput,
} from './dto/toggle-IsAvailable.dto';
import { PlaceLocation } from './entity/location.entity';
import { Place } from './entity/place.entity';

@Injectable()
export class PlaceService {
  constructor(
    @InjectRepository(Place) private readonly placeRepo: Repository<Place>,
    @InjectRepository(PlaceLocation)
    private readonly locationRepo: Repository<PlaceLocation>,
  ) {}

  async createPlace({
    placeName,
    locationId,
  }: CreatePlaceInput): Promise<CreatePlaceOutput> {
    try {
      const placeLocation = await this.locationRepo.findOne({ id: locationId });
      if (!placeLocation) {
        return {
          ok: false,
          error: 'Location not found',
        };
      }
      const exist = await this.placeRepo.findOne({
        placeName,
        placeLocation,
      });
      if (exist) {
        return {
          ok: false,
          error: 'Already place exist',
        };
      }
      await this.placeRepo.save(
        this.placeRepo.create({ placeName, placeLocation }),
      );
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
      const placeLocation = await this.locationRepo.findOne({
        id: editPlaceInput.locationId,
      });
      if (!placeLocation) {
        return {
          ok: false,
          error: 'Location not found',
        };
      }
      const place = await this.placeRepo.findOne({
        id: editPlaceInput.placeId,
        placeLocation,
      });
      if (!place) {
        return {
          ok: false,
          error: 'Place not found',
        };
      }
      await this.placeRepo.save([
        { id: editPlaceInput.placeId, placeLocation, ...editPlaceInput },
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

  async deletePlace({
    placeId,
    locationId,
  }: DeletePlaceInput): Promise<DeletePlaceOutput> {
    try {
      const placeLocation = await this.locationRepo.findOne({
        id: locationId,
      });
      if (!placeLocation) {
        return {
          ok: false,
          error: 'Location not found',
        };
      }
      const place = await this.placeRepo.findOne({
        id: placeId,
        placeLocation,
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
        relations: ['bookings', 'placeLocation'],
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

  async createLocation({
    locationName,
  }: CreateLocationInput): Promise<CreateLocationOutput> {
    try {
      const exist = await this.locationRepo.findOne({ locationName });
      if (exist) {
        return {
          ok: false,
          error: 'Already location exist',
        };
      }
      await this.locationRepo.save(this.locationRepo.create({ locationName }));
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
