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
    ) { }

    ngOnInit(): void {
    }

    public toggleDarkMode(): void {
        this.darkModeService.toggle();
    }

    public navigateHome(): void {
        this.router.navigate(['/']);
    }

}
