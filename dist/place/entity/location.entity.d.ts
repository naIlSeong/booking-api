import { CoreEntity } from 'src/common/entity/common.entity';
import { Place } from './place.entity';
export declare class PlaceLocation extends CoreEntity {
    places?: Place[];
    locationName: string;
    locationNameSlug: string;
    isAvailable: boolean;
}
