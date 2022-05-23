import { HockeyAdvantageType } from './HockeyAdvantageType';
import { HockeyTurnoverType } from './HockeyTurnoverType';
import { HockeyZoneType } from './HockeyZoneType';

export class HockeyTurnoversStatistic {
    turnoverType?: HockeyTurnoverType;
    zone?: HockeyZoneType;
    advantage?: HockeyAdvantageType;
    turnovers?: number;
    turnoversAgainst?: number;
}
