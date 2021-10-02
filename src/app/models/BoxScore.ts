import { BoxScoreGoal } from './BoxScoreGoal';
import { BoxScorePlayer } from './BoxScorePlayer';
import { BoxScoreShootoutAttempt } from './BoxScoreShootoutAttempt';
import { HockeyTeam } from './HockeyTeam';

export class BoxScore {
    id?: string;                                        // the unique id for this box score
    streamLink?: string;                                // link to the livestream of the game (null if not streamed)
    date?: Date;                                        // start time of the game
    rink?: string;                                      // the rink/arena the game was played at
    scorer?: string;                                    // the member or AI that filled this box score out
    officials?: string[];                               // the official(s) or AI that officiated the game
    awayTeam?: HockeyTeam;                              // the visiting team in the game
    homeTeam?: HockeyTeam;                              // the home team in the game
    duration?: number;                                  // the duration of the game in milliseconds (from faceoff drop to end)

    isPreseason?: boolean;                              // true if the game is a pre-season game
    isRegularSeason?: boolean;                          // true if the game is a regular season game
    isPostseason?: boolean;                             // true if the game is a post-season game

    isLeaguePlay?: boolean;                             // true if the game is a league game
    isTournamentPlay?: boolean;                         // true if the game is a part of a tournament
    league?: string;                                    // the name of the league the game is in
    season?: string;                                    // the name of the season the game is in
    tournament?: string;                                // the name of the tournament the game is in

    isSeries?: boolean;                                 // true if this game is a part of a series
    seriesID?: string;                                  // the id shared by all games in the same series
    gameNumber?: number;                                // the number of the game in a series (i.e. Game 7)
    roundNumber?: number;                               // the number of the round in the playoffs (i.e. Round 2)

    isTesting?: boolean;                                // true if the creating during testing

    awayPlayers?: BoxScorePlayer[];                     // players that played for the away team in the game
    awayDressed?: BoxScorePlayer[];                     // players that dressed for the away team (did not necessarily play)
    awayPlayerCount?: number;                           // the number of players on the away team
    homePlayers?: BoxScorePlayer[];                     // players that played for the home team in the game
    homeDressed?: BoxScorePlayer[];                     // players that dressed for the home team (did not necessarily play)
    homePlayerCount?: number;                           // the number of players on the home team

    goals?: BoxScoreGoal[];                             // all goals scored during the game
    shootoutAttempts?: BoxScoreShootoutAttempt[];       // shootout attempts (empty if none)
}
