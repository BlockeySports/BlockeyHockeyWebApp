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
        og: true,
        roles: [
            {
                name: 'Administrator',
                color: '#f7b738'
            },
            // {
            //     name: 'Rank #1',
            //     color: '#10b981'
            // },
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
            // {
            //     name: 'Developer',
            //     color: '#59dd3b'
            // }
        ]
    };
    public profilePicture = '';

    public hours = 0;
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

        this.memberSub = this.memberService.getMemberByUsername(this.member.username).subscribe(
            (data) => {
                this.member = data;
                this.titleService.setTitle(this.member.username + ' \u2014 Blockey Hockey Network');
                this.setTippyDateLastOnline();
                console.log(data);
            },
            (error) => {
                this.setTippyDateLastOnline();
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

    private setTippyDateLastOnline(): void {
        let lastOnline: any = this.member.lastOnline;
        lastOnline = lastOnline ? formatDate(new Date(lastOnline), 'MMM d, y, h:mm a', 'en-US') : 'N/A';
        this.tippyService.setContent('last-online-date', lastOnline);
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
