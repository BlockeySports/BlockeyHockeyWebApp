import { Component, Input, OnInit } from '@angular/core';
import { BoxScore } from 'src/app/models/BoxScore';
import { ClipboardService } from 'ngx-clipboard';
import { DateService } from 'src/app/services/date.service';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

@Component({
    selector: 'app-information',
    templateUrl: './information.component.html'
})
export class InformationComponent implements OnInit {

    @Input() boxScore: BoxScore;
    @Input() pending: boolean;

    constructor(
        private clipboardService: ClipboardService,
        private dateService: DateService
    ) { }

    ngOnInit(): void { }

    /**
     * Get the date from the box score from the date service.
     */
    public getDate(): Date {
        return this.dateService.getDate(this.boxScore.date);
    }

    /**
     * Get the box score date in a human-readable format.
     */
    public getBoxScoreDate(): string {
        // if pending box score information, return empty string
        if (this.pending || !this.boxScore?.date) { return ''; }
        return dayjs(this.getDate()).format('MMM D, YYYY');
    }

    /**
     * Get the box score time in a human-readable format.
     */
    public getBoxScoreTime(): string {
        // if pending box score information, return empty string
        if (this.pending || !this.boxScore?.date) { return ''; }
        // extend the dayjs plugin to format the time
        dayjs.extend(localizedFormat);
        // return formatted date
        return dayjs(this.getDate()).format('LT');
    }

    public getBoxScoreStreamLink(): string {
        if (this.pending || !this.boxScore?.stream) { return ''; }
        return this.boxScore.stream;
    }

    public copyLink(): void {
        // copy link to clipboard
        this.clipboardService.copyFromContent(this.boxScore.stream);
        // turn copy link button green
        document.getElementById('copy-link').classList.add('!text-green-500');
        document.getElementById('copy-link').classList.remove('hover:!text-yellow-500');
        // remove copy link button green after 2 second
        setTimeout(() => {
            document.getElementById('copy-link').classList.remove('!text-green-500');
            document.getElementById('copy-link').classList.add('hover:!text-yellow-500');
        }, 2000);
    }

}
