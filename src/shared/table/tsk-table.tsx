import { flexRender, getCoreRowModel, getFilteredRowModel, getSortedRowModel, SortingState, useReactTable } from "@tanstack/react-table";
import { BtnType, DropMenuType, ReactTableColumnType } from "asv-hlps-react";
import { RSelectType } from "asv-hlps-react/lib/cjs/reacts/btns/btn-react-select";
import DisplayHeader, { DisplayHeaderProps } from "asv-hlps-react/lib/cjs/reacts/displays/display-header";
import classNames from "classnames";
import React, { CSSProperties, forwardRef, useEffect, useRef, useState } from "react";
import { Alert } from "react-bootstrap";
import { Loader } from "react-bootstrap-typeahead";
import SimpleBar from "simplebar-react";

import TskCheckbox from "../components/tsk-checkbox";

interface IndeterminateCheckboxProps {
  indeterminate: any;
  children?: React.ReactNode;
}

const IndeterminateCheckbox = forwardRef<HTMLInputElement, IndeterminateCheckboxProps>(({ indeterminate, ...rest }, ref) => {
  const defaultRef = useRef();
  const resolvedRef: any = ref || defaultRef;

  useEffect(() => {
    resolvedRef.current.indeterminate = indeterminate;
  }, [resolvedRef, indeterminate]);

  return (
    <>
      {/* <div className="form-check font-16 mb-0"> */}
      <input type="checkbox" className="form-check-input" ref={resolvedRef} {...rest} />
      {/* <label htmlFor="form-check-input" className="form-check-label"></label> */}
      {/* </div> */}
    </>
  );
});

export interface TableProps extends DisplayHeaderProps {
  addons?: any;
  authAdd?: boolean;
  btns?: BtnType[];
  columns: ReactTableColumnType[];
  data;
  dropMenu?: DropMenuType;
  elpDrop?: boolean;
  filtereds?: any;
  getRows?: any;
  getSelectedRows?: any;
  headTitle?: any;
  initialState?;
  isExpandable?: boolean;
  isSearchable?: boolean;
  isSelectable?: boolean;
  isSortable?: boolean;
  loading?: boolean;
  noHeader?: boolean;
  onAdd?: (data) => void;
  onBtn?: (data) => void;
  onDrop?: (data) => void;
  onSelectedDate?: (dates: any) => void;
  pageSize?: any;
  pagination?: boolean;
  preaddons?: any;
  pullTrs?: any;
  pushTrs?: any;
  ref?: any;
  resetValue?;
  rSelect?: RSelectType;
  searchBoxClass?: string;
  sizePerPageList?: {
    text: string;
    value: number;
  }[];
  table?: any;
  tableClass?: string;
  tableId?: string;
  tableMaxHeight?: number;
  theadClass?: string;
  trClass?: any;
  trStyle?: CSSProperties;
  withIndex?: boolean;
}

