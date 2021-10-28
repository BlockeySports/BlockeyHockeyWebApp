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

    /**
     * Get the games that should be displayed publicly on the member's profile.
     * Filter out games where the player only dressed or wasn't on the primary team.
     */
    public getGames(): PlayerGamePlayed[] {
        return this.games
            // only include records in which primary team is true
            .filter(game => game.isPrimaryTeam && game.isPlayed)
            // filter out duplicate games (likely due to multiple hockey positions)
            .filter((game, index, self) =>
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
        // if game is loss
        else if (game.team !== game.winningTeam) return 'Loss';
        // otherwise, game does not count to streak
        else return 'None';
    }

    public didMeetRequirements(game: PlayerGamePlayed): boolean {
        if (!game) return false;
        return game.awayPlayerCount >= 3 && game.homePlayerCount >= 3 && game.totalPlayerCount >= 6;
    }

    /**
     * Get the color of the result text.
     */
    public getResultColor(game: PlayerGamePlayed): string {
        if (!this.didMeetRequirements(game)) return 'text-black-50 dark:text-white/40';
        else if (this.getResult(game) === 'Win') return 'text-green-500';
        else if (this.getResult(game) === 'Loss') return 'text-red-500';
        else if (this.getResult(game) === 'Draw') return 'text-blue-500';
        else return 'text-black-50 dark:text-white/40';
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
            if (!this.didMeetRequirements(game)) return 'W';
            for (const priorGame of priorGames) {
                // if prior game should not be counted, continue
                if (this.getResult(priorGame) === 'None') continue;
                // if prior game is a win, add to win streak
                if (this.getResult(priorGame) === 'Win') streak++;
                // if not a win, break
                else break;
            }
            return `W${streak}`;
        }
        // if game is a loss
        else if (this.getResult(game) === 'Loss') {
            if (!this.didMeetRequirements(game)) return 'L';
            for (const priorGame of priorGames) {
                // if prior game should not be counted, continue
                if (this.getResult(priorGame) === 'None') continue;
                // if prior game is a loss, add to loss streak
                if (this.getResult(priorGame) === 'Loss') streak++;
                // if not a loss, break
                else break;
            }
            return `L${streak}`;
        }
        // if game is a draw
        else {
            for (const priorGame of priorGames) {
                if (!this.didMeetRequirements(game)) return 'D';
                // if prior game should not be counted, continue
                if (this.getResult(priorGame) === 'None') continue;
                // if prior game is a draw, add to draw streak
                if (this.getResult(priorGame) === 'Draw') streak++;
                // if not a draw, break
                else break;
            }
            return `D${streak}`;
        }
    }

    /**
     * Get the total time on ice for all games sharing the same box score id.
     * This counts time on ice if the player played for both teams during the game.
     */
    public getTimeOnIce(game: PlayerGamePlayed): number {
        if (!game) return 0;
        let timeOnIce = 0;
        this.games.forEach(g => {
            if (g.boxScoreId === game.boxScoreId) {
                timeOnIce += g.timeOnIce;
            }
        });
        return timeOnIce;
    }

    /**
     * Get the score of the game.
     */
    public getScore(game: PlayerGamePlayed): string {
        if (!game) return '';
        // if game went to overtime
        if (game.lastPeriod > 3) {
            return `${game.awayGoals} – ${game.homeGoals} / ${game.lastPeriod > 4 ? (game.lastPeriod - 3) : ''}OT`;
        }
        return `${game.awayGoals} – ${game.homeGoals}`;
    }

    /**
     * Get the tippy tooltip text for the streak.
     */
    public getStreakTooltip(game: PlayerGamePlayed): string {
        if (!game) return '';
        // get number only from string streak
        const streak: number = +this.getStreak(game).replace(/[^0-9]/g, '');
        if (!this.didMeetRequirements(game)) return 'Stats not counted for this game';
        else if (this.getResult(game) === 'Win') return streak + (streak > 1 ? ' wins' : ' win') + ' in a row';
        else if (this.getResult(game) === 'Loss') return streak + (streak > 1 ? ' losses' : ' loss') + ' in a row';
        else if (this.getResult(game) === 'Draw') return streak + (streak > 1 ? ' draws' : ' draw') + ' in a row';
        else return 'Stats not counted for this game';
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
