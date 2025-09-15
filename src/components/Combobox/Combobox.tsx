import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, X, Search } from "lucide-react";
import type { ComboboxProps, TableRow } from "../../types/table";
import { SimpleTable } from "../SimpleTable/SimpleTable";
import { ShadcnTable } from "../ShadcnTable/ShadcnTable";
import styles from "./Combobox.module.css";

export function Combobox<T extends TableRow = TableRow>({
  data,
  columns,
  displayColumns,
  placeholder = "Select an option...",
  onSelect,
  tableHeight = 300,
  tableWidth = 500,
  variant = "simple",
}: ComboboxProps<T> & { variant?: "simple" | "shadcn" }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedRow, setSelectedRow] = useState<T | null>(null);
  const [selectedValues, setSelectedValues] = useState<string[]>([]);

  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const displayText =
    selectedValues.length > 0 ? selectedValues.join(" | ") : placeholder;

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      // Focus search input when opening
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleRowSelect = (row: T, values: string[]) => {
    const displayValues = displayColumns.map((columnId) => {
      const column = columns.find((col) => col.id === columnId);
      if (!column) return "";

      if (typeof column.accessor === "function") {
        return String(column.accessor(row));
      }
      return String(row[column.accessor as keyof T]);
    });

    setSelectedRow(row);
    setSelectedValues(displayValues);
    setIsOpen(false);
    setSearchQuery("");

    if (onSelect) {
      onSelect(row, displayValues);
    }

    // Return focus to trigger
    triggerRef.current?.focus();
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedRow(null);
    setSelectedValues([]);
    setSearchQuery("");
    triggerRef.current?.focus();
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsOpen(false);
      triggerRef.current?.focus();
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  const TableComponent = variant === "shadcn" ? ShadcnTable : SimpleTable;

  return (
    <div className={styles.comboboxContainer} ref={containerRef}>
      <button
        ref={triggerRef}
        className={`${styles.trigger} ${isOpen ? styles.triggerOpen : ""}`}
        onClick={handleToggle}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        type="button"
      >
        <span
          className={`${styles.triggerText} ${
            selectedValues.length === 0 ? styles.triggerPlaceholder : ""
          }`}
        >
          {displayText}
        </span>

        {selectedValues.length > 0 && (
          <button
            className={styles.clearButton}
            onClick={handleClear}
            aria-label="Clear selection"
            type="button"
          >
            <X size={16} />
          </button>
        )}

        <ChevronDown
          size={16}
          className={`${styles.triggerIcon} ${isOpen ? styles.triggerIconOpen : ""}`}
        />
      </button>

      {isOpen && (
        <div className={styles.content} role="listbox">
          <div className={styles.searchContainer}>
            <div style={{ position: "relative" }}>
              <Search
                size={16}
                style={{
                  position: "absolute",
                  left: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#9ca3af",
                }}
              />
              <input
                ref={searchInputRef}
                type="text"
                className={styles.searchInput}
                placeholder="Search..."
                value={searchQuery}
                onChange={handleSearchChange}
                onKeyDown={handleKeyDown}
                style={{ paddingLeft: "36px" }}
              />
            </div>
          </div>

          <div className={styles.tableContainer}>
            <TableComponent
              data={data}
              columns={columns}
              onRowSelect={handleRowSelect}
              height={tableHeight}
              width={tableWidth}
              searchQuery={searchQuery}
            />
          </div>
        </div>
      )}
    </div>
  );
}
