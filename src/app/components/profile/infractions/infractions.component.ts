import { AfterViewChecked, AfterViewInit, Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { Member } from 'src/app/models/Member';
import { Punishment } from 'src/app/models/Punishment';
import { PlayerService } from 'src/app/services/player.service';
import { PunishmentService } from 'src/app/services/punishment.service';

@Component({
    selector: 'app-infractions',
    templateUrl: './infractions.component.html'
})
export class InfractionsComponent implements OnInit, OnChanges, OnDestroy {

    @Input() member: Member;

    public isLoading = true;
    public punishmentsText = 'Loading punishments. The longer this takes, the worse you\'ve been!';

    // Subs
    private punishmentSub: Subscription;

    constructor(
        private punishmentService: PunishmentService
    ) { }

    ngOnInit(): void {
    }

    ngOnChanges(): void {
        if (this.member.uuid) {
            this.punishmentSub = this.punishmentService.getMemberPunishments(this.member.uuid).subscribe(
                (data) => {
                    this.member.punishments = data;
                    this.isLoading = false;
                },
                (error) => {
                    console.log(error);
                    this.isLoading = false;
                }
            );
        }
    }

    public navigateToProfile(username: string): void {
        window.location.href = '/u/' + username;
    }

    ngOnDestroy(): void {
        if (this.punishmentSub) { this.punishmentSub.unsubscribe(); }
    }

}
