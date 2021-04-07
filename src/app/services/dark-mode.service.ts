import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class DarkModeService {

    public toggle(): void {
        const toggle = document.getElementById('body');
        toggle.classList.toggle('dark');
    }
}
