import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver'; // For saving the file on client-side
import axios from 'axios';

const XportRajaswa = async (data) => {
    const BASE_URL = import.meta.env.VITE_API_BASE_URL; // Assuming your API URL is stored in .env

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sheet 1');

    // Define columns dynamically based on fetched vehicle data
    const columnHeaders = [];
    // data.forEach(vehicle => {
    //     columnHeaders.push({ header: vehicle.name_np, key: vehicle.name_np, width: 15 });        
    //     columnHeaders.push({ header: 'Count', key: `${vehicle.name_np}_count`, width: 10 });
    //     columnHeaders.push({ header: 'Tax', key: `${vehicle.name_np}_tax`, width: 10 });
    // });

    data.forEach(vehicle => {
        columnHeaders.push({ header: vehicle.name_np, key: vehicle.name_np, width: 15 });                
        // columnHeaders.push({ header: vehicle.name_np, });                
    });
    columnHeaders.push({ header: 'Count', key: 'count', width: 10 });
    columnHeaders.push({ header: 'Tax', key: 'tax', width: 10 });

    worksheet.columns = columnHeaders;

    worksheet.addRow(columnHeaders.map(header => header.header));
    worksheet.addRow(['Count', 'Tax']); // Count and Tax headers row

    // Add rows (customize this to match your data structure)
    data.forEach(vehicle => {
        worksheet.addRow({            
            // [vehicle.name_np]: vehicle.name_np,
            [`${vehicle.name_np}_count`]: vehicle.count,
            [`${vehicle.name_np}_tax`]: vehicle.tax,
        });
    });

    // Merge cells for vehicle names
    // data.forEach((vehicle, index) => {
    //     const columnIndex = index + 1; // Adjust to match Excel column indexing
    //     worksheet.mergeCells(1, columnIndex, 1, columnIndex + 1); // Merging for the vehicle name
    // });
    

    // Generate the Excel file as a Blob
    const buffer = await workbook.xlsx.writeBuffer();

    // Use FileSaver to save the file on the client side
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, 'PunishmentData.xlsx');
};



export default XportRajaswa;
