import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Role } from 'src/auth/role.decorator';
import { CreatePlaceInput, CreatePlaceOutput } from './dto/create-place.dto';
import { DeletePlaceInput, DeletePlaceOutput } from './dto/delete-place.dto';
import { EditPlaceInput, EditPlaceOutput } from './dto/edit-place.dto';
import { PlaceDetailInput, PlaceDetailOutput } from './dto/place-detail.dto';
import {
  ToggleIsAvialableInput,
  ToggleIsAvialableOutput,
} from './dto/toggle-IsAvailable.dto';
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
}
