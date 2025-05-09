import React, { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import "jspdf-autotable";

const ReuseExportTable = ({ columns, rows, defaultColumns }) => {
  const [selectedColumns, setSelectedColumns] = useState(defaultColumns || columns.map(col => col.field));

  // 🔹 Handle Export to Excel
  const handleExportExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Data");

    // Filter columns based on selection
    const filteredColumns = columns.filter(col => selectedColumns.includes(col.field));

    // Add headers
    worksheet.addRow(filteredColumns.map(col => col.headerName));

    // Add data
    rows.forEach(row => {
      worksheet.addRow(filteredColumns.map(col => row[col.field]));
    });

    // Save file
    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), "table_data.xlsx");
  };

  // 🔹 Handle Export to PDF
  const handleExportPDF = () => {
    const doc = new jsPDF();
    const filteredColumns = columns.filter(col => selectedColumns.includes(col.field));

    // Prepare table headers and rows
    const tableHeaders = filteredColumns.map(col => col.headerName);
    const tableRows = rows.map(row => filteredColumns.map(col => row[col.field]));

    // Add table to PDF
    doc.autoTable({
      head: [tableHeaders],
      body: tableRows,
    });

    // Save PDF
    doc.save("table_data.pdf");
  };

  return (
    <div style={{ height: 400, width: "100%" }}>
      {/* 🔹 Column Selection */}
      <div>
        {columns.map(col => (
          <label key={col.field} style={{ marginRight: 10 }}>
            <input
              type="checkbox"
              checked={selectedColumns.includes(col.field)}
              onChange={(e) => {
                setSelectedColumns(prev =>
                  e.target.checked ? [...prev, col.field] : prev.filter(f => f !== col.field)
                );
              }}
            />
            {col.headerName}
          </label>
        ))}
      </div>

      {/* 🔹 Table */}
      <DataGrid columns={columns} rows={rows} pageSize={5} />

      {/* 🔹 Export Buttons */}
      <div style={{ marginTop: 10 }}>
        <button onClick={handleExportExcel} style={{ marginRight: 10 }}>
          Export to Excel
        </button>
        <button onClick={handleExportPDF}>
          Export to PDF
        </button>
      </div>
    </div>
  );
};

export default ReuseExportTable;
