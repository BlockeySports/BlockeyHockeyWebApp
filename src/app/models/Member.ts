import { Role } from './Role';

export class Member {
    uuid?: string;
    username?: string;
    dateJoined?: Date;
    joinPosition?: number;
    online?: boolean;
    lastOnline?: Date;
    timePlayed?: number;
    millisAtJoin?: number;
    roles?: Role[];
    og?: boolean;
}
