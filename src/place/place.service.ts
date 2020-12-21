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
import {
  LocationDetailInput,
  LocationDetailOutput,
} from './dto/location-detail.dto';
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

  private async findPlaceAndLocation(
    locationId: number,
    placeId: number,
  ): Promise<{
    error?: string;
    place?: Place;
    placeLocation?: PlaceLocation;
  }> {
    const placeLocation = await this.locationRepo.findOne({
      id: locationId,
    });
    if (!placeLocation) {
      return { error: 'Location not found' };
    }
    const place = await this.placeRepo.findOne({
      id: placeId,
      placeLocation,
    });
    if (!place) {
      return { error: 'Place not found' };
    }
    return { placeLocation, place };
  }

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

  async editPlace({
    placeName,
    inUse,
    placeId,
    locationId,
  }: EditPlaceInput): Promise<EditPlaceOutput> {
    try {
      const { placeLocation, place, error } = await this.findPlaceAndLocation(
        locationId,
        placeId,
      );
      if (error) {
        return {
          ok: false,
          error,
        };
      }
      const existPlaceName = await this.placeRepo.findOne({
        placeName,
        placeLocation,
      });
      if (existPlaceName) {
        if (existPlaceName.id === place.id) {
          return {
            ok: false,
            error: 'Same place name',
          };
        }
        return {
          ok: false,
          error: 'Already exist place name',
        };
      }
      await this.placeRepo.save([{ ...place, inUse, placeName }]);
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
      const { error, place } = await this.findPlaceAndLocation(
        locationId,
        placeId,
      );
      if (error) {
        return {
          ok: false,
          error,
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

  async locationDetail({
    locationId,
  }: LocationDetailInput): Promise<LocationDetailOutput> {
    try {
      const location = await this.locationRepo.findOne({
        where: {
          id: locationId,
        },
        relations: ['places'],
      });
      if (!location) {
        return {
          ok: false,
          error: 'Location not found',
        };
      }
      return {
        ok: true,
        location,
      };
    } catch (error) {
      return {
        ok: false,
        error: 'Unexpected Error',
      };
    }
  }
}
