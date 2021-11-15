import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BoxScore } from '../models/BoxScore';
import { PlayerStatistic } from '../models/PlayerStatistic';

@Injectable({
    providedIn: 'root',
})
export class BoxScoreService {

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
     * Get a box score record from the database by its unique id.
     */
    public getBoxScore(id: string): Observable<BoxScore> {
        const params = new HttpParams()
            .set('id', id);
        return this.http.get<BoxScore>(this.url.concat('boxscore'), { params });
    }

    /**
     * Get all box score records from the database.
     */
    public getBoxScores(): Observable<BoxScore[]> {
        return this.http.get<BoxScore[]>(this.url.concat('boxscores'));
    }

    public getBoxScorePlayerStats(id: string): Observable<PlayerStatistic[]> {
        const params = new HttpParams()
            .set('id', id);
        return this.http.get<PlayerStatistic[]>(this.url.concat('box-score-player-statistics'), { params });
    }

    /**
     * Get the link to a box score.
     * Differentiates between localhost and production.
     * @param id The unique id of the box score.
     * @returns the link to the box score
     */
    public getBoxScoreLink(id: string): string {
        if (location.origin.includes('localhost')) {
            return `http://localhost:4200/b/${id}`;
        } else {
            return `https://blockeyhockey.net/b/${id}`;
        }
    }
}
