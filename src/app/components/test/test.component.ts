import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
        private playerService: PlayerService
    ) { }

    ngOnInit(): void {

        this.name = this.getUsernameFromAddress();

        // const uuid = 'f5d5c3019ad34cb49cfda6b78e67734a';        // Flashee
        // const uuid = '069a79f444e94726a5befca90e38aaf5';        // Notch
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

}
