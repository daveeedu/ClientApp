import { Component, OnInit } from '@angular/core';
import { ApprovalModel } from 'src/app/core/models/approval.model';
import { ApprovalsService } from 'src/app/core/services/approvals.service';
import { ConfirmDialogService } from 'src/app/core/services/confirm-dialog.service';
import { NotificationService } from 'src/app/core/utils/services/notification.service';
import { ConfirmationModel } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-approvals',
  templateUrl: './approvals.component.html',
  styleUrls: ['./approvals.component.scss']
})
export class ApprovalsComponent implements OnInit {
  loading = false;

  approvalList: ApprovalModel[] | null;
  constructor(
    private readonly service: ApprovalsService,
    private readonly notificationService: NotificationService,
    private readonly dialog: ConfirmDialogService
  ) {}

  ngOnInit(): void {
    this.fetchApprovals();
  }

  fetchApprovals() {
    this.loading = true;
    this.service.getApprovals().subscribe(
      (result) => {
        this.loading = false;

        this.approvalList = result.data ?? [];
      },
      (err) => {
        this.loading = false;
      }
    );
  }

  review(data: ApprovalModel) {
    const options: ConfirmationModel = {
      title: 'Review ',
      message: data.approvalKind,
      cancelText: 'Reject',
      confirmText: 'Approve',
      comment: '',
    };
    this.dialog.open(options);
    this.dialog.confirmed().subscribe((result) => {
      if (result?.value) {
        this.service
          .updateApprovals({
            approvalId: data.approvalId,
            comment: result.comment,
            state: 'Approve'
          })
          .subscribe(
            (_) => {
              this.loading = false;
              const dataIndex = this.approvalList?.indexOf(data);
              if (dataIndex !== undefined && dataIndex > -1) {
                const removeItem = this.approvalList?.splice(dataIndex, 1);
              }
            },
            (error) => {
              this.loading = false;
              this.notificationService.showError(error?.error?.message || error?.error);
            }
          );
      } else if (result?.value === false) {
        this.service
          .updateApprovals({
            approvalId: data.approvalId,
            comment: result?.comment,
            state: 'Reject'
          })
          .subscribe(
            (_) => {
              const dataIndex = this.approvalList?.indexOf(data);
              if (dataIndex !== undefined && dataIndex > -1) {
                const removeItem = this.approvalList?.splice(dataIndex, 1);
              }
              this.loading = false;
            },
            (error) => {
              this.loading = false;
              this.notificationService.showError(error?.error?.message || error?.error);
            }
          );
      }
    });
  }
}
