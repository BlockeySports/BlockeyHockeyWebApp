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

    getPlayerInfo(uuid: string): Observable<Player> {
        return this.http.get<Player>(`https://www.mc-heads.net/minecraft/profile/${uuid}`);
    }

}
