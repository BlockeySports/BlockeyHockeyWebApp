import { HockeyStatistic } from './HockeyStatistic';
import { Punishment } from './Punishment';
import { Role } from './Role';

export class Member {
    uuid?: string;              // the UUID of the Minecraft player
    username?: string;          // the Minecraft player's username
    number?: number;            // the member's jersey number
    position?: string;          // the hockey ice position
    dateJoined?: Date;          // the date on which this player first joined the server
    joinPosition?: number;      // the position that they joined in
    isOnline?: boolean;         // true if the player is online the server
    lastOnline?: Date;          // the date on which this player was last seen on the server
    timePlayed?: number;        // the number of milliseconds this player has played on the server
    roles?: Role[];             // the roles and ranks this player has
    isOg?: boolean;             // true if this player is an OG player
    punishments?: Punishment[]; // the list of punishments this member has
    hockeyStatistics?: HockeyStatistic[];
}
