import { CoreOutput } from 'src/common/dto/common.dto';
import { PlaceLocation } from '../entity/location.entity';
declare const CreateLocationInput_base: import("@nestjs/common").Type<Pick<PlaceLocation, "locationName">>;
export declare class CreateLocationInput extends CreateLocationInput_base {
}
export declare class CreateLocationOutput extends CoreOutput {
}
export {};
