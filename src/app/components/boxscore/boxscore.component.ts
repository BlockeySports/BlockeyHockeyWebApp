import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { BoxScore } from 'src/app/models/BoxScore';
import { BoxScoreService } from 'src/app/services/boxscore.service';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';

@Component({
    selector: 'app-boxscore',
    templateUrl: './boxscore.component.html'
})
export class BoxScoreComponent implements OnInit, OnDestroy {

    public pending = true;
    public boxScore: BoxScore = {
        uuid: '',
    };

    // subs
    public boxScoreSubscription: Subscription;

    constructor(
        private boxScoreService: BoxScoreService
    ) { }

    ngOnInit(): void {
        // get the username from the url
        this.boxScore.uuid = this.getUuidFromAddress();
        // set temporary tab title
        document.title = 'Loading Box Score...';
        // subscribe to the box score data
        this.boxScoreSubscription = this.boxScoreService.getBoxScore(this.boxScore.uuid).subscribe(
            (data: BoxScore) => {
                this.boxScore = data;
                // no longer pending
                this.pending = false;
                // set tab title to team codes
                document.title = this.boxScore.awayTeam.code + ' @ ' + this.boxScore.homeTeam.code + ' | ' + this.getBoxScoreDate();
            },
            (error) => {
                console.log(error);
            }
        );
    }

    /**
     * Get the box score uuid from the url address
     * occurring after the last slash and before an fragments.
     */
    private getUuidFromAddress(): string {
        const url = window.location.href;
        const lastSlash = url.lastIndexOf('/');
        // in case a fragment exists in url, only take everything before that
        return url.substr(lastSlash + 1).split('#')[0];
    }

    /**
     * Get the box score date in a human-readable format.
     */
    public getBoxScoreDate(): string {
        // if pending box score information, return empty string
        if (this.pending) { return ''; }
        dayjs.extend(localizedFormat);
        return dayjs(this.boxScore.gameTime).format('MMM D, YYYY');
    }

    /**
     * Get the box score time in a human-readable format.
     */
    public getBoxScoreTime(): string {
        // if pending box score information, return empty string
        if (this.pending) { return ''; }
        dayjs.extend(localizedFormat);
        return dayjs(this.boxScore.gameTime).format('LT');
    }

    public getBoxScoreGameNumber(): string {
        if (this.pending || !this.boxScore.isSeries) { return ''; }
        return 'Round ' + this.boxScore.roundNumber + ' Game ' + this.boxScore.gameNumber;
    }

    public getBoxScoreStreamLink(): string {
        if (this.pending || this.boxScore?.streamLink === undefined) { return ''; }
        return this.boxScore.streamLink;
    }

    public ngOnDestroy(): void {
        if (this.boxScoreSubscription) { this.boxScoreSubscription.unsubscribe(); }
    }
}
