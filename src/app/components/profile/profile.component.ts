import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Member } from 'src/app/models/Member';
import { MemberService } from 'src/app/services/member.service';
import { PlayerService } from 'src/app/services/player.service';

import { NgxTippyService } from 'ngx-tippy-wrapper';
import { formatDate } from '@angular/common';
import { Title } from '@angular/platform-browser';

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

    // Subs
    private memberSub?: Subscription;

    constructor(
        private router: Router,
        private tippyService: NgxTippyService,
        private playerService: PlayerService,
        private memberService: MemberService,
        private titleService: Title
    ) { }

    ngOnInit(): void {

        this.server = Math.floor(Math.random() * 8) + 1;

        this.member.username = this.getUsernameFromAddress();
        this.titleService.setTitle(this.member.username + ' \u2014 Blockey Hockey Network');

        // tslint:disable: deprecation
        this.memberSub = this.memberService.getMemberByUsername(this.member.username).subscribe(
            (data) => {
                // set the member
                this.member = data;
                // add temp roles
                this.addRoles();
                // set username color
                this.usernameColor = this.member.roles[0].color;
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
                    // name = data.username;
                    // this.uuid = data.uuid;
                    this.profilePicture = `https://api.ashcon.app/mojang/v2/avatar/${data.uuid}/260`;
                }
            },
            (error) => {
                console.log(error);
            }
        );
    }

    private addRoles(): void {
        this.member.og = true;
        this.member.roles = [
            {
                name: 'Administrator',
                color: '#F7A738'
            },
            // {
            //     name: 'Senior Moderator',
            //     color: '#B91C1C'
            // },
            // {
            //     name: 'Moderator',
            //     color: '#DC2626'
            // },
            // {
            //     name: 'Junior Moderator',
            //     color: '#F87171'
            // },
            // {
            //     name: 'Helper',
            //     color: '#60A5FA'
            // },
            {
                name: 'Dev',
                color: '#59dd3b'
            }
        ];
    }

    private setTippyOnlineStatus(): void {
        let lastOnline: any = this.member.lastOnline;
        lastOnline = lastOnline ? formatDate(new Date(lastOnline), 'MMM d, y, h:mm a', 'en-US') : 'N/A';
        this.tippyService.setContent('last-online-date', lastOnline);
        this.tippyService.setContent('online-status', this.member.online ? 'Online' : 'Offline');
    }

    getUsernameFromAddress(): string {
        const url = window.location.href;
        const lastSlash = url.lastIndexOf('/');
        return url.substr(lastSlash + 1);
    }

    search(name: string): void {
        this.router.navigate([`/u/${name}`]);
    }

    ngOnDestroy(): void {
        if (this.memberSub) { this.memberSub.unsubscribe(); }
    }
}
