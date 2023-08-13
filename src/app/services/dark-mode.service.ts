import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class DarkModeService {
  constructor(private cookieService: CookieService) {}

  public toggle(): void {
    // toggle 'dark' class on html element
    const html = document.getElementById('html');
    html.classList.toggle('dark');

    // toggle the value of the 'dark' cookie
    const isDark: boolean = this.cookieService.get('dark') === 'true';
    this.cookieService.set('dark', String(!isDark), { expires: 25000000, path: '/' });
  }

  public set(): void {
    // get html element
    const html = document.getElementById('html');

    // set body element dark class based on cookie value
    const isDark: boolean = this.cookieService.get('dark') === 'true';
    if (isDark) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
  }

  public get(): boolean {
    // get html element
    const html = document.getElementById('html');

    // set body element dark class based on cookie value
    const isDark: boolean = this.cookieService.get('dark') === 'true';
    return isDark;
  }
}
