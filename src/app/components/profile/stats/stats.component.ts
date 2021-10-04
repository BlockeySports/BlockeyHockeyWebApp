import { formatDate } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Member } from 'src/app/models/Member';
import { PlayerGamePlayed } from 'src/app/models/PlayerGamePlayed';
import { PlayerStatistic } from 'src/app/models/PlayerStatistic';
import { DateService } from 'src/app/services/date.service';
import dayjs from 'dayjs';

@Component({
    selector: 'app-stats',
    templateUrl: './stats.component.html'
})
export class StatsComponent implements OnInit {

    @Input() member: Member;
    @Input() stats: PlayerStatistic[] = [];
    @Input() gamesPlayed: PlayerGamePlayed[] = [];
    @Input() isError;
    @Input() statisticsText;

    public isLoading = false;

    public leagueTab = null;
    public seasonTab = null;

    constructor(
        private dateService: DateService
    ) { }

    ngOnInit(): void {
        // display loading text
        this.statisticsText = 'Hang tight while we load your statistics.';
    }

    /**
     * Get the amount of hours played per day since joining the server.
     * @returns the hours played per day
     */
    public getHoursPerDay(): number {
        // get days since join date
        const days = dayjs().diff(dayjs(this.member.dateJoined), 'day');
        // if zero days, return 0
        if (days < 1) return 0;
        // convert time played to hours from milliseconds
        const hours = this.member.timePlayed / (1000 * 60 * 60);
        // if less than 1 hour played, return 0
        if (hours < 1) return 0;
        // return hours per day
        return hours / days;
    }

    public changeLeagueTab(tab: string): void {
        // reset season tab if tab is changing
        if (this.leagueTab !== tab) this.changeSeasonTab(null);
        // if switching to arcade, set season to career
        if (tab === 'arcade') { this.changeSeasonTab('career'); }
        // set the league tab
        this.leagueTab = tab || null;
    }

    public changeSeasonTab(tab: string): void {
        this.seasonTab = tab || null;
    }

    /**
     * Get the season types to display statistics for under the league tab.
     * @returns the season types
     */
    public getSeasonTypes(): string[] {
        // define season types
        const seasonTypes: string[] = [];
        // true if getting career stats
        const isCareerTab = this.seasonTab === 'career';
        // if in arcade mode, return edge case array
        if (this.leagueTab === 'arcade') {
            // get if stats (for current seasonTab) has any non-testing games
            const hasNonTestingGames = this.gamesPlayed
                .find(game => !game.isTesting && (game.season === this.seasonTab && game.isPlayed || isCareerTab)) !== undefined;
            // get if stats (for current seasonTab) has any testing games
            const hasTestingGames = this.gamesPlayed
                .find(game => game.isTesting && (game.season === this.seasonTab && game.isPlayed || isCareerTab)) !== undefined;
            // add beta arcade season type
            if (hasNonTestingGames) seasonTypes.push('career_arcade');
            if (hasTestingGames) seasonTypes.push('beta_arcade');
            // stop here
            return seasonTypes;
        }
        // get if stats (for current seasonTab) has any regular season stats
        const hasRegularSeasonStats = this.gamesPlayed
            .filter(game => game.isRegularSeason && (game.season === this.seasonTab && game.isPlayed || isCareerTab)).length > 0;
        // if has regular season stats, add to season types
        if (hasRegularSeasonStats) seasonTypes.push('regular_season');
        // get if stats (for current seasonTab) has any postseason stats
        const hasPostseasonStats = this.gamesPlayed
            .filter(game => game.isPostseason && (game.season === this.seasonTab && game.isPlayed || isCareerTab)).length > 0;
        // if has postseason stats, add to season types
        if (hasPostseasonStats) seasonTypes.push('postseason');
        // return season types
        return seasonTypes;
    }

    /**
     * Get leagues that this member has played in.
     * @returns the leagues
     */
    public getLeagues(): string[] {
        // return unique stat leagues, and remove empty strings or nullish values
        const leagues: string[] = [...new Set(this.gamesPlayed
            .filter(game => game.isPlayed)
            .map(game => game.league))]
            .filter(league => league);
        // sort leagues alphabetically
        leagues.sort();
        // if league tab is null, set league tab to first league
        if (this.leagueTab === null) { this.changeLeagueTab(leagues[0]); }
        // add arcade tab to beginning of the array
        leagues.unshift('arcade');
        // if leagues list has no leagues, default to arcade tab
        if (leagues.length <= 1) { this.changeLeagueTab('arcade'); }
        // return the leagues
        return leagues;
    }

