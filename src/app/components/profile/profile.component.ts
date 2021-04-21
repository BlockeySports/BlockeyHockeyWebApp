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
    };

    public usernameColor = 'currentColor';
    public profilePicture = '';

    public server = 0;

    // which content to display (i.e. stats, trophies, infractions)
    // show stats content by default
    public content = 'stats';

    // Subs
    private playerSub: Subscription;
    private memberSub: Subscription;
    private titleSub: Subscription;
    private tippySub: Subscription;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private tippyService: NgxTippyService,
        private playerService: PlayerService,
        private memberService: MemberService,
        private titleService: Title
    ) { }

    ngOnInit(): void {

        this.server = Math.floor(Math.random() * 8) + 1;

        // set the content if specified in the url
        this.route.fragment.subscribe(data => this.content = data ?? 'stats');

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
                this.changeContent(null);
                // set the last online tooltip date
                this.setTippyOnlineStatus();
                console.log(data);

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
     * This method simply adds a fragment onto the url when switching between content on the page.
     * That allows the page to be reloaded and the user may remain on the same content the left off on.
     * This also is good for bookmarking the page in a specific view.
     */
    public changeContent(content: string): void {
        this.content = content;
        this.router.navigate(
            [`/u/${this.member.username}`],
            {
                relativeTo: this.route,
                fragment: content || null

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

        const content = this.member.dateJoined ? 'First seen on ' + formatDate(this.member.dateJoined, 'MMM d, y, h:mm a', 'en-US') : 'N/A';
        this.tippyService.setContent('first-seen', content);
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
