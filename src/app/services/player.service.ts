import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Player } from '../models/Player';

@Injectable({
    providedIn: 'root',
})
export class PlayerService {

    constructor(
        private http: HttpClient
    ) { }

    getPlayerInfo(username: string): Observable<Player> {
        return this.http.get<Player>(`https://api.ashcon.app/mojang/v2/user/${username}`);
    }

    // getGreeting(name: string): Observable<any> {
    //     return this.http.get<any>(`http://localhost:8080/greeting?name=${name}`);
    // }
}
