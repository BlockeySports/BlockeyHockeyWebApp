import { formatDate } from '@angular/common';
import { Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import dayjs from 'dayjs';
import updateLocale from 'dayjs/plugin/updateLocale';
import { Subscription } from 'rxjs';
import { Member } from 'src/app/models/Member';
import { Punishment } from 'src/app/models/Punishment';
import { DateService } from 'src/app/services/date.service';
import { PunishmentService } from 'src/app/services/punishment.service';

@Component({
    selector: 'app-infractions',
    templateUrl: './infractions.component.html'
})
export class InfractionsComponent implements OnInit, OnChanges, OnDestroy {

    @Input() member: Member;

    public isLoading = false;
    public punishmentText = 'There might be a problem loading punishments. Check back later.';

    // Subs
    private punishmentSub: Subscription;

    constructor(
        private punishmentService: PunishmentService,
        private dateService: DateService
    ) {

    }

    ngOnInit(): void {

    }

    ngOnChanges(): void {
        if (this.member.uuid) {
            this.isLoading = true;
            this.punishmentText = 'Loading punishments. The longer this takes, the worse you\'ve been!';
            this.punishmentSub = this.punishmentService.getMemberPunishments(this.member.uuid).subscribe(
                (data) => {
                    this.member.punishments = data;
                    this.punishmentText = data.length === 0 ? 'You\'ve been good! No punishments to display.' : '';
                },
                (error) => {
                    console.log(error);
                    this.punishmentText = 'There might be a problem loading punishments. Check back later.';
                    this.isLoading = false;
                },
                () => {
                    this.isLoading = false;
                }
            );
        }
    }

    /**
     * Get the formatted date of a punishment.
     * @returns the formatted punishment date
     */
    public getPunishmentDate(punishment: Punishment): string {
        dayjs.extend(updateLocale);
        // update locale to custom locale
        dayjs.updateLocale('en', {
            relativeTime: {
                // relative time format strings, keep %s %d as the same
                future: 'in %s', // e.g. in 2 hours, %s been replaced with 2hours
                past: '%s ago',
                s: 'a few seconds',
                m: '1 minute',
                mm: '%d minutes',
                h: '1 hour',
                hh: '%d hours', // e.g. 2 hours, %d been replaced with 2
                d: '1 day',
                dd: '%d days',
                M: '1 month',
                MM: '%d months',
                y: '1 year',
                yy: '%d years'
            }
        });
        // get date from date service
        const date = this.dateService.getDate(punishment.date);
        return formatDate(date, 'MMM d, yyyy, h:mm a', 'en-US');
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

    public navigateToProfile(username: string): void {
        window.location.href = '/u/' + username;
    }

    ngOnDestroy(): void {
        if (this.punishmentSub) { this.punishmentSub.unsubscribe(); }
    }

}
