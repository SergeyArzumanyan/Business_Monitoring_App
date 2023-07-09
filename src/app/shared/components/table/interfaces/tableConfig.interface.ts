export interface ITableConfig<T> {
  TableItems: T | null;
  TableName: string;
  ItemName: string;
  ItemEndPoint: string;
  TableActions: boolean;
}
