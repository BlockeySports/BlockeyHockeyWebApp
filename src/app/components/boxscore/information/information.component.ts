import { Component, Input, OnInit } from '@angular/core';
import { BoxScore } from 'src/app/models/BoxScore';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import { ClipboardService } from 'ngx-clipboard';

@Component({
    selector: 'app-information',
    templateUrl: './information.component.html'
})
export class InformationComponent implements OnInit {

    @Input() boxScore: BoxScore;
    @Input() pending: boolean;

    constructor(
        private clipboardService: ClipboardService
    ) { }

    ngOnInit(): void { }

    /**
     * Get the box score date in a human-readable format.
     */
    public getBoxScoreDate(): string {
        // if pending box score information, return empty string
        if (this.pending || !this.boxScore?.date) { return ''; }
        dayjs.extend(localizedFormat);
        return dayjs(this.boxScore.date).format('MMM D, YYYY');
    }

    /**
     * Get the box score time in a human-readable format.
     */
    public getBoxScoreTime(): string {
        // if pending box score information, return empty string
        if (this.pending || !this.boxScore?.date) { return ''; }
        dayjs.extend(localizedFormat);
        return dayjs(this.boxScore.date).format('LT');
    }

    public getBoxScoreStreamLink(): string {
        if (this.pending || this.boxScore?.streamLink === undefined) { return ''; }
        return this.boxScore.streamLink;
    }

    public copyLink(): void {
        // copy link to clipboard
        this.clipboardService.copyFromContent(this.boxScore.streamLink);
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
