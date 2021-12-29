import { HockeyLeague } from './HockeyLeague';
import { HockeyUniform } from './HockeyUniform';

export class HockeyTeam {
    name?: string;
    location?: string;
    code?: string;
    iteration?: number;
    league?: HockeyLeague;
    color?: string;
    active?: boolean;
    uniforms?: HockeyUniform[];
}
