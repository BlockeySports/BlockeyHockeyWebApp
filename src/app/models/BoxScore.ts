import { BoxScoreGoal } from './BoxScoreGoal';
import { BoxScorePlayer } from './BoxScorePlayer';
import { BoxScoreShootoutAttempt } from './BoxScoreShootoutAttempt';
import { HockeyTeam } from './HockeyTeam';

export class BoxScore {
    uuid?: string;                                      // the unique id for this box score
    streamLink?: string;                                // link to the livestream of the game (null if not streamed)
    gameTime?: Date;                                    // start time of the game
    rink?: string;                                      // the rink/arena the game was played at
    scorer?: string;                                    // the member or AI that filled this box score out
    officials?: string[];                               // the official(s) or AI that officiated the game
    awayTeam?: HockeyTeam;                              // the visiting team in the game
    homeTeam?: HockeyTeam;                              // the home team in the game
    duration?: number;                                  // the duration of the game in milliseconds (from faceoff drop to end)

    isSeries?: boolean;                                 // true if this game is a part of a series
    seriesID?: string;                                  // the id shared by all games in the same series
    gameNumber?: number;                                // the number of the game in a series (i.e. Game 7)
    roundNumber?: number;                               // the number of the round in the playoffs (i.e. Round 2)

    awayPlayers?: BoxScorePlayer[];                     // players that played for the away team in the game
    awayDressed?: BoxScorePlayer[];                     // players that dressed for the away team (did not necessarily play)
    homePlayers?: BoxScorePlayer[];                     // players that played for the home team in the game
    homeDressed?: BoxScorePlayer[];                     // players that dressed for the home team (did not necessarily play)

    goals?: BoxScoreGoal[];                             // all goals scored during the game
    shootoutAttempts?: BoxScoreShootoutAttempt[];       // shootout attempts (empty if none)
}
