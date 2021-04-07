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
        const toggle = document.getElementById('body');
        toggle.classList.toggle('dark');

        // toggle the value of the 'dark' cookie
        const isDark: boolean = this.cookieService.get('dark') === 'true';
        this.cookieService.set('dark', String(!isDark));
    }
}
