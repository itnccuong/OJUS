export class CustomError extends Error {
  public name: string;
  public status: number;
  public data: any;
  constructor(name: string, message: string, status: number, data: any) {
    super(message);
    this.status = status;
    this.name = name;
    this.data = data;
  }
}
