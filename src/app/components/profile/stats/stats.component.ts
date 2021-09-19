import { formatDate } from '@angular/common';
import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { NgxTippyService } from 'ngx-tippy-wrapper';
import { Member } from 'src/app/models/Member';
import { DateService } from 'src/app/services/date.service';

@Component({
    selector: 'app-stats',
    templateUrl: './stats.component.html'
})
export class StatsComponent implements OnInit, AfterViewInit {

    @Input() member: Member;
    @Input() isError;
    @Input() statisticsText;

    public isLoading = true;

    constructor(
        private tippyService: NgxTippyService,
        private dateService: DateService
    ) { }

    ngOnInit(): void {
        // display loading text
        this.statisticsText = 'Hang tight while we load your statistics.';
    }

    ngAfterViewInit(): void {
        this.updateFirstJoinedDate(1);
        // statistics not loading
        setTimeout(
            () => {
                if (this.member.hockeyStatistics.length === 0) {
                    // member has no statistics
                    this.isError = false;
                    this.statisticsText = 'You don\'t appear to have any statistics yet. Hop on the server and play a game!';
                } else if (this.member?.hockeyStatistics) {
                    this.isError = true;
                    this.statisticsText = 'There was an error loading your statistics. Try again later.';
                }
                this.isLoading = false;
                // attempt to update join date again
                this.updateFirstJoinedDate(0.5);
            }, 5000
        );
    }

    /**
     * Update the tippy message that displays the date of the player's first join.
     * @param seconds The number of seconds to wait before updating.
     */
    private updateFirstJoinedDate(seconds: number): void {
        setTimeout(
            () => {
                try {
                    const date = this.dateService.getDate(this.member.dateJoined);
                    const formattedDate = date
                        ? 'First seen on ' + formatDate(date, 'MMM d, y, h:mm a', 'en-US')
                        : 'N/A';
                    this.tippyService.setContent('first-seen', formattedDate);
                } catch (error) {
                    // swallow error
                }
            }, (seconds * 1000)
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
