import { CoreOutput } from 'src/common/dto/common.dto';
import { Place } from '../entity/place.entity';
export declare class SearchPlaceInput {
    query: string;
}
export declare class SearchPlaceOutput extends CoreOutput {
    places?: Place[];
}
