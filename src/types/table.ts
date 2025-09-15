export interface TableColumn<T = any> {
  id: string
  header: string
  accessor: keyof T | ((row: T) => any)
  width?: number
  minWidth?: number
  maxWidth?: number
}

export interface TableRow {
  id: string | number
  [key: string]: any
}

export interface TableProps<T extends TableRow = TableRow> {
  data: T[]
  columns: TableColumn<T>[]
  onRowSelect?: (row: T, selectedValues: string[]) => void
  height?: number
  width?: number
  searchQuery?: string
}

export interface ComboboxProps<T extends TableRow = TableRow> {
  data: T[]
  columns: TableColumn<T>[]
  displayColumns: string[]
  placeholder?: string
  onSelect?: (row: T, selectedValues: string[]) => void
  tableHeight?: number
  tableWidth?: number
}