const Table = (props: TableProps) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = React.useState({});
  const [globalFilter, setGlobalFilter] = React.useState("");
  // const [columnVisibility, setColumnVisibility] = React.useState({});

  const hasIndex = props.withIndex || true;

  const colCheckbox = [
    {
      id: "select",
      header: ({ table }) => {
        const bop = table.getSelectedRowModel();
        return (
          <TskCheckbox
            {...{
              checked: table.getIsAllRowsSelected(),
              indeterminate: table.getIsSomeRowsSelected(),
              onChange: table.getToggleAllRowsSelectedHandler(),
            }}
          />
        );
      },
      cell: ({ row }) => (
        <div className="px-1">
          <TskCheckbox
            {...{
              checked: row.getIsSelected(),
              disabled: !row.getCanSelect(),
              indeterminate: row.getIsSomeSelected(),
              onChange: row.getToggleSelectedHandler(),
            }}
          />
        </div>
      ),
    },
  ];

  /* const handleRowSelection = () => {
    props.getSelectedRows!! && props.getSelectedRows(table.getSelectedRowModel());
  }; */

  const table = useReactTable({
    // columns: props["columns"] as any[],
    // columns: !props.isSelectable ? (props["columns"] as any[]) : ([...[colCheckbox], ...props["columns"]] as any[]),
    columns: props.isSelectable!! ? ([...colCheckbox, ...props["columns"]] as any[]) : (props["columns"] as any[]),
    // columns: [...colCheckbox, ...props["columns"]] as any[],
    data: props["data"],

    /* filterFns: {
      fuzzy: fuzzyFilter,
    }, */
    state: {
      sorting,
      globalFilter,
      // columnVisibility,
      rowSelection,
    },

    onRowSelectionChange: setRowSelection,
    // onRowSelectionChange: handleRowSelection,
    // onColumnVisibilityChange: setColumnVisibility,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    initialState: props["initialState"],

    // globalFilterFn: fuzzyFilter,
  });

  // --------------------
  const tableTH = (header) => (
    <th
      {...{
        key: header.id,
        colSpan: header.colSpan,
        /*  style: {
          width: header.getSize(),
        }, */
        style: header.column.style,
      }}

      // key={header.id}
      // colSpan={header.column.colSpan}
      // rowSpan={header.column.colSpan}
      // style={header.column?.style}
      // className={classNames(column.thClassName ? column.thClassName : "px-1")}>
      // className={classNames(column.thClassName)}
    >
      {header.isPlaceholder ? null : (
        <div
          {...{
            className: header.column.getCanSort() ? "cursor-pointer select-none" : "",
            onClick: header.column.getToggleSortingHandler(),
          }}>
          {flexRender(header.column.columnDef.header, header.getContext())}
          {{
            asc: (
              <small>
                <i className="fs-6 text-muted ps-1 fas fa-chevron-up"></i>
              </small>
            ),
            desc: (
              <small>
                <i className="fs-6 text-muted ps-1 fas fa-chevron-down"></i>
              </small>
            ),
          }[header.column.getIsSorted() as string] ?? null}
        </div>
      )}
    </th>
  );

  const tableTD = (cell) => (
    <td key={cell.id} className={classNames(cell.column.className)}>
      {flexRender(cell.column.columnDef.cell, cell.getContext())}
    </td>
  );

  const getTable = () => {
    return (
      <>
        <div className="table-responsive">
          <table
            ref={props.ref}
            id={props.tableId}
            // className={classNames("table table-sm table-hover table-striped table-centered react-table", props["tableClass"])}>
            className={
              !props.tableClass
                ? classNames("table table-sm text-uppercase table-hover  table-striped table-centered, react-table")
                : classNames("table react-table", props["tableClass"])
            }>
            {/* <thead className={classNames(props["theadClass"] ? props["theadClass"] : "text-capitalize")}> */}
            <thead className={classNames(props["theadClass"] ? props["theadClass"] : "text-uppercase")}>
              {table.getHeaderGroups().map((headerGroup: any) => (
                <tr key={headerGroup.id}>
                  {hasIndex && <th className="px-1 center">#</th>}
                  {React.Children.toArray(
                    // (headerGroup.headers || []).map((header, column) => checkAuth(header.column.auth) && <>{tableTH(header, column)}</>)
                    (headerGroup.headers || []).map((header) => tableTH(header))
                  )}
                </tr>
              ))}
            </thead>

            <tbody>
              {props.pullTrs!! && props.pullTrs}
              {/* {table.getRowModel().rows.map((row, index) => ( */}
              {(table.getRowModel().rows || []).map((row, index) => (
                <tr key={row.id}>
                  {hasIndex && <td className="px-1 center">{index + 1}</td>}
                  {/* {React.Children.toArray(row.getVisibleCells().map((cell: any) => checkAuth(cell.column.auth) && <>{tableTD(cell)}</>))} */}
                  {React.Children.toArray(row.getVisibleCells().map((cell: any) => tableTD(cell)))}
                </tr>
              ))}
              {props.pushTrs!! && props.pushTrs}
            </tbody>
          </table>
        </div>
      </>
    );
  };

  useEffect(() => {
    props.getRows!! && props.getRows(table?.getFilteredRowModel()?.rows);
  }, [table?.getFilteredRowModel()]);

  return (
    <>
      {!props.noHeader && (
        <DisplayHeader
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
          isSearchable={true}
          countLength={table.getFilteredRowModel().rows.length}
          {...props}
        />
      )}
      {props.data.length > 0 && (
        <div>
          {props.preaddons && props.preaddons}
          {!props.tableMaxHeight ? getTable() : <SimpleBar style={{ maxHeight: props.tableMaxHeight }}>{getTable()}</SimpleBar>}
          {props.addons && props.addons}
        </div>
      )}
      {props.data.length <= 0 && (
        <Alert variant="info" className="text-center text-uppercase">
          Aucune donnée disponible ou disponible à la date correspondante
        </Alert>
      )}
      {/* {pagination && <Pagination tableProps={table} sizePerPageList={sizePerPageList} />} */}
    </>
  );
};

const TskTable = (props: TableProps) => {
  return (
    <>
      {props.loading && <Loader />}
      {!props.loading && <>{Table(props)}</>}
    </>
  );
};

export default TskTable;
