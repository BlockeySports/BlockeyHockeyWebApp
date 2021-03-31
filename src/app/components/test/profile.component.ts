import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PlayerService } from 'src/app/services/player.service';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html'
})
export class ProfileComponent implements OnInit {

    public name = '';
    public uuid = '';
    public profilePicture = '';

    constructor(
        private router: Router,
        private playerService: PlayerService
    ) { }

    ngOnInit(): void {

        this.playerService.getGreeting('Jake').subscribe(
            (data) => {
                console.log(data);
            }
        );

        this.name = this.getUsernameFromAddress();
        this.playerService.getPlayerInfo(this.name).subscribe(
            (data) => {
                if (data.uuid && data.username) {
                    this.name = data.username;
                    this.uuid = data.uuid;
                    this.profilePicture = `https://api.ashcon.app/mojang/v2/avatar/${this.uuid}/260`;
                }
                console.log(data);
            },
            (error) => {
                console.log(error);
            }
        );
    }

    getUsernameFromAddress(): string {
        const url = window.location.href;
        const lastSlash = url.lastIndexOf('/');
        return url.substr(lastSlash + 1);
    }

    search(name: string): void {
        this.router.navigate([`/u/${name}`]);
    }
}
