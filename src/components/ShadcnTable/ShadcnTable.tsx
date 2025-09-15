import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import type {
  TableProps,
  TableRow as TableRowType,
  TableColumn,
} from "../../types/table";
import styles from "./ShadcnTable.module.css";

export function ShadcnTable<T extends TableRowType = TableRowType>({
  data,
  columns,
  onRowSelect,
  height,
  width,
  searchQuery = "",
}: TableProps<T>) {
  const [selectedRowId, setSelectedRowId] = useState<string | number | null>(
    null
  );
  const [focusedRowIndex, setFocusedRowIndex] = useState<number>(-1);
  const rowRefs = useRef<(HTMLTableRowElement | null)[]>([]);

  // Filter data based on search query
  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return data;

    const query = searchQuery.toLowerCase();
    return data.filter((row) => {
      return columns.some((column) => {
        const value =
          typeof column.accessor === "function"
            ? column.accessor(row)
            : row[column.accessor as keyof T];
        return String(value).toLowerCase().includes(query);
      });
    });
  }, [data, columns, searchQuery]);

  const getCellValue = (row: T, column: TableColumn<T>) => {
    if (typeof column.accessor === "function") {
      return column.accessor(row);
    }
    return row[column.accessor as keyof T];
  };

  const handleRowClick = (row: T, index: number) => {
    setSelectedRowId(row.id);
    setFocusedRowIndex(index);

    if (onRowSelect) {
      const selectedValues = columns.map((column) =>
        String(getCellValue(row, column))
      );
      onRowSelect(row, selectedValues);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (filteredData.length === 0) return;

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        setFocusedRowIndex((prev) => {
          const newIndex = prev < filteredData.length - 1 ? prev + 1 : 0;
          rowRefs.current[newIndex]?.focus();
          return newIndex;
        });
        break;
      case "ArrowUp":
        event.preventDefault();
        setFocusedRowIndex((prev) => {
          const newIndex = prev > 0 ? prev - 1 : filteredData.length - 1;
          rowRefs.current[newIndex]?.focus();
          return newIndex;
        });
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        if (focusedRowIndex >= 0 && focusedRowIndex < filteredData.length) {
          handleRowClick(filteredData[focusedRowIndex], focusedRowIndex);
        }
        break;
      case "Home":
        event.preventDefault();
        setFocusedRowIndex(0);
        rowRefs.current[0]?.focus();
        break;
      case "End": {
        event.preventDefault();
        const lastIndex = filteredData.length - 1;
        setFocusedRowIndex(lastIndex);
        rowRefs.current[lastIndex]?.focus();
        break;
      }
    }
  };

  useEffect(() => {
    rowRefs.current = rowRefs.current.slice(0, filteredData.length);
  }, [filteredData.length]);

  if (filteredData.length === 0) {
    return (
      <div
        className={styles.tableContainer}
        style={{ height, width: width ? width : "100%" }}
      >
        <div className={styles.noData}>
          {searchQuery ? "No matching results found" : "No data available"}
        </div>
      </div>
    );
  }

  return (
    <div
      className={styles.tableContainer}
      style={{ height, width: width ? width : "100%" }}
    >
      <div className={styles.tableWrapper}>
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead
                  key={column.id}
                  style={{
                    width: column.width,
                    minWidth: column.minWidth || 120,
                    maxWidth: column.maxWidth,
                  }}
                >
                  {column.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((row, index) => (
              <TableRow
                key={row.id}
                ref={(el: HTMLTableRowElement | null) => {
                  rowRefs.current[index] = el;
                }}
                tabIndex={0}
                aria-selected={selectedRowId === row.id ? "true" : "false"}
                onClick={() => handleRowClick(row, index)}
                onKeyDown={handleKeyDown}
                onFocus={() => setFocusedRowIndex(index)}
              >
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    title={String(getCellValue(row, column))}
                  >
                    {String(getCellValue(row, column))}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
