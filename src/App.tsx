import { useState } from "react";
import { Search, Table, Keyboard, Eye, Zap, Settings } from "lucide-react";
import { Combobox } from "./components/Combobox/Combobox";
import { SimpleTable } from "./components/SimpleTable/SimpleTable";
import { ShadcnTable } from "./components/ShadcnTable/ShadcnTable";
import { sampleUsers, userColumns } from "./data/sampleData";

// import "./App.css"; // This is from the original code, but it's not needed for this project

import type { User } from "./data/sampleData";
import styles from "./App.module.css";
function App() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const [tableSelectedUser, setTableSelectedUser] = useState<User | null>(null);
  const [tableSelectedValues, setTableSelectedValues] = useState<string[]>([]);

  const handleComboboxSelect = (user: User, values: string[]) => {
    setSelectedUser(user);
    setSelectedValues(values);
  };

  const handleTableSelect = (user: User, values: string[]) => {
    setTableSelectedUser(user);
    setTableSelectedValues(values);
  };

  return (
    <div className={styles.app}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>React Combobox & Table Components</h1>
          <p className={styles.subtitle}>
            Fully accessible, keyboard-navigable components with typeahead
            search, horizontal/vertical scrolling, and customizable styling
            using CSS modules.
          </p>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <Search className={styles.icon} size={24} />
            Combobox with Table Dropdown
          </h2>
          <p className={styles.sectionDescription}>
            Click the combobox to open a searchable table. Use keyboard
            navigation (arrow keys, Enter, Escape) to interact with the table
            rows.
          </p>

          <div className={styles.comboboxDemo}>
            <div className={styles.comboboxGroup}>
              <label className={styles.comboboxLabel}>
                Simple Table Version{" "}
                <span className={styles.badge}>Custom</span>
              </label>
              <Combobox
                data={sampleUsers}
                columns={userColumns}
                displayColumns={["name", "email", "department"]}
                placeholder="Search and select a user..."
                onSelect={handleComboboxSelect}
                variant="simple"
                tableHeight={300}
                tableWidth={600}
              />
            </div>

            <div className={styles.comboboxGroup}>
              <label className={styles.comboboxLabel}>
                Shadcn Table Version{" "}
                <span className={styles.badge}>Shadcn/ui</span>
              </label>
              <Combobox
                data={sampleUsers}
                columns={userColumns}
                displayColumns={["name", "role", "status"]}
                placeholder="Search and select a user..."
                onSelect={handleComboboxSelect}
                variant="shadcn"
                tableHeight={300}
                tableWidth={600}
              />
            </div>

            {selectedUser && (
              <div className={styles.selectedInfo}>
                <div className={styles.selectedTitle}>Selected User:</div>
                <div className={styles.selectedDetails}>
                  {JSON.stringify(selectedUser, null, 2)}
                </div>
                <div className={styles.selectedTitle}>Display Values:</div>
                <div className={styles.selectedDetails}>
                  {selectedValues.join(" | ")}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <Table className={styles.icon} size={24} />
            Standalone Table Components
          </h2>
          <p className={styles.sectionDescription}>
            Both table versions support keyboard navigation, row selection, and
            horizontal/vertical scrolling with fixed dimensions.
          </p>

          <div className={styles.tableDemo}>
            <div className={styles.tableGroup}>
              <label className={styles.tableLabel}>
                Simple Table <span className={styles.badge}>Custom</span>
              </label>
              <SimpleTable
                data={sampleUsers}
                columns={userColumns}
                onRowSelect={handleTableSelect}
                height={300}
                width={800}
              />
            </div>

            <div className={styles.tableGroup}>
              <label className={styles.tableLabel}>
                Shadcn Table <span className={styles.badge}>Shadcn/ui</span>
              </label>
              <ShadcnTable
                data={sampleUsers}
                columns={userColumns}
                onRowSelect={handleTableSelect}
                height={300}
                width={800}
              />
            </div>

            {tableSelectedUser && (
              <div className={styles.selectedInfo}>
                <div className={styles.selectedTitle}>Selected from Table:</div>
                <div className={styles.selectedDetails}>
                  {JSON.stringify(tableSelectedUser, null, 2)}
                </div>
                <div className={styles.selectedTitle}>All Column Values:</div>
                <div className={styles.selectedDetails}>
                  {tableSelectedValues.join(" | ")}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className={styles.features}>
          <div className={styles.feature}>
            <div className={styles.featureTitle}>
              <Keyboard size={20} />
              Keyboard Accessible
            </div>
            <div className={styles.featureDescription}>
              Full keyboard navigation with arrow keys, Enter, Space, Home, End,
              and Escape support.
            </div>
          </div>

          <div className={styles.feature}>
            <div className={styles.featureTitle}>
              <Search size={20} />
              Typeahead Search
            </div>
            <div className={styles.featureDescription}>
              Real-time filtering across all table columns with highlighted
              matches.
            </div>
          </div>

          <div className={styles.feature}>
            <div className={styles.featureTitle}>
              <Eye size={20} />
              Visual Feedback
            </div>
            <div className={styles.featureDescription}>
              Hover states, focus indicators, and selection highlighting for
              better UX.
            </div>
          </div>

          <div className={styles.feature}>
            <div className={styles.featureTitle}>
              <Zap size={20} />
              High Performance
            </div>
            <div className={styles.featureDescription}>
              Optimized rendering with virtual scrolling support for large
              datasets.
            </div>
          </div>

          <div className={styles.feature}>
            <div className={styles.featureTitle}>
              <Settings size={20} />
              Highly Customizable
            </div>
            <div className={styles.featureDescription}>
              Configurable columns, dimensions, display values, and styling with
              CSS modules.
            </div>
          </div>

          <div className={styles.feature}>
            <div className={styles.featureTitle}>
              <Table size={20} />
              Two Implementations
            </div>
            <div className={styles.featureDescription}>
              Choose between a custom table built from scratch or one based on
              shadcn/ui components.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
