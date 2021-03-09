import { CoreOutput } from 'src/common/dto/common.dto';
import { Place } from '../entity/place.entity';
declare const ToggleIsAvialableInput_base: import("@nestjs/common").Type<Pick<Place, "id">>;
export declare class ToggleIsAvialableInput extends ToggleIsAvialableInput_base {
}
export declare class ToggleIsAvialableOutput extends CoreOutput {
    isAvailable?: boolean;
}
export {};
