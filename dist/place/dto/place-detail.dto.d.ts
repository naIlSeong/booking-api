import { CoreOutput } from 'src/common/dto/common.dto';
import { Place } from '../entity/place.entity';
export declare class PlaceDetailInput {
    placeId: number;
}
export declare class PlaceDetailOutput extends CoreOutput {
    place?: Place;
}
