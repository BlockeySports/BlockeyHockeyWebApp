import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Member } from 'src/app/models/Member';
import { MemberService } from 'src/app/services/member.service';
import { PlayerService } from 'src/app/services/player.service';

import { NgxTippyService } from 'ngx-tippy-wrapper';
import { formatDate } from '@angular/common';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html'
})
export class ProfileComponent implements OnInit, OnDestroy {

    public member: Member = {
        username: ''
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
        private memberService: MemberService
    ) { }

    ngOnInit(): void {

        this.hours = Math.floor(Math.random() * 15) + 1;
        this.server = Math.floor(Math.random() * 8) + 1;

        this.member.username = this.getUsernameFromAddress();

        this.memberSub = this.memberService.getMemberByUsername(this.member.username).subscribe(
            (data) => {
                this.member = data;
                this.setTippyDateLastOnline();
                console.log(data);
            },
            (error) => {
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
        lastOnline = formatDate(new Date(lastOnline), 'MMM d, y, h:mm a', 'en-US');
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
