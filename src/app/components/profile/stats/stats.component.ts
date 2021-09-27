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
        this.leagueTab = tab || null;
    }

    public changeSeasonTab(tab: string): void {
        this.seasonTab = tab || null;
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
        // add 'arcade' to beginning of the array
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
            [...new Set(this.stats.filter(stat => stat.league === this.leagueTab).map(stat => stat.season))].filter(season => season);
        // sort seasons alphabetically
        seasons.sort();
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
        return date
            ? 'First seen on ' + formatDate(date, 'MMM d, y, h:mm a', 'en-US')
            : 'N/A';
    }

    /**
     * Get the number of games played given a season type.
     * Also takes into account the season that is being viewed.
     * @param seasonType The season type.
     * @returns the number of games played
     */
    public getNumberOfGamesPlayed(seasonType: string): number {
        return this.stats.filter((stat, i, arr) => {
            // true if stat season is same as tab season or if getting career stats
            const isSameSeason = stat.season === this.seasonTab || this.seasonTab === 'career';
            // unique box score
            const isUniqueBoxScore = arr.findIndex(t => t.boxScoreId === stat.boxScoreId) === i;
            if (seasonType === 'regular_season') {
                return stat.isRegularSeason && isSameSeason && isUniqueBoxScore;
            }
            else if (seasonType === 'postseason') {
                return stat.isPostseason && isSameSeason && isUniqueBoxScore;
            }
            else if (seasonType === 'preseason') {
                return stat.isPreseason && isSameSeason && isUniqueBoxScore;
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
        return this.stats.filter((stat) => {
            // true if stat season is same as tab season or if getting career stats
            const isSameSeason = stat.season === this.seasonTab || this.seasonTab === 'career';
            // unique box score
            const isOnWinningTeam = stat.team?.toLowerCase() === stat.winningTeam?.toLowerCase();
            if (seasonType === 'regular_season') {
                return stat.isRegularSeason && isSameSeason && isOnWinningTeam;
            }
            else if (seasonType === 'postseason') {
                return stat.isPostseason && isSameSeason && isOnWinningTeam;
            }
            else if (seasonType === 'preseason') {
                return stat.isPreseason && isSameSeason && isOnWinningTeam;
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
        return this.stats.filter((stat) => {
            // true if stat season is same as tab season or if getting career stats
            const isSameSeason = stat.season === this.seasonTab || this.seasonTab === 'career';
            // unique box score
            const isOnLosingTeam = stat.team?.toLowerCase() !== stat.winningTeam?.toLowerCase();
            if (seasonType === 'regular_season') {
                return stat.isRegularSeason && isSameSeason && isOnLosingTeam;
            }
            else if (seasonType === 'postseason') {
                return stat.isPostseason && isSameSeason && isOnLosingTeam;
            }
            else if (seasonType === 'preseason') {
                return stat.isPreseason && isSameSeason && isOnLosingTeam;
            }
            return false;
        }).length;
    }

    /**
     * Get the number of goals given a season type.
     * Also takes into account the season that is being viewed.
     * @param seasonType The season type.
     * @returns the number of goals
     */
    public getNumberOfGoals(seasonType: string): number {
        return this.stats.filter((stat) => {
            // true if stat season is same as tab season or if getting career stats
            const isSameSeason = stat.season === this.seasonTab || this.seasonTab === 'career';
            // unique box score
            const isGoalScorer = stat.goalScorer === this.member.uuid;
            if (seasonType === 'regular_season') {
                return stat.isRegularSeason && isSameSeason && isGoalScorer;
            }
            else if (seasonType === 'postseason') {
                return stat.isPostseason && isSameSeason && isGoalScorer;
            }
            else if (seasonType === 'preseason') {
                return stat.isPreseason && isSameSeason && isGoalScorer;
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
            // true if stat season is same as tab season or if getting career stats
            const isSameSeason = stat.season === this.seasonTab || this.seasonTab === 'career';
            // unique box score
            const isAssistant = stat.primaryAssistant === this.member.uuid || stat.secondaryAssistant === this.member.uuid;
            if (seasonType === 'regular_season') {
                return stat.isRegularSeason && isSameSeason && isAssistant;
            }
            else if (seasonType === 'postseason') {
                return stat.isPostseason && isSameSeason && isAssistant;
            }
            else if (seasonType === 'preseason') {
                return stat.isPreseason && isSameSeason && isAssistant;
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
            // true if stat season is same as tab season or if getting career stats
            const isSameSeason = stat.season === this.seasonTab || this.seasonTab === 'career';
            // unique box score
            const isOvertimeGoalScorer = stat.goalScorer === this.member.uuid && stat.period > 3;
            if (seasonType === 'regular_season') {
                return stat.isRegularSeason && isSameSeason && isOvertimeGoalScorer;
            }
            else if (seasonType === 'postseason') {
                return stat.isPostseason && isSameSeason && isOvertimeGoalScorer;
            }
            else if (seasonType === 'preseason') {
                return stat.isPreseason && isSameSeason && isOvertimeGoalScorer;
            }
            return false;
        }).length;
    }
}
