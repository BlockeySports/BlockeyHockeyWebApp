import { HockeyUniform } from './HockeyUniform';

export class HockeyTeam {
    name?: string;
    location?: string;
    code?: string;
    iteration?: number;
    color?: string;
    active?: boolean;
    uniforms?: HockeyUniform[];
}
