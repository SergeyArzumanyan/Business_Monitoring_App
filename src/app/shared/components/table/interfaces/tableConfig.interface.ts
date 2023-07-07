export interface ITableConfig<T> {
  TableItems: T | null;
  TableName: string;
  ItemName: string;
  ItemApiName: string;
  TableActions: boolean;
}