    /**
     * Get seasons for a league where this member played in.
     * @returns the seasons for the league
     */
    public getSeasons(): string[] {
        // return unique stat seasons, and remove empty strings or nullish values
        const seasons: string[] =
            [...new Set(this.gamesPlayed
                .filter(game => game.league === this.leagueTab && game.isLeaguePlay && game.isPlayed)
                .map(game => game.season))]
                .filter(season => season);
        // sort seasons reverse alphabetically
        seasons.sort((a, b) => b.localeCompare(a));
        // if season tab is null, set season tab to first season
        if (this.seasonTab === null) { this.changeSeasonTab(seasons[0]); }
        // add 'career' to end of array
        seasons.push('career');
        // return the seasons
        return seasons;
    }

    /**
     * Get formatted date when this member first joined the server.
     * @returns the first join formatted date
     */
    public getFirstSeenDate(): string {
        const date = this.dateService.getDate(this.member.dateJoined);
        return date ? 'First seen on ' + formatDate(date, 'MMM d, y, h:mm a', 'en-US') : 'N/A';
    }

    /**
     * Get the number of games played given a season type.
     * Also takes into account the season that is being viewed.
     * @param seasonType The season type.
     * @returns the number of games played
     */
    public getNumberOfGamesPlayed(seasonType: string): number {
        return this.gamesPlayed.filter((game, i, arr) => {
            // return false if the game is not played in
            if (game.isPlayed === false) return false;
            // true if league is same as tab league
            const isSameLeague = game.league === this.leagueTab && game.isLeaguePlay;
            // true if game played season is same as tab season or if getting career games played
            const isSameSeason = game.season === this.seasonTab || this.seasonTab === 'career';
            // true if game had enough players to be counted for stats
            const hasEnoughPlayers = game.awayPlayerCount >= 3 && game.homePlayerCount >= 3 && game.totalPlayerCount >= 6;
            // exclude duplicate box score id
            const isUniqueBoxScore = arr.findIndex(t => t.boxScoreId === game.boxScoreId) === i;
            if (this.leagueTab === 'arcade') {
                // if game is a testing game
                if (seasonType.includes('beta')) {
                    return game.isTesting && !game.isLeaguePlay
                        && !game.isTournamentPlay && hasEnoughPlayers && isUniqueBoxScore;
                } else {
                    return !game.isTesting && !game.isLeaguePlay
                        && !game.isTournamentPlay && hasEnoughPlayers && isUniqueBoxScore;
                }
            } else if (seasonType === 'regular_season') {
                return game.isRegularSeason && isSameSeason && isSameLeague && isUniqueBoxScore;
            }
            else if (seasonType === 'postseason') {
                return game.isPostseason && isSameSeason && isSameLeague && isUniqueBoxScore;
            }
            else if (seasonType === 'preseason') {
                return game.isPreseason && isSameSeason && isSameLeague && isUniqueBoxScore;
            }
            return false;
        }).length;
    }

    /**
     * Get the number of wins given a season type.
     * Also takes into account the season that is being viewed.
     * @param seasonType The season type.
     * @returns the number of wins
     */
    public getNumberOfWins(seasonType: string): number {
        return this.gamesPlayed.filter((game, i, arr) => {
            // return false if the game is not played in
            if (game.isPlayed === false) return false;
            // true if league is same as tab league
            const isSameLeague = game.league === this.leagueTab && game.isLeaguePlay;
            // true if game played season is same as tab season or if getting career games played
            const isSameSeason = game.season === this.seasonTab || this.seasonTab === 'career';
            // true if game had enough players to be counted for stats
            const hasEnoughPlayers = game.awayPlayerCount >= 3 && game.homePlayerCount >= 3 && game.totalPlayerCount >= 6;
            // is on winning team and game has a winner
            const isOnWinningTeam = game.team?.toLowerCase() === game.winningTeam?.toLowerCase() && !!game.winningTeam;
            // exclude duplicate box score id and team
            const isUniqueBoxScore = arr.findIndex(t => t.boxScoreId === game.boxScoreId && t.team === game.team) === i;
            if (this.leagueTab === 'arcade') {
                // if game is a testing game
                if (seasonType.includes('beta')) {
                    return game.isTesting && !game.isLeaguePlay && isOnWinningTeam
                        && !game.isTournamentPlay && hasEnoughPlayers && isUniqueBoxScore;
                } else {
                    return !game.isTesting && !game.isLeaguePlay && isOnWinningTeam
                        && !game.isTournamentPlay && hasEnoughPlayers && isUniqueBoxScore;
                }
            } else if (seasonType === 'regular_season') {
                return game.isRegularSeason && isSameSeason && isSameLeague && isOnWinningTeam && isUniqueBoxScore;
            }
            else if (seasonType === 'postseason') {
                return game.isPostseason && isSameSeason && isSameLeague && isOnWinningTeam && isUniqueBoxScore;
            }
            else if (seasonType === 'preseason') {
                return game.isPreseason && isSameSeason && isSameLeague && isOnWinningTeam && isUniqueBoxScore;
            }
            return false;
        }).length;
    }

