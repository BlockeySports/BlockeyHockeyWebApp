import { Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Member } from 'src/app/models/Member';
import { PlayerGamePlayed } from 'src/app/models/PlayerGamePlayed';
import { PlayerStatisticService } from 'src/app/services/player-statistic.service';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';

@Component({
    selector: 'app-games',
    templateUrl: './games.component.html'
})
export class GamesComponent implements OnInit, OnChanges, OnDestroy {

    @Input() member: Member;
    public games: PlayerGamePlayed[] = [];

    public isLoading = false;
    public loadingText = 'There might be a problem loading your recent games. Check back later.';

    // subscriptions
    private playerStatisticSubscription: Subscription;

    constructor(
        private playerStatisticService: PlayerStatisticService
    ) { }

    ngOnInit(): void { }

    ngOnChanges(): void {
        if (this.member?.uuid) {
            this.isLoading = true;
            this.loadingText = 'Loading your recent games...';
            this.playerStatisticService.getPlayerGamesPlayed(this.member.uuid).subscribe(
                (data: PlayerGamePlayed[]) => {
                    this.games = data;
                    this.isLoading = false;
                    this.loadingText = '';
                    // console.log(data);
                },
                (error) => {
                    // set loading message to error message
                    this.loadingText = 'There might be a problem loading your recent games. Check back later.';
                    this.isLoading = false;
                    console.log(error);
                }
            );
        }
    }

    public getGames(): PlayerGamePlayed[] {
        // return only unique box score by id
        return this.games.filter((game, index, self) =>
            index === self.findIndex((t) => (
                t.boxScoreId === game.boxScoreId
            ))
        );
    }

    public getDate(game: PlayerGamePlayed): string {
        if (!game?.date) return '';
        dayjs.extend(localizedFormat);
        return dayjs(game.date).format('MMM D, YYYY, h:mm A');
    }

    /**
     * Get the result of the game (win, less, or draw).
     * @returns the result
     */
    public getResult(game: PlayerGamePlayed): string {
        // if no winning team, game is draw
        if (!game?.winningTeam) return 'Draw';
        // if player on the winning team
        if (game.team === game.winningTeam) return 'Win';
        // otherwise, game is loss
        else return 'Loss';
    }

    public getBoxScoreLink(game: PlayerGamePlayed): string {
        return `https://blockeyhockey.net/b/${game.boxScoreId}`;
    }

    ngOnDestroy(): void {
        if (this.playerStatisticSubscription) this.playerStatisticSubscription.unsubscribe();
    }
}
