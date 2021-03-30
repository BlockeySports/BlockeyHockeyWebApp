import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PlayerService } from 'src/app/services/player.service';

@Component({
    selector: 'app-test',
    templateUrl: './test.component.html'
})
export class TestComponent implements OnInit {

    public name = '';
    public uuid = '';

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private playerService: PlayerService
    ) { }

    ngOnInit(): void {

        this.name = this.getUsernameFromAddress();
        this.playerService.getPlayerInfo(this.name).subscribe(
            (data) => {
                if (data.name && data.id) {
                    this.name = data.name;
                    this.uuid = data.id;
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
