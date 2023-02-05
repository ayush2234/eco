import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
    providedIn: 'root'
})
export class SnackbarService {

    constructor(private _snackBar: MatSnackBar) { }

    showSuccess(message: string, closeText: string = "", duration: number = 3) {
        this._snackBar.open(message, closeText, {
            duration: duration * 1000,
            horizontalPosition: "right",
            verticalPosition: "top",
            panelClass: [
                "bg-green-100",
                "text-green-800",
                "rounded-none",
                "lg:rounded-[0.5rem]",
                "md:rounded-[0.5rem]",
                "sm:rounded-[0.5rem]",
                'absolute',
                'top-16',
                'lg:top-18',
                'md:top-18',
                'sm:top-18',
                'right-0',
                'lg:right-5',
                'md:right-5',
                'sm:right-5',
                'm-[0px]',
            ]
        });
    }

    showError(message: string, closeText: string = "", duration: number = 5) {
        this._snackBar.open(message, closeText, {
            duration: duration * 1000,
            panelClass: [
                "bg-red-100",
                "text-red-800",
                "rounded-none",
                "lg:rounded-[0.5rem]",
                "md:rounded-[0.5rem]",
                "sm:rounded-[0.5rem]",
                'absolute',
                'top-16',
                'lg:top-18',
                'md:top-18',
                'sm:top-18',
                'right-0',
                'lg:right-5',
                'md:right-5',
                'sm:right-5',
                'm-[0px]',
            ]
        });
    }
}
