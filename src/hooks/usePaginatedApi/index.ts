export { usePaginatedApi as usePaginatedApi } from "./usePaginatedApi";

export type PaginationParamsModel = {
  userId?: number;
  page?: number;
  limit?: number;
  pagination?: boolean;
  type?: string;
  actionType?: string;
  keyword?: string;
};

// import { PaginationParamsModel as PaginationParamsModel } from "./paginationParamsModel";

// export default PaginationParamsModel;
