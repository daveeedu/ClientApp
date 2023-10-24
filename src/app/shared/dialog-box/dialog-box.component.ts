import { Component, Inject, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BranchModel } from 'src/app/core/models/branch.model';
import { DeviceModel } from 'src/app/core/models/device.model';


@Component({
  selector: 'nibss-dialog-box',
  templateUrl: './dialog-box.component.html',
  styleUrls: ['./dialog-box.component.scss'],
})
export class DialogBoxComponent {
  action: string;
  localData: any;

  constructor(
    public dialogRef: MatDialogRef<DialogBoxComponent>,
    @Optional()
    @Inject(MAT_DIALOG_DATA)
    public data: BranchModel | DeviceModel
  ) {
    this.localData = data;
    this.action = this.localData.action;
  }
  doAction() {
    this.dialogRef.close({ event: this.action, data: this.localData });
  }

  closeDialog() {
    this.dialogRef.close({ event: 'Cancel' });
  }
}
