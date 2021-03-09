import { CoreOutput } from 'src/common/dto/common.dto';
import { Place } from '../entity/place.entity';
declare const EditPlaceInput_base: import("@nestjs/common").Type<Partial<Pick<Place, "id" | "createdAt" | "updatedAt" | "bookings" | "isAvailable" | "placeName" | "placeNameSlug" | "placeLocation" | "inUse">>>;
export declare class EditPlaceInput extends EditPlaceInput_base {
    placeId: number;
    locationId: number;
}
export declare class EditPlaceOutput extends CoreOutput {
}
export {};
