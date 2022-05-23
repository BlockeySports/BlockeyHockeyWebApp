import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { MinecraftPlayer } from '../models/MinecraftPlayer';

@Injectable({
    providedIn: 'root',
})
export class PlayerService {

    constructor(
        private http: HttpClient
    ) { }

    getPlayerInfo(username: string): Observable<MinecraftPlayer> {
        return this.http.get<MinecraftPlayer>(`https://api.ashcon.app/mojang/v2/user/${username}`);
    }
}
