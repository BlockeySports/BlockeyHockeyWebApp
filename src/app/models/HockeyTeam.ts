import { HockeyLeague } from './HockeyLeague';
import { HockeyUniform } from './HockeyUniform';

export class HockeyTeam {
    id?: string;
    name?: string;
    location?: string;
    code?: string;
    league?: HockeyLeague;
    primaryColor?: string;
    secondaryColor?: string;
    date?: Date;
    isArchived?: boolean;
    uniforms?: HockeyUniform[];
}
