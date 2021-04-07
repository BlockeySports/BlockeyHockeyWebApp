import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
    providedIn: 'root',
})
export class DarkModeService {

    constructor(
        private cookieService: CookieService
    ) { }

    public toggle(): void {
        // toggle 'dark' class on body element
        const body = document.getElementById('body');
        body.classList.toggle('dark');

        // toggle the value of the 'dark' cookie
        const isDark: boolean = this.cookieService.get('dark') === 'true';
        this.cookieService.set('dark', String(!isDark));
    }

    public set(): void {
        // get body element
        const body = document.getElementById('body');

        // set body element dark class based on cookie value
        const isDark: boolean = this.cookieService.get('dark') === 'true';
        if (isDark) {
            body.classList.add('dark');
        } else {
            body.classList.remove('dark');
        }
    }
}
