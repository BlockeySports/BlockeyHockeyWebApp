import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class DateService {

    /**
     * Get the date from the string returned by the back-end.
     */
    public getDate(dateString: any): Date {
        // create date from date string
        const date = new Date(dateString);
        // if in localhost
        if (window.location.hostname === 'localhost') {
            // subtract 3 hours
            date.setHours(date.getHours() - 3);
            // return date
            return date;
        }
        // return date as is
        return date;
    }
}
