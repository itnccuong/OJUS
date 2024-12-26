export class CustomError extends Error {
  public status: number;
  public data: any;
  constructor(message: string, status: number, data?: any) {
    super(message);
    this.status = status;
    this.data = data;
  }
}
