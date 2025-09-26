"use client";

import React, { useState } from 'react';
import {
    flexRender,
    getCoreRowModel,
    getExpandedRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";

import styles from './PositionGbTable.module.css'
import { balanceDeltaColumnDef, BalanceDummyData, columnColorConfig } from './PositionGBTableColumns';

const PositionGBTable = () => {
    const [expanded, setExpanded] = useState({});


    const tableInstance = useReactTable({
        columns: balanceDeltaColumnDef,
        data: BalanceDummyData,
        state: {
            expanded,
        },
        getCoreRowModel: getCoreRowModel(),
        // // expand rows
        onExpandedChange: setExpanded,
        getSubRows: (row) => row.subRows,
        getExpandedRowModel: getExpandedRowModel(),
    })

    return (
        <div className={styles.table}>
            <table className={styles.balanceDeltaTable}>
                <thead>
                    {tableInstance.getHeaderGroups().map((headerEl) => (
                        <tr key={headerEl.id}>
                            {headerEl.headers.map((columnEl, colIndex) => (
                                <th
                                    key={columnEl.id}
                                    className={colIndex % 2 === 0 ? styles.colLight : styles.colDark}
                                >
                                    <span style={{ display: 'flex', justifyContent: 'center' }}>
                                        {flexRender(
                                            columnEl.column.columnDef.header,
                                            columnEl.getContext()
                                        )}
                                    </span>
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {tableInstance.getRowModel().rows.map((rowEl) => (
                        <tr key={rowEl.id}>
                            {rowEl.getVisibleCells().map((cellEl, colIndex) => {
                                console.log(rowEl)
                                const color = cellEl.column.columnDef.color || "#fff"; // default white
                                return (
                                    <td
                                        key={cellEl.id}
                                        style={{
                                            backgroundColor: columnColorConfig[cellEl.column.id]?.color || "#fff",
                                            textAlign: "center",
                                            padding: "8px",
                                            border: "1px solid #ddd",
                                        }}
                                    >
                                        {flexRender(cellEl.column.columnDef.cell, cellEl.getContext())}
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

    );
};

export default PositionGBTable;
