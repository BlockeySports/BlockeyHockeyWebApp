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

    public isLoading = true;
    public isError = false;
    public statisticsText = 'Hang tight while we load your statistics.';

    constructor(
        private tippyService: NgxTippyService
    ) { }

    ngOnInit(): void {
    }

    ngAfterViewInit(): void {
        // tippy
        setTimeout(
            () => {
                try {
                    const content = this.member.dateJoined
                        ? 'First seen on ' + formatDate(this.member.dateJoined, 'MMM d, y, h:mm a', 'en-US')
                        : 'N/A';
                    this.tippyService.setContent('first-seen', content);
                } catch (error) {
                    this.isError = true;
                }
            }, 1000
        );
        // statistics not loading
        setTimeout(
            () => {
                if (!this.member.hockeyStatistics[0].description) {
                    this.isLoading = false;
                    this.isError = true;
                    this.statisticsText = 'There might be a problem displaying your hockey statistics. Check back later.';
                }
            }, 4000
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
