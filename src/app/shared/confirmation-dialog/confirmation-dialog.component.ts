import {Component, HostListener, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

export interface ConfirmationModel {
  title: string;
  message: string;
  cancelText: string;
  confirmText: string;
  comment: string | null;
}

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html'
})

export class ConfirmationDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      cancelText: string;
      confirmText: string;
      message: string;
      title: string;
      comment: string;
    }
  ) {}

  public get hasComment(): boolean {
    return this.data.comment !== null;
  }

  closeModal(): void {
    if (this.hasComment) {
      this.closewithComment(false, this.data.comment);
    } else {
      this.close(false);
    }
  }

  public close(value: boolean) {
    this.dialogRef.close(value);
  }

  public closewithComment(value: boolean, comment: string) {
    this.dialogRef.close({ value, comment });
  }

  public confirm() {
    if (this.hasComment) {
      this.closewithComment(true, this.data.comment);
    } else {
      this.close(true);
    }
  }

  @HostListener('keydown.esc')
  public onEsc() {
    this.dialogRef.close();
  }
}
