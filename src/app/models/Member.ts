import { HockeyPosition } from './HockeyPosition';
import { HockeyStickColor } from './HockeyStickColor';
import { Punishment } from './Punishment';
import { Role } from './Role';

export class Member {
    uuid?: string;
    username?: string;
    number?: number;
    position?: HockeyPosition;
    stick?: HockeyStickColor;
    dateJoined?: Date;
    joinPosition?: number;
    timePlayed?: number;
    lastOnline?: Date;
    lastJoin?: Date;
    isOnline?: boolean;
    isOg?: boolean;
    logins?: number;
    roles?: Role[];
    punishments?: Punishment[];
}
