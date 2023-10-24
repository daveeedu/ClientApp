export interface ApiModel<T> {
  code: number;
  message: string;
  data: T | null;
  total: number | null;
}
