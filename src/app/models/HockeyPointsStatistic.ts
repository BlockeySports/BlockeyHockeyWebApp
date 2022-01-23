import { HockeyAdvantageType } from './HockeyAdvantageType';

export class HockeyPointsStatistic {
    advantage?: HockeyAdvantageType;
    goals?: number;
    primaryAssists?: number;
    secondaryAssists?: number;
    ownGoals?: number;
    overtimeGoals?: number;
    gameTyingGoals?: number;
    gameWinningGoals?: number;
    emptyNetGoals?: number;
}
