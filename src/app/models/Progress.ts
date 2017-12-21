export enum ProgressStatus {
  PENDING,
  IN_PROGRESS,
  COMPLETE,
  ERROR
}

export class Progress {
  public status: ProgressStatus = ProgressStatus.PENDING;
  public percentage?: number = 0;
  public completedAmount?: number = null;
  public completedTotal?: number = null;
  public errors?: Error[] = [];
  public successMessage?: string = null;
  public description?: string = null;
  public data?: any = null;

  constructor (args?: Progress) {
    Object.assign(this, args);
  }

  public static isProgress (candidate: Progress & any): candidate is Progress {
    return candidate instanceof Progress;
  }
}
