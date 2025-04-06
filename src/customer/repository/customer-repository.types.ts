export enum FilterEnum {
  CONSUMERS = 'consumers',
  DISTRIBUTORS = 'distributors',
}

export interface FindCustomersByQueryRequest {
  page: number;
  pageSize: number;
  year: string;
  name?: string;
  distributor?: string;
  query?: string;
  type: FilterEnum;
}
