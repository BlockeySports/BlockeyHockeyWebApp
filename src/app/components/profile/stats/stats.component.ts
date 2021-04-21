import { formatDate } from '@angular/common';
import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { NgxTippyService } from 'ngx-tippy-wrapper';
import { Member } from 'src/app/models/Member';

@Component({
    selector: 'app-stats',
    templateUrl: './stats.component.html'
})
export class StatsComponent implements OnInit, AfterViewInit {

    @Input() member: Member;

    constructor(
        private tippyService: NgxTippyService
    ) { }

    ngOnInit(): void {
    }

    ngAfterViewInit(): void {
        setTimeout(
            () => {
                const content = this.member.dateJoined
                    ? 'First seen on ' + formatDate(this.member.dateJoined, 'MMM d, y, h:mm a', 'en-US')
                    : 'N/A';
                this.tippyService.setContent('first-seen', content);
            }, 500
        );
    }

    /**
     * Calculate the win-lose ratio
     */
    public calculateWinLoseRatio(wins: number, losses: number): number {
        if (wins === undefined || losses === undefined) { return 0; }
        if (losses === 0) { return wins; }
        return wins / losses;
    }
}
