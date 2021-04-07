import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DarkModeService } from 'src/app/services/dark-mode.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit {

    constructor(
        private router: Router,
        private darkModeService: DarkModeService
    ) {
        this.setDarkMode();
    }

    ngOnInit(): void {
    }

    public toggleDarkMode(): void {
        this.darkModeService.toggle();
    }

    public setDarkMode(): void {
        this.darkModeService.set();
    }

    public navigateHome(): void {
        this.router.navigate(['/']);
    }

}
