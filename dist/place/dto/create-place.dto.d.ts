import { CoreOutput } from 'src/common/dto/common.dto';
import { Place } from '../entity/place.entity';
declare const CreatePlaceInput_base: import("@nestjs/common").Type<Pick<Place, "placeName">>;
export declare class CreatePlaceInput extends CreatePlaceInput_base {
    locationId: number;
}
export declare class CreatePlaceOutput extends CoreOutput {
}
export {};