    /**
     * Get the number of losses given a season type.
     * Also takes into account the season that is being viewed.
     * @param seasonType The season type.
     * @returns the number of losses
     */
    public getNumberOfLosses(seasonType: string): number {
        return this.gamesPlayed.filter((game, i, arr) => {
            // return false if the game is not played in
            if (game.isPlayed === false) return false;
            // true if league is same as tab league
            const isSameLeague = game.league === this.leagueTab && game.isLeaguePlay;
            // true if game played season is same as tab season or if getting career games played
            const isSameSeason = game.season === this.seasonTab || this.seasonTab === 'career';
            // true if game had enough players to be counted for stats
            const hasEnoughPlayers = game.awayPlayerCount >= 3 && game.homePlayerCount >= 3 && game.totalPlayerCount >= 6;
            // is on losing team and game has a winner
            const isOnLosingTeam = game.team?.toLowerCase() !== game.winningTeam?.toLowerCase() && !!game.winningTeam;
            // exclude duplicate box score id and team
            const isUniqueBoxScore = arr.findIndex(t => t.boxScoreId === game.boxScoreId && t.team === game.team) === i;
            if (this.leagueTab === 'arcade') {
                // if game is a testing game
                if (seasonType.includes('beta')) {
                    return game.isTesting && !game.isLeaguePlay && isOnLosingTeam
                        && !game.isTournamentPlay && hasEnoughPlayers && isUniqueBoxScore;
                } else {
                    return !game.isTesting && !game.isLeaguePlay && isOnLosingTeam
                        && !game.isTournamentPlay && hasEnoughPlayers && isUniqueBoxScore;
                }
            } else if (seasonType === 'regular_season') {
                return game.isRegularSeason && isSameSeason && isSameLeague && isOnLosingTeam && isUniqueBoxScore;
            }
            else if (seasonType === 'postseason') {
                return game.isPostseason && isSameSeason && isSameLeague && isOnLosingTeam && isUniqueBoxScore;
            }
            else if (seasonType === 'preseason') {
                return game.isPreseason && isSameSeason && isSameLeague && isOnLosingTeam && isUniqueBoxScore;
            }
            return false;
        }).length;
    }

    /**
     * Get the number of draws given a season type.
     * Also takes into account the season that is being viewed.
     * @param seasonType The season type.
     * @returns the number of draws
     */
    public getNumberOfDraws(seasonType: string): number {
        let draws = this.getNumberOfGamesPlayed(seasonType) - (this.getNumberOfWins(seasonType) + this.getNumberOfLosses(seasonType));
        if (draws < 0) draws = 0;
        return draws;
    }

    /**
     * Get the number of goals given a season type.
     * Also takes into account the season that is being viewed.
     * @param seasonType The season type.
     * @returns the number of goals
     */
    public getNumberOfGoals(seasonType: string): number {
        return this.stats.filter((stat) => {
            // true if league is same as tab league
            const isSameLeague = stat.league === this.leagueTab && stat.isLeaguePlay;
            // true if stat season is same as tab season or if getting career stats
            const isSameSeason = stat.season === this.seasonTab || this.seasonTab === 'career';
            // unique box score
            const isGoalScorer = stat.goalScorer === this.member.uuid;
            if (this.leagueTab === 'arcade') {
                // if game is a testing game
                if (seasonType.includes('beta')) {
                    return stat.isTesting && !stat.isLeaguePlay && !stat.isTournamentPlay && isGoalScorer;
                } else {
                    return !stat.isTesting && !stat.isLeaguePlay && !stat.isTournamentPlay && isGoalScorer;
                }
            } else if (seasonType === 'regular_season') {
                return stat.isRegularSeason && isSameSeason && isSameLeague && isGoalScorer;
            }
            else if (seasonType === 'postseason') {
                return stat.isPostseason && isSameSeason && isSameLeague && isGoalScorer;
            }
            else if (seasonType === 'preseason') {
                return stat.isPreseason && isSameSeason && isSameLeague && isGoalScorer;
            }
            return false;
        }).length;
    }

