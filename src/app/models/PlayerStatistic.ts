import { HockeyTeam } from './HockeyTeam';

export class PlayerStatistic {
    boxScoreId?: string;
    team?: string;
    goalScorer?: string;            // uuid of player (not member object)
    primaryAssistant?: string;      // uuid of player (not member object)
    secondaryAssistant?: string;    // uuid of player (not member object)
    ownGoalScorer?: string;         // uuid of player (not member object)
    period?: number;
    isPowerPlay?: boolean;
    isExtraAttacker?: boolean;
    isPenaltyKill?: boolean;
    isShortHanded?: boolean;
    isEmptyNet?: boolean;
    isPenaltyShot?: boolean;
    isOwnGoal?: boolean;
    date?: Date;
    streamLink?: string;
    rink?: string;
    awayTeam?: number;              // id of the away team
    homeTeam?: number;              // id of the home team
    winningTeam?: string;
    isPreseason?: boolean;
    isRegularSeason?: boolean;
    isPostseason?: boolean;
    isLeaguePlay?: boolean;
    isTournamentPlay?: boolean;
    league?: string;
    season?: string;
    tournament?: string;
    isTesting?: boolean;
}
