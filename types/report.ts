export enum FilterTypeEnum {
  RANGE = 'range',
  LIKE = 'like',
  EQ = 'eq',
}

export interface RangeValue {
  min: any;
  max: any;
}

export interface Filter {
  field: string;
  type: FilterTypeEnum;
  range?: RangeValue;
  eq?: any;
  like?: any;
}

export enum ReportTypeEnum {
  INVENTORY = 'INVENTORY',
  PRODUCT = 'PRODUCT',
  ORDER = 'ORDER',
}

export interface CreateReportDto {
  type: ReportTypeEnum;
  filters: Filter[];
  outputLocation: string;
}

export interface UpdateReportDto {
  type: ReportTypeEnum;
  filters: Filter[];
  outputLocation: string;
}

export interface Report {
  id: string;
  type: ReportTypeEnum;
  parameters: Filter[];
  generatedBy: string;
  generatedAt: Date;
  outputLocation: string;
}
