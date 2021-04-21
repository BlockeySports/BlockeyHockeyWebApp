import { AfterViewChecked, AfterViewInit, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { Punishment } from 'src/app/models/Punishment';
import { PlayerService } from 'src/app/services/player.service';

@Component({
    selector: 'app-infractions',
    templateUrl: './infractions.component.html'
})
export class InfractionsComponent implements OnInit, OnDestroy {

    @Input() punishments: Punishment[];


    constructor(
        private router: Router
    ) { }

    ngOnInit(): void {
    }

    public navigateToProfile(username: string): void {
        window.location.href = '/u/' + username;
    }

    ngOnDestroy(): void {
    }

}
