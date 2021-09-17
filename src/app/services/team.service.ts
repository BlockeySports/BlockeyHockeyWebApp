import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HockeyTeam } from '../models/HockeyTeam';

@Injectable({
    providedIn: 'root',
})
export class TeamService {

    resource = '/rest/v1';
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
     * Get a hockey team by id.
     * @param id The id of the team.
     * @returns an observable of the team
     */
    public getHockeyTeam(id: string): Observable<HockeyTeam> {
        const params = new HttpParams()
            .set('id', id);
        return this.http.get<HockeyTeam>(this.url.concat('/team'), { params });
    }

    /**
     * Get all hockey teams.
     * @returns an observable of the teams
     */
    public getHockeyTeams(): Observable<HockeyTeam[]> {
        return this.http.get<HockeyTeam[]>(this.url.concat('/teams'));
    }
}
