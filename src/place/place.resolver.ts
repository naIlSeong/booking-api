import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Role } from 'src/auth/role.decorator';
import { CreatePlaceInput, CreatePlaceOutput } from './dto/create-place.dto';
import { EditPlaceInput, EditPlaceOutput } from './dto/edit-place.dto';
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
}
