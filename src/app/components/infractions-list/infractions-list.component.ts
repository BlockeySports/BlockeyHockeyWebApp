import { Component, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Punishment } from 'src/app/models/Punishment';
import { DateService } from 'src/app/services/date.service';
import { PunishmentService } from 'src/app/services/punishment.service';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import { formatDate } from '@angular/common';

@Component({
    selector: 'app-infractions-list',
    templateUrl: './infractions-list.component.html'
})
export class InfractionsListComponent implements OnInit, OnDestroy {

    public punishments: Punishment[];

    public loadingMessage = '';
    public isLoading = true;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private punishmentService: PunishmentService,
        private titleService: Title,
        private dateService: DateService
    ) { }

    // Subs
    private punishmentSub: Subscription;


    ngOnInit(): void {
        // set the browser tab title
        this.titleService.setTitle('Infractions \u007c Blockey Hockey Network');
        // set loading text
        this.loadingMessage = 'Loading all punishments';
        this.punishmentSub = this.punishmentService.getPunishments().subscribe(
            (data) => {
                // set the punishments
                this.punishments = data;
                console.log(this.punishments);
                // not loading anymore
                this.isLoading = false;
                // no loading text
                this.loadingMessage = '';
            },
            (error) => {
                console.log(error);
                // not loading anymore
                this.isLoading = false;
                // error loading text
                this.loadingMessage = 'There was an error in loading punishments.';
            }
        );
    }

    public getPunishmentColor(type: string): string {
        type = type.toLowerCase();
        if (type.includes('ban')) {
            return '#DC2626';
        } else if (type.includes('kick')) {
            return '#F97316';
        } else if (type.includes('mute')) {
            return '#FACC15';
        } else if (type.includes('warn')) {
            return '#FB7185';
        } else {
            return 'currentColor';
        }
    }

    /**
     * Get the formatted date of a punishment.
     * @returns the formatted punishment date
     */
    public getPunishmentDate(punishment: Punishment): string {
        // get date from date service
        const date = this.dateService.getDate(punishment.date);
        return formatDate(date, 'MMM d, y, h:mm a', 'en-US');
    }

    public navigateToProfile(username: string): void {
        window.location.href = '/u/' + username;
    }

    ngOnDestroy(): void {
        if (this.punishmentSub) { this.punishmentSub.unsubscribe(); }
    }
}
