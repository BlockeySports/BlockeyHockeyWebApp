import { formatDate } from '@angular/common';
import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { Member } from 'src/app/models/Member';
import { PlayerStatistic } from 'src/app/models/PlayerStatistic';
import { DateService } from 'src/app/services/date.service';
import dayjs from 'dayjs';
import { HockeyLeague } from 'src/app/models/HockeyLeague';
import { HockeyPlayerStatistic } from 'src/app/models/HockeyPlayerStatistic';
import { HockeySeason } from 'src/app/models/HockeySeason';
import { HockeySeasonType } from 'src/app/models/HockeySeasonType';
import { HockeyPointsStatistic } from 'src/app/models/HockeyPointsStatistic';

@Component({
    selector: 'app-stats',
    templateUrl: './stats.component.html'
})
export class StatsComponent implements OnInit, OnChanges {

    @Input() member: Member;
    @Input() playerStatistics: HockeyPlayerStatistic[];
    @Input() isError;

    public isLoading = true;
    public loadingText = '';

    private leagues: HockeyLeague[] = [];
    private seasons: HockeySeason[] = [];

    public leagueTab: HockeyLeague = null;
    public seasonTab: HockeySeason = null;

    constructor(
        private dateService: DateService
    ) { }

    ngOnInit(): void { }

    ngOnChanges(): void {
        // default the league tab to the arcade league
        setTimeout(() => {
            if (this.leagues?.length > 0) {
                this.changeLeagueTab(this.getLeagues()[0]);
                this.isLoading = false;
            }
            else if (this.isError) this.loadingText = 'An unexpected error occurred while loading your statistics.';
            else this.loadingText = 'You have no statistics yet. Join the server and play a game.';
        }, 1);
    }

    public getLeagues(): HockeyLeague[] {
        // if leagues are already set, return them
        if (this.leagues.filter(league => league.code !== 'arcade').length > 0) return this.leagues;
        // get all leagues
        const leagues = this.playerStatistics?.map(stat => stat?.filter?.league);
        // console.log(leagues);
        // set leagues with arcade first
        this.leagues = this.getUniqueValues(leagues, 'id').sort((a, b) => a.code === 'arcade' ? -1 : 1);
        // return leagues
        return this.leagues;
    }

    /**
     * Get all unique seasons for the current league tab.
     */
    public getSeasons(): HockeySeason[] {
        // get all seasons for the current league
        const seasons = this.playerStatistics
            ?.filter(stat => stat?.filter.league?.id === this.leagueTab?.id)
            ?.map(stat => stat?.filter?.season);
        // add 'career' season
        if (seasons.length > 0) seasons?.push({
            value: Number.MAX_VALUE,
            id: 'career',
            name: 'Career',
            league: this.leagueTab
        });
        // get unique seasons sorted by season value
        return this.getUniqueValues(seasons, 'id').sort((a, b) => a.value - b.value);
    }

    /**
     * Get all unique season types for the current league tab and season tab.
     */
    public getSeasonTypes(): HockeySeasonType[] {
        // get all season types for the current league and season
        const seasonTypes = this.playerStatistics
            ?.filter(stat => stat?.filter.league?.id === this.leagueTab?.id)
            ?.filter(stat => this.seasonTab.id === 'career' || stat?.filter.season?.id === this.seasonTab?.id)
            ?.map(stat => stat?.filter?.seasonType);
        return this.getUniqueValues(seasonTypes, 'value')?.sort((a, b) => a.value - b.value);
    }

    /**
     * Get the player statistic for the current league, season, and season type.
     */
    public getPlayerStatistics(seasonType: HockeySeasonType): HockeyPlayerStatistic[] {
        // get the player statistic for the current league, season, and season type
        return this.playerStatistics
            ?.filter(stat => stat?.filter.league?.id === this.leagueTab?.id)
            ?.filter(stat => this.seasonTab.id === 'career' || stat?.filter.season?.id === this.seasonTab?.id)
            ?.filter(stat => stat?.filter.seasonType?.value === seasonType.value);
    }

