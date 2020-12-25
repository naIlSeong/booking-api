import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Role } from 'src/auth/role.decorator';
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
import {
  ToggleIsAvialableInput,
  ToggleIsAvialableOutput,
} from './dto/toggle-IsAvailable.dto';
import { PlaceLocation } from './entity/location.entity';
import { Place } from './entity/place.entity';
import { PlaceService } from './place.service';

@Resolver((of) => Place)
export class PlaceResolver {
  constructor(private readonly placeService: PlaceService) {}

  @Mutation((returns) => CreatePlaceOutput)
  @Role(['Admin'])
  createPlace(
    @Args('input') createPlaceInput: CreatePlaceInput,
  ): Promise<CreatePlaceOutput> {
    return this.placeService.createPlace(createPlaceInput);
  }

  @Mutation((returns) => ToggleIsAvialableOutput)
  @Role(['Admin'])
  toggleIsAvailable(
    @Args('input') toggleIsAvailableInput: ToggleIsAvialableInput,
  ): Promise<ToggleIsAvialableOutput> {
    return this.placeService.toggleIsAvailable(toggleIsAvailableInput);
  }

  @Mutation((returns) => EditPlaceOutput)
  @Role(['Admin'])
  editPlace(
    @Args('input') editPlaceInput: EditPlaceInput,
  ): Promise<ToggleIsAvialableOutput> {
    return this.placeService.editPlace(editPlaceInput);
  }

  @Mutation((returns) => DeletePlaceOutput)
  @Role(['Admin'])
  deletePlace(
    @Args('input') deletePlaceInput: DeletePlaceInput,
  ): Promise<DeletePlaceOutput> {
    return this.placeService.deletePlace(deletePlaceInput);
  }

  @Query((returns) => PlaceDetailOutput)
  @Role(['Any'])
  placeDetail(
    @Args('input') placeDetailInput: PlaceDetailInput,
  ): Promise<PlaceDetailOutput> {
    return this.placeService.placeDetail(placeDetailInput);
  }

  @Query((returns) => GetAvailablePlaceOutput)
  @Role(['Any'])
  getAvailablePlace(
    @Args('input') getAvailablePlaceInput: GetAvailablePlaceInput,
  ): Promise<GetAvailablePlaceOutput> {
    return this.placeService.getAvailablePlace(getAvailablePlaceInput);
  }
}

@Resolver((of) => PlaceLocation)
export class LocationResolver {
  constructor(private readonly placeService: PlaceService) {}

  @Mutation((returns) => CreateLocationOutput)
  @Role(['Admin'])
  createLocation(
    @Args('input') createLocationInput: CreateLocationInput,
  ): Promise<CreateLocationOutput> {
    return this.placeService.createLocation(createLocationInput);
  }

  @Query((returns) => LocationDetailOutput)
  @Role(['Any'])
  locationDetail(
    @Args('input') locationDetailInput: LocationDetailInput,
  ): Promise<LocationDetailOutput> {
    return this.placeService.locationDetail(locationDetailInput);
  }

  @Query((returns) => GetLocationOutput)
  @Role(['Any'])
  getLocation(): Promise<GetLocationOutput> {
    return this.placeService.getLocation();
  }
}
