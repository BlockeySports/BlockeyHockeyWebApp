import { formatDate } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Member } from 'src/app/models/Member';
import { PlayerStatistic } from 'src/app/models/PlayerStatistic';
import { DateService } from 'src/app/services/date.service';
import dayjs from 'dayjs';
import { HockeyLeague } from 'src/app/models/HockeyLeague';
import { HockeyPlayerStatistic } from 'src/app/models/HockeyPlayerStatistic';
import { HockeySeason } from 'src/app/models/HockeySeason';
import { HockeySeasonType } from 'src/app/models/HockeySeasonType';

@Component({
    selector: 'app-stats',
    templateUrl: './stats.component.html'
})
export class StatsComponent implements OnInit {

    @Input() member: Member;
    // @Input() stats: PlayerStatistic[] = [];
    @Input() playerStatistics: HockeyPlayerStatistic[];
    // @Input() gamesPlayed: PlayerGamePlayed[] = [];
    // @Input() onIcePlayers: BoxScoreOnIcePlayer[] = [];
    @Input() isError;

    public isLoading = false;
    public loadingText = '';

    public leagueTab = null;
    public seasonTab = null;

    constructor(
        private dateService: DateService
    ) { }

    ngOnInit(): void {
        // set loading text
        this.loadingText = 'You have no statistics yet. Join the server and play a game to view your statistics.';
    }

    public getLeagues(): HockeyLeague[] {
        return [];
    }

    public getSeasons(): HockeySeason[] {
        return [];
    }

    public getSeasonTypes(): HockeySeasonType[] {
        return [];
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

    public changeLeagueTab(league: HockeyLeague): void {
        // reset season tab if tab is changing
        if (this.leagueTab !== league.name.toLowerCase()) this.changeSeasonTab(null);
        // if switching to arcade, set season to career
        if (league === 'arcade') { this.changeSeasonTab(null); }
        // set the league tab
        this.leagueTab = league?.name?.toLowerCase() || null;
    }

    public changeSeasonTab(season: HockeySeason): void {
        this.seasonTab = season?.value || 'career';
    }

    /**
     * Get formatted date when this member first joined the server.
     * @returns the first join formatted date
     */
    public getFirstSeenDate(): string {
        if (!this.member.dateJoined) return '';
        const date = this.dateService.getDate(this.member.dateJoined);
        return date ? 'First seen on ' + formatDate(date, 'MMM d, y, h:mm a', 'en-US') : 'N/A';
    }
}
