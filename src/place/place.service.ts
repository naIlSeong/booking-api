import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Raw, Repository } from 'typeorm';
import {
  CreateLocationInput,
  CreateLocationOutput,
} from './dto/create-loaction.dto';
import { CreatePlaceInput, CreatePlaceOutput } from './dto/create-place.dto';
import { DeletePlaceInput, DeletePlaceOutput } from './dto/delete-place.dto';
import { EditPlaceInput, EditPlaceOutput } from './dto/edit-place.dto';
import {
  GetAvailablePlaceInput,
  GetAvailablePlaceOutput,
} from './dto/get-available-place.dto';
import { GetLocationOutput } from './dto/get-location.dto';
import {
  LocationDetailInput,
  LocationDetailOutput,
} from './dto/location-detail.dto';
import { PlaceDetailInput, PlaceDetailOutput } from './dto/place-detail.dto';
import { SearchPlaceInput, SearchPlaceOutput } from './dto/search-place.dto';
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

  private generateSlug(placeName: string): string {
    return placeName.trim().toLowerCase().replace(/ /g, '-');
  }

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
      const placeNameSlug = this.generateSlug(placeName);
      const exist = await this.placeRepo.findOne({
        placeName,
        placeLocation,
      });
      const existSlug = await this.placeRepo.findOne({
        placeNameSlug,
        placeLocation,
      });
      if (exist || existSlug) {
        return {
          ok: false,
          error: 'Already place exist',
        };
      }
      await this.placeRepo.save(
        this.placeRepo.create({ placeName, placeNameSlug, placeLocation }),
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
      const placeNameSlug = this.generateSlug(placeName);
      const existPlaceNameSlug = await this.placeRepo.findOne({
        placeNameSlug,
        placeLocation,
      });
      const existPlaceName = await this.placeRepo.findOne({
        placeName,
        placeLocation,
      });
      if (existPlaceName || existPlaceNameSlug) {
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
      await this.placeRepo.save([
        { ...place, inUse, placeName, placeNameSlug },
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
      const locationNameSlug = this.generateSlug(locationName);
      const existSlug = await this.locationRepo.findOne({ locationNameSlug });
      const exist = await this.locationRepo.findOne({ locationName });
      if (exist || existSlug) {
        return {
          ok: false,
          error: 'Already location exist',
        };
      }
      await this.locationRepo.save(
        this.locationRepo.create({ locationName, locationNameSlug }),
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

  async getLocation(): Promise<GetLocationOutput> {
    try {
      const locations = await this.locationRepo.find({
        where: { isAvailable: true },
        relations: ['places'],
      });
      const availableLocation: PlaceLocation[] = [];

      locations.forEach((location) => {
        if (location.places.length !== 0) {
          availableLocation.push(location);
        }
      });

      return {
        ok: true,
        locations: availableLocation,
      };
    } catch (error) {
      return {
        ok: false,
        error: 'Unexpected Error',
      };
    }
  }

  async getAvailablePlace({
    locationId,
  }: GetAvailablePlaceInput): Promise<GetAvailablePlaceOutput> {
    try {
      const places = await this.placeRepo.find({
        placeLocation: { id: locationId },
        isAvailable: true,
      });
      if (!places) {
        return {
          ok: false,
          error: 'Place not found',
        };
      }
      if (places.length === 0) {
        return {
          ok: false,
          error: 'Available place not found',
        };
      }
      return {
        ok: true,
        places,
      };
    } catch (error) {
      return {
        ok: false,
        error: 'Unexpected Error',
      };
    }
  }

  async searchPlace({ query }: SearchPlaceInput): Promise<SearchPlaceOutput> {
    try {
      const querySlug = this.generateSlug(query);
      const places = await this.placeRepo.find({
        where: {
          placeNameSlug: Raw(
            (placeNameSlug) => `${placeNameSlug} ILIKE '%${querySlug}%'`,
          ),
        },
      });
      if (!places) {
        return {
          ok: false,
          error: 'Place not found',
        };
      }
      return {
        ok: true,
        places,
      };
    } catch (error) {
      return {
        ok: false,
        error: 'Unexpected Error',
      };
    }
  }
}
