import { HockeyTeam } from './HockeyTeam';

export class HockeyUniform {
    id?: string;
    team?: HockeyTeam;
    type?: string;
    description?: string;
    helmet?: string;
    jersey?: string;
    pants?: string;
    skates?: string;
    date?: Date;
    isArchived?: boolean;
}
