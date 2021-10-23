import { HockeyTeam } from './HockeyTeam';

export class MiniBoxScore {
    id?: string;
    streamLink?: string;
    date?: Date;
    awayTeam?: HockeyTeam;
    homeTeam?: HockeyTeam;
    firstPeriodAwayGoals?: number;
    secondPeriodAwayGoals?: number;
    thirdPeriodAwayGoals?: number;
    overtimeAwayGoals?: number;
    firstPeriodHomeGoals?: number;
    secondPeriodHomeGoals?: number;
    thirdPeriodHomeGoals?: number;
    overtimeHomeGoals?: number;
    league?: string;
    isTesting?: boolean;
}
