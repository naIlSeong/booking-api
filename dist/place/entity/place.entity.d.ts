import { CoreEntity } from 'src/common/entity/common.entity';
import { Booking } from '../../booking/entity/booking.entity';
import { PlaceLocation } from './location.entity';
export declare class Place extends CoreEntity {
    placeName: string;
    placeNameSlug: string;
    placeLocation: PlaceLocation;
    bookings?: Booking[];
    inUse: boolean;
    isAvailable: boolean;
}
