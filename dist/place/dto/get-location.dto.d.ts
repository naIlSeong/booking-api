import { CoreOutput } from 'src/common/dto/common.dto';
import { PlaceLocation } from '../entity/location.entity';
export declare class GetLocationOutput extends CoreOutput {
    locations?: PlaceLocation[];
}
