import { CreateLocationInput, CreateLocationOutput } from './dto/create-loaction.dto';
import { CreatePlaceInput, CreatePlaceOutput } from './dto/create-place.dto';
import { DeletePlaceInput, DeletePlaceOutput } from './dto/delete-place.dto';
import { EditPlaceInput } from './dto/edit-place.dto';
import { GetAvailablePlaceInput, GetAvailablePlaceOutput } from './dto/get-available-place.dto';
import { GetLocationOutput } from './dto/get-location.dto';
import { LocationDetailInput, LocationDetailOutput } from './dto/location-detail.dto';
import { PlaceDetailInput, PlaceDetailOutput } from './dto/place-detail.dto';
import { SearchPlaceInput, SearchPlaceOutput } from './dto/search-place.dto';
import { ToggleIsAvialableInput, ToggleIsAvialableOutput } from './dto/toggle-IsAvailable.dto';
import { PlaceService } from './place.service';
export declare class PlaceResolver {
    private readonly placeService;
    constructor(placeService: PlaceService);
    createPlace(createPlaceInput: CreatePlaceInput): Promise<CreatePlaceOutput>;
    toggleIsAvailable(toggleIsAvailableInput: ToggleIsAvialableInput): Promise<ToggleIsAvialableOutput>;
    editPlace(editPlaceInput: EditPlaceInput): Promise<ToggleIsAvialableOutput>;
    deletePlace(deletePlaceInput: DeletePlaceInput): Promise<DeletePlaceOutput>;
    placeDetail(placeDetailInput: PlaceDetailInput): Promise<PlaceDetailOutput>;
    getAvailablePlace(getAvailablePlaceInput: GetAvailablePlaceInput): Promise<GetAvailablePlaceOutput>;
    searchPlace(searchPlaceInput: SearchPlaceInput): Promise<SearchPlaceOutput>;
}
export declare class LocationResolver {
    private readonly placeService;
    constructor(placeService: PlaceService);
    createLocation(createLocationInput: CreateLocationInput): Promise<CreateLocationOutput>;
    locationDetail(locationDetailInput: LocationDetailInput): Promise<LocationDetailOutput>;
    getLocation(): Promise<GetLocationOutput>;
}
