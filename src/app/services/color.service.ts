import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class ColorService {

    constructor() { }

    /**
     * Get the color that contrasts with the given color.
     * Either black or white will be returned.
     * @param color The color to contrast.
     * @returns The color that contrasts best with the given color (black or white).
     */
    public getContrast(hexColor: string): string {
        // if hex color is null, return null
        if (!hexColor) return null;
        // if a leading # is provided, remove it
        if (hexColor.slice(0, 1) === '#') hexColor = hexColor.slice(1);
        // if a three-character hex code, make six-character
        if (hexColor.length === 3) hexColor = hexColor.split('').map(hex => hex + hex).join('');
        // convert to RGB value
        const r = parseInt(hexColor.substr(0, 2), 16);
        const g = parseInt(hexColor.substr(2, 2), 16);
        const b = parseInt(hexColor.substr(4, 2), 16);
        // get YIQ ratio
        const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
        // check contrast
        return (yiq >= 128) ? 'black' : 'white';
    }
}