    /**
     * Get number of games played filtered by league tab, season tab, and season type.
     */
    public getGamesPlayed(seasonType: HockeySeasonType): number {
        // get number of games played filtered by league tab, season tab, and season type
        return this.getPlayerStatistics(seasonType)?.reduce((acc, stat) => acc + stat.gamesPlayed, 0);
    }

    public getWins(seasonType: HockeySeasonType): number {
        return this.getPlayerStatistics(seasonType)?.reduce((acc, stat) => acc + stat.wins, 0);
    }

    public getLosses(seasonType: HockeySeasonType): number {
        return this.getPlayerStatistics(seasonType)?.reduce((acc, stat) => acc + stat.losses, 0);
    }

    public getOTLosses(seasonType: HockeySeasonType): number {
        return this.getPlayerStatistics(seasonType)?.reduce((acc, stat) => acc + stat.overtimeLosses, 0);
    }

    private getPointsStats(seasonType: HockeySeasonType): HockeyPointsStatistic[] {
        return this.getPlayerStatistics(seasonType)?.flatMap(stat => stat.points);
    }

    public getGoals(seasonType: HockeySeasonType): number {
        return this.getPointsStats(seasonType)?.reduce((acc, stat) => acc + stat.goals, 0);
    }

    public getPrimaryAssists(seasonType: HockeySeasonType): number {
        return this.getPointsStats(seasonType)?.reduce((acc, stat) => acc + stat.primaryAssists, 0);
    }

    public getSecondaryAssists(seasonType: HockeySeasonType): number {
        return this.getPointsStats(seasonType)?.reduce((acc, stat) => acc + stat.secondaryAssists, 0);
    }

    public getAssists(seasonType: HockeySeasonType): number {
        return this.getPrimaryAssists(seasonType) + this.getSecondaryAssists(seasonType);
    }

    public getPoints(seasonType: HockeySeasonType): number {
        return this.getGoals(seasonType) + this.getAssists(seasonType);
    }

    public getOTGoals(seasonType: HockeySeasonType): number {
        return this.getPointsStats(seasonType)?.reduce((acc, stat) => acc + stat.overtimeGoals, 0);
    }

    public getShotsOnGoal(seasonType: HockeySeasonType): number {
        return this.getPlayerStatistics(seasonType)?.reduce((acc, stat) => acc + stat.shotsOnGoal, 0);
    }

    /**
     * Get unique elements from an array by a given property of the element.
     */
    private getUniqueValues(data: any[], key: string): any[] {
        return data?.filter((value, index, self) => self.map(v => v[key]).indexOf(value[key]) === index);
    }

    /**
     * Get the amount of hours played per day since joining the server.
     * @returns the hours played per day
     */
    public getHoursPerDay(): number {
        // get days since join date
        const days = dayjs().diff(dayjs(this.member?.dateJoined), 'day');
        // if zero days, return 0
        if (days < 1) return 0;
        // convert time played to hours from milliseconds
        const hours = this.member.timePlayed / (1000 * 60 * 60);
        // if less than 1 hour played, return 0
        if (hours < 1) return 0;
        // return hours per day
        return hours / days;
    }

    /**
     * Change the selected league tab.
     */
    public changeLeagueTab(league: HockeyLeague): void {
        // set the league tab
        this.leagueTab = league;
        // get seasons (excluding career)
        const seasons = this.getSeasons().filter(season => season.id !== 'career');
        // set season tab to the last season in that league
        this.seasonTab = seasons[seasons.length - 1];
    }

    /**
     * Change the selected season tab.
     */
    public changeSeasonTab(season: HockeySeason): void {
        // set the season tab
        this.seasonTab = season;
    }

    /**
     * Get formatted date when this member first joined the server.
     * @returns the first join formatted date
     */
    public getFirstSeenDate(): string {
        if (!this.member?.dateJoined) return null;
        const date = this.dateService.getDate(this.member.dateJoined);
        return date ? 'First seen on ' + formatDate(date, 'MMM d, y, h:mm a', 'en-US') : 'N/A';
    }
}
