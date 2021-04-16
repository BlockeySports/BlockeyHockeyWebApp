import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Member } from 'src/app/models/Member';
import { MemberService } from 'src/app/services/member.service';
import { PlayerService } from 'src/app/services/player.service';

import { NgxTippyService } from 'ngx-tippy-wrapper';
import { formatDate } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { RoleService } from 'src/app/services/role.service';

// tslint:disable: deprecation
@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html'
})
export class ProfileComponent implements OnInit, OnDestroy {

    public member: Member = {
        username: '',
    };

    public usernameColor = '#FFFFFF';
    public profilePicture = '';

    public server = 0;

    // which content to display (i.e. stats, trophies, infractions)
    // show stats content by default
    public content = 'stats';

    // Subs
    private memberSub?: Subscription;
    private roleSub?: Subscription;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private tippyService: NgxTippyService,
        private playerService: PlayerService,
        private memberService: MemberService,
        private titleService: Title,
        private roleService: RoleService
    ) { }

    ngOnInit(): void {

        this.server = Math.floor(Math.random() * 8) + 1;

        // set the content if specified in the url
        this.route.fragment.subscribe(data => this.content = data ?? 'stats');

        this.member.username = this.getUsernameFromAddress();
        this.titleService.setTitle(this.member.username + ' \u2014 Blockey Hockey Network');

        // tslint:disable: deprecation
        this.memberSub = this.memberService.getMemberByUsername(this.member.username).subscribe(
            (data) => {
                // set the member
                this.member = data;
                // add temp roles
                this.addRoles();
                // set the browser tab title
                this.titleService.setTitle(this.member.username + ' \u2014 Blockey Hockey Network');
                // convert dates to javascript dates
                this.member.lastOnline = new Date(this.member.lastOnline);
                this.member.dateJoined = new Date(this.member.dateJoined);
                // set the last online tooltip date
                this.setTippyOnlineStatus();
                // console.log(data);

            },
            (error) => {
                // set the last online tooltip date
                this.setTippyOnlineStatus();
                // add temp roles
                this.addRoles();
                // set username color
                this.usernameColor = this.member.roles[0].color;
                console.log(error);
            }
        );


        this.playerService.getPlayerInfo(this.member.username).subscribe(
            (data) => {
                if (data.uuid) {
                    this.profilePicture = `https://api.ashcon.app/mojang/v2/avatar/${data.uuid}/260`;
                }
            },
            (error) => {
                console.log(error);
            }
        );
    }

    private addRoles(): void {
        // this.member.og = true;
        this.roleSub = this.roleService.getAllRoles().subscribe(
            (data) => {
                this.member.roles = data;
                // set username color
                this.usernameColor = this.member.roles[0].background;
            },
            (error) => {
                console.log(error);
            }
        );

        // this.member.roles = [
        //     {
        //         name: 'Administrator',
        //         color: '#F7A738'
        //     },
        //     // {
        //     //     name: 'Senior Moderator',
        //     //     color: '#B91C1C'
        //     // },
        //     // {
        //     //     name: 'Moderator',
        //     //     color: '#DC2626'
        //     // },
        //     // {
        //     //     name: 'Junior Moderator',
        //     //     color: '#F87171'
        //     // },
        //     // {
        //     //     name: 'Helper',
        //     //     color: '#60A5FA'
        //     // },
        //     {
        //         name: 'Dev',
        //         color: '#59dd3b'
        //     }
        // ];
    }

    /**
     * This method simply adds a fragment onto the url when switching between content on the page.
     * That allows the page to be reloaded and the user may remain on the same content the left off on.
     * This also is good for bookmarking the page in a specific view.
     */
    public changeContent(content: string): void {
        this.content = content;
        this.router.navigate(
            [],
            {
                relativeTo: this.route,
                fragment: content

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
        if (this.roleSub) { this.roleSub.unsubscribe(); }
    }
}
