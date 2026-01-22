import DataTable from "react-data-table-component";
import { Input } from "@/components/ui/input";
import { useMemo, useState, useEffect } from "react";
import { X } from "lucide-react";

const ReusableDataTable = ({
  columns = [],
  data = [],

  loading = false,

  pagination = true,
  paginationServer = false,
  paginationTotalRows = 0,
  paginationPerPage = 10,
  paginationRowsPerPageOptions = [10, 20, 50],
  onChangePage,
  onChangeRowsPerPage,

  searchable = false,
  searchPlaceholder = "Search...",
  searchKeys,

  serverSearch = false,
  onSearch,

  striped = true,
  highlightOnHover = true,
  responsive = true,
  dense = false,
  selectableRows = false,
  selectableRowsSingle = false,
  onSelectedRowsChange,
  onRowClicked,

  noDataText = "No data found",

  customStyles,
  conditionalRowStyles,
}) => {
  const [searchText, setSearchText] = useState("");

  const filteredData = useMemo(() => {
    if (!searchable || !searchText || serverSearch) return data;

    return data.filter((item) => {
      const keys = searchKeys || Object.keys(item);
      return keys.some((key) =>
        String(item[key] ?? "")
          .toLowerCase()
          .includes(searchText.toLowerCase())
      );
    });
  }, [data, searchText, searchable, searchKeys, serverSearch]);

  useEffect(() => {
    if (!serverSearch || !onSearch) return;

    const timer = setTimeout(() => {
      onSearch(searchText);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchText, serverSearch, onSearch]);

  const handleSearchChange = (value) => {
    setSearchText(value);
  };

  return (
    <div className="space-y-4">
      {searchable && (
        <div className="relative max-w-xs">
          <Input
            placeholder={searchPlaceholder}
            value={searchText}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pr-9"
          />

          {searchText && (
            <button
              type="button"
              onClick={() => handleSearchChange("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X size={16} />
            </button>
          )}
        </div>
      )}

      <DataTable
        columns={columns}
        data={serverSearch ? data : filteredData}
        progressPending={loading}
        pagination={pagination}
        paginationServer={paginationServer}
        paginationTotalRows={paginationTotalRows}
        paginationPerPage={paginationPerPage}
        paginationRowsPerPageOptions={paginationRowsPerPageOptions}
        onChangePage={onChangePage}
        onChangeRowsPerPage={onChangeRowsPerPage}
        striped={striped}
        highlightOnHover={highlightOnHover}
        responsive={responsive}
        dense={dense}
        selectableRows={selectableRows}
        selectableRowsSingle={selectableRowsSingle}
        onSelectedRowsChange={onSelectedRowsChange}
        onRowClicked={onRowClicked}
        noDataComponent={
          <div className="py-6 text-muted-foreground">{noDataText}</div>
        }
        customStyles={customStyles}
        conditionalRowStyles={conditionalRowStyles}
      />
    </div>
  );
};

export default ReusableDataTable;