    /**
     * Calculate the win-lose ratio
     */
    public calculateWinLoseRatio(seasonType: string): number {
        const wins = this.getNumberOfWins(seasonType);
        const losses = this.getNumberOfLosses(seasonType);
        if (wins === undefined || losses === undefined) { return 0; }
        if (losses === 0) { return wins; }
        return wins / losses;
    }

    /**
     * Get the number of assists given a season type.
     * Also takes into account the season that is being viewed.
     * @param seasonType The season type.
     * @returns the number of assists
     */
    public getNumberOfAssists(seasonType: string): number {
        return this.stats.filter((stat) => {
            // true if league is same as tab league
            const isSameLeague = stat.league === this.leagueTab && stat.isLeaguePlay;
            // true if stat season is same as tab season or if getting career stats
            const isSameSeason = stat.season === this.seasonTab || this.seasonTab === 'career';
            // unique box score
            const isAssistant = stat.primaryAssistant === this.member.uuid || stat.secondaryAssistant === this.member.uuid;
            if (this.leagueTab === 'arcade') {
                // if game is a testing game
                if (seasonType.includes('beta')) {
                    return stat.isTesting && !stat.isLeaguePlay && !stat.isTournamentPlay && isAssistant;
                } else {
                    return !stat.isTesting && !stat.isLeaguePlay && !stat.isTournamentPlay && isAssistant;
                }
            } else if (seasonType === 'regular_season') {
                return stat.isRegularSeason && isSameSeason && isSameLeague && isAssistant;
            }
            else if (seasonType === 'postseason') {
                return stat.isPostseason && isSameSeason && isSameLeague && isAssistant;
            }
            else if (seasonType === 'preseason') {
                return stat.isPreseason && isSameSeason && isSameLeague && isAssistant;
            }
            return false;
        }).length;
    }

    /**
     * Get the number of points given a season type.
     * Also takes into account the season that is being viewed.
     * @param seasonType The season type.
     * @returns the number of points
     */
    public getNumberOfPoints(seasonType: string): number {
        return this.getNumberOfGoals(seasonType) + this.getNumberOfAssists(seasonType);
    }

    /**
     * Get the number of overtime goals given a season type.
     * Also takes into account the season that is being viewed.
     * @param seasonType The season type.
     * @returns the number of overtime goals
     */
    public getNumberOfOvertimeGoals(seasonType: string): number {
        return this.stats.filter((stat) => {
            // true if league is same as tab league
            const isSameLeague = stat.league === this.leagueTab && stat.isLeaguePlay;
            // true if stat season is same as tab season or if getting career stats
            const isSameSeason = stat.season === this.seasonTab || this.seasonTab === 'career';
            // unique box score
            const isOvertimeGoalScorer = stat.goalScorer === this.member.uuid && stat.period > 3;
            if (this.leagueTab === 'arcade') {
                // if game is a testing game
                if (seasonType.includes('beta')) {
                    return stat.isTesting && !stat.isLeaguePlay && !stat.isTournamentPlay && isOvertimeGoalScorer;
                } else {
                    return !stat.isTesting && !stat.isLeaguePlay && !stat.isTournamentPlay && isOvertimeGoalScorer;
                }
            } else if (seasonType === 'regular_season') {
                return stat.isRegularSeason && isSameSeason && isSameLeague && isOvertimeGoalScorer;
            }
            else if (seasonType === 'postseason') {
                return stat.isPostseason && isSameSeason && isSameLeague && isOvertimeGoalScorer;
            }
            else if (seasonType === 'preseason') {
                return stat.isPreseason && isSameSeason && isSameLeague && isOvertimeGoalScorer;
            }
            return false;
        }).length;
    }
}
