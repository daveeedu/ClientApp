import { Injectable } from '@angular/core';
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {Observable} from "rxjs";
import {
  ConfirmationDialogComponent,
  ConfirmationModel
} from "../../shared/confirmation-dialog/confirmation-dialog.component";
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class ConfirmDialogService {

  constructor(private readonly dialog: MatDialog) {}
  dialogRef: MatDialogRef<ConfirmationDialogComponent>;

  public open(options: ConfirmationModel) {
    this.dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: options.title,
        message: options.message,
        cancelText: options.cancelText,
        confirmText: options.confirmText,
        comment: options.comment,
      },
    });
  }
  public confirmed(): Observable<any> {
    return this.dialogRef.afterClosed().pipe(
      map((res) => {
        return res;
      })
    );
  }
}
