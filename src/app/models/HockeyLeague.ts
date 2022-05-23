import { HockeySeason } from './HockeySeason';

export class HockeyLeague {
    id?: string;
    name?: string;
    code?: string;
    description?: string;
    date?: Date;
    isArcade?: boolean;
    isArchived?: boolean;
    seasons?: HockeySeason[];
}
