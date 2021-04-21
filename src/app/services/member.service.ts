import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Member } from '../models/Member';

@Injectable({
    providedIn: 'root',
})
export class MemberService {

    resource = '/rest/v1/member';
    url = '';

    constructor(
        private http: HttpClient
    ) {
        if (location.origin.includes('localhost')) {
            this.url = `http://localhost:8080${this.resource}`;
        } else {
            this.url = `https://api.minecrafthockey.com${this.resource}`;
        }
        // this.url = `https://api.minecrafthockey.com${this.resource}`;
        // console.log(this.url);
    }

    /**
     * Get a Member from the database by username
     */
    public getMemberByUsername(username: string): Observable<Member> {
        const params = new HttpParams()
            .set('username', username);
        return this.http.get<Member>(this.url, { params });
    }
}
