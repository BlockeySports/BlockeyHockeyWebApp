import { Role } from './Role';

export class Member {
    uuid?: string;
    username?: string;
    dateJoined?: string | Date;
    joinPosition?: number;
    online?: boolean;
    lastOnline?: string | Date;
    timePlayed?: number;
    millisAtJoin?: number;
    roles?: Role[];
    og?: boolean;
}
