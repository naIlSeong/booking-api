import { CoreOutput } from 'src/common/dto/common.dto';
import { Place } from '../entity/place.entity';
export declare class GetAvailablePlaceInput {
    locationId: number;
}
export declare class GetAvailablePlaceOutput extends CoreOutput {
    places?: Place[];
}
