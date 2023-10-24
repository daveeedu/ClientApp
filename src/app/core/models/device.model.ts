export interface DeviceModel extends DeviceCreateModel{
  id: string | null;
  approvalStatus: string | null;
  branchCode: string | null;
  branchName: string | null;
  dateEnrolled: string | null;
  enrolledById: string | null;
  enrolledBy: string | null;
  ipAddress: string | null;
}

export interface DeviceCreateModel {
  identifier: string | null;
  nibbsId: string | null;
  type: number;
  state: number;
  branchId: string | null;
  ipAddress: string | null;
}

export interface DeviceEditModel {
  identifier: string | null;
  nibbsId: string | null;
}

export interface DeviceMoveModel {
  branchId: string | null,
  IpAddress: string | null
}
