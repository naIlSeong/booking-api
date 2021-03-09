import { CoreEntity } from 'src/common/entity/common.entity';
import { Team } from 'src/team/entity/team.entity';
import { User } from 'src/user/entity/user.entity';
import { Place } from '../../place/entity/place.entity';
export declare class Booking extends CoreEntity {
    place: Place;
    team?: Team;
    creator: User;
    creatorId: number;
    startAt: Date;
    endAt: Date;
    inUse: boolean;
    isFinished: boolean;
    canExtend: boolean;
    checkDate(): void;
}
