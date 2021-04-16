import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Member } from '../models/Member';
import { Role } from '../models/Role';

@Injectable({
    providedIn: 'root',
})
export class RoleService {

    resource = '/rest/v1/roles';
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
        console.log(this.url);
    }

    /**
     * Get all existing roles.
     */
    public getAllRoles(): Observable<Role[]> {
        return this.http.get<Role[]>(this.url);
    }
}
