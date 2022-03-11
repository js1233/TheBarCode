export type ListApiSuccessResponseModel<T> = {
  message: string;
  data: T[];
  pagination?: Pagination;
};

export type Pagination = {
  total: number;
  current: number;
  first: number;
  last: number;
  from: number;
  to: number;
  previous: number;
  next: number;
  pages: number[];
};
