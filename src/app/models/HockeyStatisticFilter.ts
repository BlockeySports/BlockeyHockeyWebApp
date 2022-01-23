import { BoxScore } from './BoxScore';
import { DevelopmentPhase } from './DevelopmentPhase';
import { HockeyLeague } from './HockeyLeague';
import { HockeyPosition } from './HockeyPosition';
import { HockeySeason } from './HockeySeason';
import { HockeySeasonType } from './HockeySeasonType';
import { HockeySeries } from './HockeySeries';
import { HockeyTeam } from './HockeyTeam';
import { HockeyTournament } from './HockeyTournament';

export class HockeyStatisticFilter {

    boxScore?: BoxScore;
    league?: HockeyLeague;
    season?: HockeySeason;
    seasonType?: HockeySeasonType;
    tournament?: HockeyTournament;
    series?: HockeySeries;
    developmentPhase?: DevelopmentPhase;
    teamType?: string;
    team?: HockeyTeam;
    hockeyPosition?: HockeyPosition;
}
