import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Member } from 'src/app/models/Member';
import { MemberService } from 'src/app/services/member.service';
import { PlayerService } from 'src/app/services/player.service';

import { NgxTippyService } from 'ngx-tippy-wrapper';
import { formatDate } from '@angular/common';
import { Title } from '@angular/platform-browser';

// tslint:disable: deprecation
@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html'
})
export class ProfileComponent implements OnInit, OnDestroy {

    public member: Member = {
        username: '',
        hockeyStatistics: [
            {
                goals: 0, primaryAssists: 0, secondaryAssists: 0, wins: 0, losses: 0, goalsAgainst: 0,
                overtimeWins: 0, overtimeLosses: 0, forfeitWins: 0, forfeitLosses: 0
            }
        ]
    };

    public usernameColor = 'currentColor';
    public profilePicture = '';

    public server = 0;

    // which content to display (i.e. stats, trophies, infractions)
    // show stats content by default
    public tab = 'stats';

    // Subs
    private playerSub: Subscription;
    private memberSub: Subscription;
    private titleSub: Subscription;
    private tippySub: Subscription;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private tippyService: NgxTippyService,
        private memberService: MemberService,
        private titleService: Title
    ) { }

    ngOnInit(): void {

        this.server = Math.floor(Math.random() * 8) + 1;

        // set the content if specified in the url
        this.route.fragment.subscribe(data => this.tab = data ?? 'stats').unsubscribe();

        this.member.username = this.getUsernameFromAddress();
        // set initial profile picture from username search for (may be changed in subscribe success)
        this.profilePicture = `https://api.ashcon.app/mojang/v2/avatar/${this.member.username}`;
        // set the initial tab title
        this.titleService.setTitle(this.member.username + ' \u007c Blockey Hockey Network');

        // tslint:disable: deprecation
        this.memberSub = this.memberService.getMemberByUsername(this.member.username).subscribe(
            (data) => {
                // set the member
                this.member = data;
                // set the username color
                this.usernameColor = this.member.roles?.length > 0 ? this.member.roles[0].background : 'currentColor';
                // set member profile picture from uuid
                this.profilePicture = `https://api.ashcon.app/mojang/v2/avatar/${this.member.uuid}`;
                // set the browser tab title
                this.titleService.setTitle(this.member.username + ' \u007c Blockey Hockey Network');
                // fix username capitalization in url
                this.changeTab(this.tab !== 'stats' ? this.tab : '');
                // set the last online tooltip date
                this.setTippyOnlineStatus();
                // console.log(data);

            },
            (error) => {
                // set the username color
                this.usernameColor = 'currentColor';
                // set the last online tooltip date
                this.setTippyOnlineStatus();
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
     * Set the tooltips for the online/offline indicator and the last seen date
     */
    private setTippyOnlineStatus(): void {
        let lastOnline: any = this.member.lastOnline;
        lastOnline = lastOnline ? formatDate(new Date(lastOnline), 'MMM d, y, h:mm a', 'en-US') : 'N/A';
        this.tippyService.setContent('last-online-date', lastOnline);
        this.tippyService.setContent('online-status', this.member.online ? 'Online' : 'Offline');
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
