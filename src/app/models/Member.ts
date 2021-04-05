import { Role } from './Role';

export class Member {
    uuid?: string;
    username?: string;
    dateJoined?: string;
    joinPosition?: number;
    isOnline?: boolean;
    lastOnline?: Date;
    timePlayed?: number;
    millisAtJoin?: number;
    roles?: Role[];
    og?: boolean;
}
