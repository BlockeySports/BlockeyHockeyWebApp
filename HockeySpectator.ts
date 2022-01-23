import { BoxScore } from 'src/app/models/BoxScore';
import { Member } from 'src/app/models/Member';

export class HockeySpectator {
    id?: string;
    boxScore?: BoxScore;
    member?: Member;
    start?: Date;
    end?: Date;
    favoriteTeam?: string;
}
