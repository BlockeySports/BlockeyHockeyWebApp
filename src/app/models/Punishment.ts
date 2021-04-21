import { Member } from './Member';

export class Punishment {
    id?: string;
    punished?: Member;
    type?: string;
    reason?: string;
    punisher?: Member;
    date?: Date;
    length?: number;
}
