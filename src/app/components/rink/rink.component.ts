import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ClipboardService } from 'ngx-clipboard';

@Component({
    selector: 'app-rink',
    templateUrl: './rink.component.html'
})
export class RinkComponent implements OnInit {

    public xCoord;
    public yCoord;
    public zCoord;

    public rinkName: string;
    public homeTeam: string;
    public location: string;
    public color: string;
    public icon: string;
    public description: string;

    @ViewChild('xml') xml: ElementRef;

    constructor(
        private clipboardService: ClipboardService
    ) { }

    ngOnInit(): void {
    }

    public copyXML(): void {
        const xmlText = this.xml.nativeElement.innerText;
        this.clipboardService.copyFromContent(xmlText);
        // turn copy xml button green
        document.getElementById('copy-xml').classList.add('bg-green-400', 'dark:bg-green-500');
        // remove copy xml button green after 2 second
        setTimeout(() => {
            document.getElementById('copy-xml').classList.remove('bg-green-400', 'dark:bg-green-500');
        }, 2000);
    }
}
