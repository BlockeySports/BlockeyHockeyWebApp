import { HockeyUniform } from './HockeyUniform';

export class HockeyTeam {
    id?: number;
    name?: string;
    location?: string;
    code?: string;
    color?: string;
    active?: boolean;
    uniforms?: HockeyUniform[];
}
