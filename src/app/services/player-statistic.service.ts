import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BoxScore } from '../models/BoxScore';
import { HockeyPlayerStatistic } from '../models/HockeyPlayerStatistic';
import { PlayerLeaderboard } from '../models/PlayerLeaderboard';
import { PlayerStatistic } from '../models/PlayerStatistic';

@Injectable({
    providedIn: 'root',
})
export class PlayerStatisticService {

    resource = '/rest/v1/';
    url = '';

    constructor(
        private http: HttpClient
    ) {
        if (location.origin.includes('localhost')) {
            this.url = `http://localhost:8080${this.resource}`;
        } else {
            this.url = `https://api.blockeyhockey.net${this.resource}`;
        }
    }

    /**
     * Get player statistic from the database by player's uuid.
     * @param uuid The player's uuid.
     */
    public getPlayerStatisticsOnProfile(uuid: string): Observable<HockeyPlayerStatistic[]> {
        const params = new HttpParams()
            .set('uuid', uuid);
        return this.http.get<HockeyPlayerStatistic[]>(this.url.concat('player-statistics'), { params });
    }

    /**
     * Get player statistics from the database for a box score.
     * @param boxScore The box score.
     */
    public getPlayerStatistics(boxScore: BoxScore): Observable<HockeyPlayerStatistic[]> {
        const params = new HttpParams()
            .set('box-score', boxScore.id);
        return this.http.get<HockeyPlayerStatistic[]>(this.url.concat('player-statistics'), { params });
    }

    /**
     * Get player games played from the database by player's uuid.
     * @param uuid The player's uuid.
     */
    // public getPlayerGamesPlayed(uuid: string): Observable<PlayerGamePlayed[]> {
    //     const params = new HttpParams()
    //         .set('uuid', uuid);
    //     return this.http.get<PlayerGamePlayed[]>(this.url.concat('player-game-played'), { params });
    // }

    /**
     * Get all on-ice player records for a player.
     * @param uuid The player's uuid.
     */
    // public getOnIcePlayers(uuid: string): Observable<BoxScoreOnIcePlayer[]> {
    //     const params = new HttpParams()
    //         .set('uuid', uuid);
    //     return this.http.get<BoxScoreOnIcePlayer[]>(this.url.concat('on-ice-players'), { params });
    // }

    /**
     * Get player leaderboard.
     */
    public getLeaderboard(): Observable<PlayerLeaderboard[]> {
        return this.http.get<PlayerLeaderboard[]>(this.url.concat('leaderboard'));
    }
}
