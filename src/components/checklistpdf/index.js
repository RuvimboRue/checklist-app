import { useState } from 'react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { GoDownload } from "react-icons/go";

const ChecklistPDF = ({  items, fullName }) => {
  const generatePDF = () => {
    // Create a new jsPDF instance
    const doc = new jsPDF();

    // Add content to the PDF
    doc.text('Checklist Information', 10, 10);

    // Convert items array to a 2D array for table data
    const tableData = items.map(item => [item.id, item.item, item.comment, fullName]);

    // Add a table to the PDF
    doc.autoTable({
      head: [['ID', 'Item', 'Comment', 'Done By']],
      body: tableData,
    });

    // Save the PDF
    doc.save('checklist.pdf');
  };

  return (
    <GoDownload onClick={generatePDF}  className="w-2 h-2 sm:w-8 sm:h-8 mx-2 font-white cursor-pointer">Generate PDF</GoDownload>
  );
};

export default ChecklistPDF; 