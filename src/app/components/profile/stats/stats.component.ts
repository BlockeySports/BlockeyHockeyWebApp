import { formatDate } from '@angular/common';
import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { NgxTippyService } from 'ngx-tippy-wrapper';
import { Member } from 'src/app/models/Member';
import { PlayerStatistic } from 'src/app/models/PlayerStatistic';
import { DateService } from 'src/app/services/date.service';

@Component({
    selector: 'app-stats',
    templateUrl: './stats.component.html'
})
export class StatsComponent implements OnInit {

    @Input() member: Member;
    @Input() stats: PlayerStatistic[] = [];
    @Input() isError;
    @Input() statisticsText;

    public isLoading = false;

    public leagueTab = null;
    public seasonTab = null;

    public seasonTypes = ['regular_season', 'postseason'];

    constructor(
        private tippyService: NgxTippyService,
        private dateService: DateService
    ) { }

    ngOnInit(): void {
        // display loading text
        this.statisticsText = 'Hang tight while we load your statistics.';
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

    public getSeasonTypes(): string[] {
        // if in arcade mode, return edge case array
        if (this.leagueTab === 'arcade') return ['career_arcade'];
        // define season types
        const seasonTypes: string[] = [];
        // true if getting career stats
        const isCareerTab = this.seasonTab === 'career';
        // get if stats (for current seasonTab) has any regular season stats
        const hasRegularSeasonStats = this.stats
            .filter(stat => stat.isRegularSeason && (stat.season === this.seasonTab || isCareerTab)).length > 0;
        // if has regular season stats, add to season types
        if (hasRegularSeasonStats) seasonTypes.push('regular_season');
        // get if stats (for current seasonTab) has any postseason stats
        const hasPostseasonStats = this.stats
            .filter(stat => stat.isPostseason && (stat.season === this.seasonTab || isCareerTab)).length > 0;
        // if has postseason stats, add to season types
        if (hasPostseasonStats) seasonTypes.push('postseason');
        // return season types
        return seasonTypes;
    }

    /**
     * Get leagues.
     * @returns the leagues
     */
    public getLeagues(): string[] {
        // return unique stat leagues, and remove empty strings or nullish values
        const leagues: string[] = [...new Set(this.stats.map(stat => stat.league))].filter(league => league);
        // sort leagues alphabetically
        leagues.sort();
        // if league tab is null, set league tab to first league
        if (this.leagueTab === null) { this.changeLeagueTab(leagues[0]); }
        // add arcade tab to beginning of the array
        leagues.unshift('arcade');
        // return the leagues
        return leagues;
    }

    /**
     * Get seasons for a league.
     * @returns the seasons for the league
     */
    public getSeasons(): string[] {
        // return unique stat seasons, and remove empty strings or nullish values
        const seasons: string[] =
            [...new Set(this.stats
                .filter(stat => stat.league === this.leagueTab && stat.isLeaguePlay)
                .map(stat => stat.season))]
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
        return this.stats.filter((stat, i, arr) => {
            // true if league is same as tab league
            const isSameLeague = stat.league === this.leagueTab && stat.isLeaguePlay;
            // true if stat season is same as tab season or if getting career stats
            const isSameSeason = stat.season === this.seasonTab || this.seasonTab === 'career';
            // exclude duplicate box score id
            const isUniqueBoxScore = arr.findIndex(t => t.boxScoreId === stat.boxScoreId) === i;
            if (this.leagueTab === 'arcade') {
                return isUniqueBoxScore && !stat.isLeaguePlay && !stat.isTournamentPlay;
            } else if (seasonType === 'regular_season') {
                return stat.isRegularSeason && isSameSeason && isSameLeague && isUniqueBoxScore;
            }
            else if (seasonType === 'postseason') {
                return stat.isPostseason && isSameSeason && isSameLeague && isUniqueBoxScore;
            }
            else if (seasonType === 'preseason') {
                return stat.isPreseason && isSameSeason && isSameLeague && isUniqueBoxScore;
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
        return this.stats.filter((stat, i, arr) => {
            // true if league is same as tab league
            const isSameLeague = stat.league === this.leagueTab && stat.isLeaguePlay;
            // true if stat season is same as tab season or if getting career stats
            const isSameSeason = stat.season === this.seasonTab || this.seasonTab === 'career';
            // is on winning team and game has a winner
            const isOnWinningTeam = stat.team?.toLowerCase() === stat.winningTeam?.toLowerCase() && !!stat.winningTeam;
            // exclude duplicate box score id and team
            const isUniqueBoxScore = arr.findIndex(t => t.boxScoreId === stat.boxScoreId && t.team === stat.team) === i;
            if (this.leagueTab === 'arcade') {
                return isUniqueBoxScore && !stat.isLeaguePlay && !stat.isTournamentPlay && isOnWinningTeam;
            } else if (seasonType === 'regular_season') {
                return stat.isRegularSeason && isSameSeason && isSameLeague && isOnWinningTeam && isUniqueBoxScore;
            }
            else if (seasonType === 'postseason') {
                return stat.isPostseason && isSameSeason && isSameLeague && isOnWinningTeam && isUniqueBoxScore;
            }
            else if (seasonType === 'preseason') {
                return stat.isPreseason && isSameSeason && isSameLeague && isOnWinningTeam && isUniqueBoxScore;
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
        return this.stats.filter((stat, i, arr) => {
            // true if league is same as tab league
            const isSameLeague = stat.league === this.leagueTab && stat.isLeaguePlay;
            // true if stat season is same as tab season or if getting career stats
            const isSameSeason = stat.season === this.seasonTab || this.seasonTab === 'career';
            // is on losing team and game has a winner
            const isOnLosingTeam = stat.team?.toLowerCase() !== stat.winningTeam?.toLowerCase() && !!stat.winningTeam;
            // exclude duplicate box score id and team
            const isUniqueBoxScore = arr.findIndex(t => t.boxScoreId === stat.boxScoreId && t.team === stat.team) === i;
            if (this.leagueTab === 'arcade') {
                return isUniqueBoxScore && !stat.isLeaguePlay && !stat.isTournamentPlay && isOnLosingTeam;
            } else if (seasonType === 'regular_season') {
                return stat.isRegularSeason && isSameSeason && isSameLeague && isOnLosingTeam && isUniqueBoxScore;
            }
            else if (seasonType === 'postseason') {
                return stat.isPostseason && isSameSeason && isSameLeague && isOnLosingTeam && isUniqueBoxScore;
            }
            else if (seasonType === 'preseason') {
                return stat.isPreseason && isSameSeason && isSameLeague && isOnLosingTeam && isUniqueBoxScore;
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
                return !stat.isLeaguePlay && !stat.isTournamentPlay && isGoalScorer;
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
    public calculateWinLoseRatio(wins: number, losses: number): number {
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
                return !stat.isLeaguePlay && !stat.isTournamentPlay && isAssistant;
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
                return !stat.isLeaguePlay && !stat.isTournamentPlay && isOvertimeGoalScorer;
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
