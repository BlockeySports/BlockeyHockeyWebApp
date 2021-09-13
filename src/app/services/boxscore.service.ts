import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BoxScore } from '../models/BoxScore';

@Injectable({
    providedIn: 'root',
})
export class BoxScoreService {

    resource = '/rest/v1/boxscore';
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
     * Get a box score record from the database by its uuid.
     */
    public getBoxScore(uuid: string): Observable<BoxScore> {
        const params = new HttpParams()
            .set('uuid', uuid);
        return this.http.get<BoxScore>(this.url, { params });
    }
}
