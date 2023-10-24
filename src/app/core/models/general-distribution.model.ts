export class DistributionModel {
    branchCode: string;
    branchAddress: string;
    branchName: string;
    nibbsId: string;
    imeiNumber: string;
    deviceIpAddress: string;
    supervisorName: string;
    supervisorPhone: string;
    supervisorEmail: string;
    supervisorStaffId: string;
    tellerStaffId: string;
    tellerEmail: string;
    tellerName: string;
    tellerBvn: string;
    
    constructor (
        branchCode: string,
        branchAddress: string,
        branchName: string,
        nibbsId: string,
        imeiNumber: string,
        deviceIpAddress: string,
        supervisorName: string,
        supervisorPhone: string,
        supervisorEmail: string,
        supervisorStaffId: string,
        tellerStaffId: string,
        tellerEmail: string,
        tellerName: string,
        tellerBvn: string,
    ) {
        this.branchCode = branchCode;
        this.branchAddress= branchAddress;
        this.branchName= branchName;
        this.nibbsId= nibbsId;
        this.imeiNumber= imeiNumber;
        this.deviceIpAddress= deviceIpAddress;
        this.supervisorName= supervisorName;
        this.supervisorPhone = supervisorPhone;
        this.supervisorEmail= supervisorEmail;
        this.supervisorStaffId= supervisorStaffId;
        this.tellerStaffId= tellerStaffId;
        this.tellerEmail= tellerEmail;
        this.tellerName= tellerName;
        this.tellerBvn= tellerBvn;
    }
}