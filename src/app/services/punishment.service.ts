import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Punishment } from '../models/Punishment';

@Injectable({
    providedIn: 'root',
})
export class PunishmentService {

    resource = '/rest/v1/punishments';
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
     * Get all valid punishments for a member.
     */
    public getMemberPunishments(uuid: string): Observable<Punishment[]> {
        const params = new HttpParams()
            .set('uuid', uuid);
        return this.http.get<Punishment[]>(this.url, { params });
    }

    /**
     * Get all valid punishments for all members.
     */
    public getPunishments(): Observable<Punishment[]> {
        return this.http.get<Punishment[]>(this.url);
    }
}
