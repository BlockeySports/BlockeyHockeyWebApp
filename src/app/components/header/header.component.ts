import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DarkModeService } from 'src/app/services/dark-mode.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit {

    @ViewChild('playerSearch') playerSearchInput: ElementRef;
    public isLoading = false;

    constructor(
        private router: Router,
        private darkModeService: DarkModeService
    ) {
        this.setDarkMode();
    }

    ngOnInit(): void { }

    public toggleDarkMode(): void {
        this.darkModeService.toggle();
    }

    public setDarkMode(): void {
        this.darkModeService.set();
    }

    public navigateHome(): void {
        this.router.navigate(['/']);
    }

    public navigateToProfile(username: string, newTab: boolean): void {
        if (username) {
            this.isLoading = true;
            const url = `${window.location.origin}/u/${username}`;
            if (newTab) {
                // open url in new tab
                window.open(url, '_blank');
                this.isLoading = false;
                // clear input
                this.playerSearchInput.nativeElement.value = '';
            } else {
                // open url in same tab
                window.location.href = `/u/${username}`;
            }
            // blur the keyboard
            this.playerSearchInput.nativeElement.blur();
        }
    }
}
