import { CoreOutput } from 'src/common/dto/common.dto';
import { PlaceLocation } from '../entity/location.entity';
export declare class LocationDetailInput {
    locationId: number;
}
export declare class LocationDetailOutput extends CoreOutput {
    location?: PlaceLocation;
}
