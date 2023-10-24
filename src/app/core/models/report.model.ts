export interface staff {
    staffId: string;
    staffName: string;
    role: string;
    branchName: string
    branchCode: string
}

export interface FeedbackModel {
    staffId: number;
    staffName: string;
    staff: staff;
    branchName: string;
    totalTransactions: number;
    excellent: number;
    veryGood: number;
    good: number;
    average: number;
    poor: number;
    percentage: number;
    averageRating: number;
    totalRatedTransaction: number;
}
