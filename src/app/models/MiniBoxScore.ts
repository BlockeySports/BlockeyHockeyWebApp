import { DevelopmentPhase } from './DevelopmentPhase';
import { HockeyLeague } from './HockeyLeague';
import { HockeyPeriodSummary } from './HockeyPeriodSummary';
import { HockeyTeam } from './HockeyTeam';

export class MiniBoxScore {
  id?: string;
  stream?: string;
  date?: Date;
  awayTeam?: HockeyTeam;
  homeTeam?: HockeyTeam;
  league?: HockeyLeague;
  isArcade?: boolean;
  developmentPhase?: DevelopmentPhase;
  periodSummaries?: HockeyPeriodSummary[];
}
