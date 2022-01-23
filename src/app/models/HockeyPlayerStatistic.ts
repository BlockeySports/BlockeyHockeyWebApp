import { HockeyPointsStatistic } from './HockeyPointsStatistic';
import { HockeyStatisticFilter } from './HockeyStatisticFilter';
import { HockeyStreakType } from './HockeyStreakType';
import { HockeyTurnover } from './HockeyTurnover';
import { Member } from './Member';

export class HockeyPlayerStatistic {
    member?: Member;
    filter?: HockeyStatisticFilter;
    gamesPlayed?: number;
    wins?: number;
    losses?: number;
    draws?: number;
    overtimeWins?: number;
    overtimeLosses?: number;
    shootoutWins?: number;
    shootoutLosses?: number;
    points?: HockeyPointsStatistic[];
    plusMinus?: number;
    penaltyMinutes?: number;
    penaltyMinutesDrawn?: number;
    streak?: number;
    streakType?: HockeyStreakType;
    timeOnIce?: number;
    shifts?: number;
    shotsOnGoal?: number;
    missedShots?: number;
    attemptsBlocked?: number;
    blockedShots?: number;
    saves?: number;
    turnovers?: HockeyTurnover[];
    hits?: number;
    hitsTaken?: number;
    faceoffsTaken?: number;
    faceoffsWon?: number;
    faceoffsLost?: number;
    puckPossessionTime?: number;
    puckTouches?: number;
    fights?: number;
    fightsWon?: number;
    fightsLost?: number;
}
