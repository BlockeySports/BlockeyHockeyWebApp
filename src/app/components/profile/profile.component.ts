import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Member } from 'src/app/models/Member';
import { MemberService } from 'src/app/services/member.service';

import { NgxTippyService } from 'ngx-tippy-wrapper';
import { formatDate } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { DateService } from 'src/app/services/date.service';
import { PlayerStatisticService } from 'src/app/services/player-statistic.service';
import { PlayerStatistic } from 'src/app/models/PlayerStatistic';
import { PlayerGamePlayed } from 'src/app/models/PlayerGamePlayed';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html'
})
export class ProfileComponent implements OnInit, OnDestroy {

    public member: Member = {
        username: ''
    };
    public playerStatistics: PlayerStatistic[] = [];
    public playerGamesPlayed: PlayerGamePlayed[] = [];

    public isError = false;
    public errorMessage = '';

    public usernameColor = 'currentColor';
    public profilePicture = '';

    // which content to display (i.e. stats, awards, infractions)
    // show stats content by default
    public tab = 'stats';

    // subs
    private playerSub: Subscription;
    private memberSub: Subscription;
    private titleSub: Subscription;
    private tippySub: Subscription;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private tippyService: NgxTippyService,
        private memberService: MemberService,
        private playerStatisticService: PlayerStatisticService,
        private titleService: Title,
        private dateService: DateService
    ) { }

    ngOnInit(): void {
        // set the content if specified in the url
        this.route.fragment.subscribe(data => this.tab = data ?? 'stats').unsubscribe();
        // get the username from the url
        this.member.username = this.getUsernameFromAddress();
        // set initial profile picture from username search for (may be changed in subscribe success)
        this.profilePicture = `https://api.ashcon.app/mojang/v2/avatar/${this.member.username}`;
        // set the initial tab title
        this.titleService.setTitle(this.member.username + ' \u007c Blockey Hockey Network');
        // subscribe to member data
        this.memberSub = this.memberService.getMemberByUsername(this.member.username).subscribe(
            (data: Member) => {
                // set the member
                this.member = data;
                // set the username color
                this.usernameColor = this.member.roles?.length > 0 ? this.member.roles[0].background : 'currentColor';
                // set member profile picture from uuid
                this.profilePicture = `https://api.ashcon.app/mojang/v2/avatar/${this.member.uuid}`;
                // set the browser tab title
                this.titleService.setTitle(this.member.username + ' \u007c Blockey Hockey Network');
                // change the tab to the fragment in the url
                this.changeTab(this.tab !== 'stats' ? this.tab : '');
                // set the last online tooltip date
                this.setTippyOnlineStatus();
                // get player statistics
                this.getPlayerStatistics();
                console.log(data);

            },
            (error) => {
                this.isError = true;
                if (!error.ok) {
                    // set statistics error message when failed to get profile.
                    this.errorMessage = 'There was an error loading your statistics. Try again later.';
                }
                // set the username color
                this.usernameColor = 'currentColor';
                // set the last online tooltip date
                this.setTippyOnlineStatus();
                console.log(error);
            }
        );
    }

    /**
     * Get the player statistics.
     */
    private getPlayerStatistics(): void {
        // get player stats (i.e. goals, assists, etc.)
        this.playerStatisticService.getPlayerStatistics(this.member.uuid).subscribe(
            (playerStatistics: PlayerStatistic[]) => {
                this.playerStatistics = playerStatistics;
            },
            (error) => {
                console.log(error);
            }
        );
        // get games played (i.e. games played, wins, losses, draws)
        this.playerStatisticService.getPlayerGamesPlayed(this.member.uuid).subscribe(
            (playerGamesPlayed: PlayerGamePlayed[]) => {
                this.playerGamesPlayed = playerGamesPlayed;
            },
            (error) => {
                console.log(error);
            }
        );
    }

    /**
     * This method simply adds a fragment onto the url when switching between tab on the page.
     * That allows the page to be reloaded and the user may remain on the same tab the left off on.
     * This also is good for bookmarking the page in a specific view.
     */
    public changeTab(tab: string): void {
        this.tab = tab || 'stats';      // default tab is stats
        this.router.navigate(
            [`/u/${this.member.username}`],
            {
                relativeTo: this.route,
                fragment: tab || null
            });
    }

    /**
     * Get the date that this member was last online.
     * @param lastOnline the date that this member was last online
     */
    public getLastOnlineDate(): Date {
        return this.dateService.getDate(this.member.lastOnline);
    }

    /**
     * Set the tooltips for the online/offline indicator and the last seen date
     */
    private setTippyOnlineStatus(): void {
        // get date using date service
        const date = this.getLastOnlineDate();
        // get formatted date as string
        const formattedDate = date ? formatDate(date, 'MMM d, y, h:mm a', 'en-US') : 'N/A';
        this.tippyService.setContent('last-online-date', formattedDate);
        this.tippyService.setContent('online-status', this.member.isOnline ? 'Online' : 'Offline');
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
     * Get the username from the url address
     * occurring after the last slash and before an fragments.
     */
    private getUsernameFromAddress(): string {
        const url = window.location.href;
        const lastSlash = url.lastIndexOf('/');
        // in case a fragment exists in url, only take everything before that
        return url.substr(lastSlash + 1).split('#')[0];
    }

    search(name: string): void {
        this.router.navigate([`/u/${name}`]);
    }

    ngOnDestroy(): void {
        if (this.memberSub) { this.memberSub.unsubscribe(); }
        if (this.playerSub) { this.playerSub.unsubscribe(); }
        if (this.titleSub) { this.titleSub.unsubscribe(); }
        if (this.tippySub) { this.tippySub.unsubscribe(); }
    }
}
