import { Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Member } from 'src/app/models/Member';
import { PlayerGamePlayed } from 'src/app/models/PlayerGamePlayed';
import { PlayerStatisticService } from 'src/app/services/player-statistic.service';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import { BoxScoreService } from 'src/app/services/boxscore.service';

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
        private playerStatisticService: PlayerStatisticService,
        private boxScoreService: BoxScoreService
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

    /**
     * Get the color of the result text.
     */
    public getResultColor(game: PlayerGamePlayed): string {
        if (this.getResult(game) === 'Loss') return 'text-red-500';
        if (this.getResult(game) === 'Win') return 'text-green-500';
        else return 'text-blue-500';
    }

    /**
     * Get the winning or losing streak at this point in time.
     */
    public getStreak(game: PlayerGamePlayed): string {
        if (!game || !game?.date) return '';
        // get all games that come before this game and sort by date descending
        const priorGames = this.getGames().filter(g => g.date <= game.date).sort((a, b) => dayjs(b.date).diff(dayjs(a.date)));
        // define count
        let streak = 0;
        // if game is a win
        if (this.getResult(game) === 'Win') {
            for (const priorGame of priorGames) {
                // if game is a win, add to win streak
                if (this.getResult(priorGame) === 'Win') streak++;
                // if not a win, break
                else break;
            }
            return `W${streak}`;
        }
        // if game is a loss
        else if (this.getResult(game) === 'Loss') {
            for (const priorGame of priorGames) {
                // if game is a loss, add to loss streak
                if (this.getResult(priorGame) === 'Loss') streak++;
                // if not a loss, break
                else break;
            }
            return `L${streak}`;
        }
        // if game is a draw
        else {
            for (const priorGame of priorGames) {
                // if game is a draw, add to draw streak
                if (this.getResult(priorGame) === 'Draw') streak++;
                // if not a draw, break
                else break;
            }
            return `D${streak}`;
        }
    }

    /**
     * Get the link to the box score.
     * @param game The game to get the box score link for.
     * @returns the link to the box score
     */
    public getBoxScoreLink(game: PlayerGamePlayed): string {
        return this.boxScoreService.getBoxScoreLink(game.boxScoreId);
    }

    ngOnDestroy(): void {
        if (this.playerStatisticSubscription) this.playerStatisticSubscription.unsubscribe();
    }
}
