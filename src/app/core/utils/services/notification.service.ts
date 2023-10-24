import { MatSnackBar } from '@angular/material/snack-bar';
import { NgZone, Injectable } from '@angular/core';
import { notificationDuration } from '../constants';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(
    public readonly snackBar: MatSnackBar,
    private readonly zone: NgZone
  ) {}
  showError(
    message: string,
    time: number = notificationDuration,
    label = '',
    action: any = () => {
      this.snackBar.dismiss();
    }
  ) {
    this.zone.runOutsideAngular(() => {
      this.snackBar
        .open(message || 'Error encountered', label, {
          duration: time,
          verticalPosition: 'bottom',
          horizontalPosition: 'center',
          panelClass: ['error'],
        })
        .onAction()
        .subscribe(action);
    });
  }

  showSuccess(
    message: string,
    time: number = notificationDuration,
    label = '',
    action: any = () => {
      this.snackBar.dismiss();
    }
  ): void {
    this.zone.runOutsideAngular(() => {
      this.snackBar
        .open(message || 'Success', label, {
          duration: time,
          verticalPosition: 'bottom',
          horizontalPosition: 'center',
          panelClass: ['success'],
        })
        .onAction()
        .subscribe(action);
    });
  }
}
