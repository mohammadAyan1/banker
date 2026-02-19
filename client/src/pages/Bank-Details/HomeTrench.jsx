import { useParams } from "react-router-dom";
import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import ExcelHeader from "../../components/Header/ExcelHeader";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

import { getHomeTrenchReportById } from "../../redux/features/Banks/homeTrench/homeTrenchReportThunks";

const dummyPics = [
  {
    url: "https://images.unsplash.com/photo-1702952815477-553ae3774509?w=600&auto=format&fit=crop&q=60",
    location: "76m3+6qc, Gwalior, Madhya Pradesh 474001, India",
    latitude: "26.284655",
    longitude: "78.205254",
    localTime: "05:13:22 PM",
    altitude: "188 m",
    gmt: "12:12:11 PM",
    date: "Tuesday, 09.04.2025",
  },
  {
    url: "https://images.unsplash.com/photo-1702952815477-553ae3774509?w=600&auto=format&fit=crop&q=60",
    location: "76m3+6qc, Gwalior, Madhya Pradesh 474001, India",
    latitude: "26.284655",
    longitude: "78.205254",
    localTime: "05:20:10 PM",
    altitude: "190 m",
    gmt: "12:20:11 PM",
    date: "Tuesday, 09.04.2025",
  },
  {
    url: "https://images.unsplash.com/photo-1702952815477-553ae3774509?w=600&auto=format&fit=crop&q=60",
    location: "76m3+6qc, Gwalior, Madhya Pradesh 474001, India",
    latitude: "26.284655",
    longitude: "78.205254",
    localTime: "05:20:10 PM",
    altitude: "190 m",
    gmt: "12:20:11 PM",
    date: "Tuesday, 09.04.2025",
  },
];


const HomeTrench = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const CPANEL = import.meta.env.VITE_API_URL

  const reportData = useSelector((state) => state?.homeTrenchReport?.report);

  useEffect(() => {
    if (id) {
      dispatch(getHomeTrenchReportById(id));
    }
  }, [id, dispatch]);


  function cleanPath(path) {
    return path.replace(/^undefined\/?/, "");
  }

  // console.log(reportData);

  const handleExportPDF = () => {
    const input = document.getElementById("reportContent");
    html2canvas(input, { scale: 2, useCORS: true }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 10;
      const imgWidth = pageWidth - margin * 2;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let position = margin;
      let remainingHeight = imgHeight;

      if (imgHeight > pageHeight - margin * 2) {
        while (remainingHeight > 0) {
          pdf.addImage(imgData, "PNG", margin, position, imgWidth, imgHeight);
          remainingHeight -= pageHeight - margin * 2;
          if (remainingHeight > 0) {
            pdf.addPage();
            position = margin - (imgHeight - remainingHeight);
          }
        }
      } else {
        pdf.addImage(imgData, "PNG", margin, margin, imgWidth, imgHeight);
      }

      pdf.save("Baja_Ameriya_Report.pdf");
    });
  };

  const handleExportExcel = () => {
    const table = document.getElementById("reportTable");
    const workbook = XLSX.utils.table_to_book(table, { sheet: "Report" });
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, "Baja_Ameriya_Report.xlsx");
  };

  const handleExportCSV = () => {
    const table = document.getElementById("reportTable");
    const worksheet = XLSX.utils.table_to_sheet(table);
    const csv = XLSX.utils.sheet_to_csv(worksheet);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "Baja_Ameriya_Report.csv");
  };

  return (
    <div className='w-full border p-3'>
      {/* Wrapper for the entire content */}
      <div className='mb-3'>
        <div className='mb-2.5 text-right'>
          <button
            onClick={handleExportPDF}
            className='mr-2.5 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
          >
            Download PDF
          </button>
          <button
            onClick={handleExportExcel}
            className='mr-2.5 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded'
          >
            Download Excel
          </button>
          <button
            onClick={handleExportCSV}
            className='bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded'
          >
            Download CSV
          </button>
        </div>
      </div>
      <div id='reportContent'>
        {/* Header Section */}
        <div className='flex items-center border-b pb-3'>
          <div className='w-full'>
            {/* <ExcelHeader /> */}
            <img src='/assets/images/header1.jpg' alt='' />

          </div>
        </div>

        <div id='reportTable'>
          <table className='w-full border-collapse border border-gray-300'>
            <tbody>
              <tr className='bg-gray-100'>
                <td className='bg-blue-100 p-2 font-bold' colSpan={4}>
                  1. VENDOR VISIT DETAILS
                </td>
              </tr>
              <tr>
                <td className='p-2 border border-gray-300 font-bold'>
                  DATE OF VISIT
                </td>
                <td className='p-2 border border-gray-300'>
                  {reportData?.dateOfVisit || "N/A"}
                </td>
                <td className='p-2 border border-gray-300 font-bold'>
                  DATE OF REPORT
                </td>
                <td className='p-2 border border-gray-300'>
                  {reportData?.dateOfReport || "N/A"}
                </td>
              </tr>
              <tr>
                <td
                  className='p-2 border border-gray-300 font-bold'
                  colSpan={4}
                >
                  Address of Property (As per site):{" "}
                  {reportData?.propertyAddress || "N/A"}
                </td>
              </tr>
              <tr>
                <td className='p-2 border border-gray-300 font-bold'>
                  NAME OF THE PERSON WHO VISITED THE SITE:
                </td>
                <td className='p-2 border border-gray-300'>
                  {reportData?.visitedPersonName || "N/A"}
                </td>
                <td className='p-2 border border-gray-300 font-bold'>
                  CONTACT NUMBER
                </td>
                <td className='p-2 border border-gray-300'>
                  {reportData?.contactNumber || "N/A"}
                </td>
              </tr>
              <tr className='bg-gray-100'>
                <td className='bg-blue-100 p-2 font-bold' colSpan={4}>
                  2. CONSTRUCTION
                </td>
              </tr>
              <tr>
                <td
                  className='p-2 border border-gray-300 font-bold'
                  colSpan={2}
                >
                  CONSTRUCTION STAGE (AS PER SITE):
                </td>
                <td
                  className='p-2 border border-gray-300 font-bold'
                  colSpan={2}
                >
                  {reportData?.constructionStage || "N/A"}
                </td>
              </tr>
              <tr>
                <td className='p-2 border border-gray-300 font-bold'>
                  CONSTRUCTION (%)
                </td>
                <td className='p-2 border border-gray-300'>
                  {reportData?.constructionPercentage || "N/A"}%
                </td>
                <td className='p-2 border border-gray-300 font-bold'>
                  CONSTRUCTION IS AS PER :
                </td>
                <td className='p-2 border border-gray-300'>
                  {reportData?.constructionAsPer || "N/A"}
                </td>
              </tr>
              <tr className='bg-gray-100'>
                <td className='bg-blue-100 p-2 font-bold' colSpan={4}>
                  3. AREA
                </td>
              </tr>
              <tr>
                <td className='p-2 border border-gray-300 font-bold'>
                  TOTAL BUA CONSIDERED ON SITE (IN SQ.FT)
                </td>
                <td className='p-2 border border-gray-300'>
                  {reportData?.totalBua || "N/A"} SQFT
                </td>
                <td className='p-2 border border-gray-300 font-bold'>
                  REMARKS
                </td>
                <td className='p-2 border border-gray-300'>
                  {reportData?.areaRemarks || "N/A"}
                </td>
              </tr>
              <tr>
                <td className='p-2 border border-gray-300 font-bold'>
                  LATITUDE :
                </td>
                <td className='p-2 border border-gray-300'>
                  {reportData?.latitude || "N/A"}
                </td>
                <td className='p-2 border border-gray-300 font-bold'>
                  LONGITUDE :
                </td>
                <td className='p-2 border border-gray-300'>
                  {reportData?.longitude || "N/A"}
                </td>
              </tr>
              <tr>
                <td className='p-2 border border-gray-300 font-bold'>
                  OVERALL STATUS (POSITIVE / NEGATIVE) :
                </td>
                <td className='p-2 border border-gray-300'>
                  {reportData?.overallStatus || "N/A"}
                </td>
                <td className='p-2 border border-gray-300 font-bold'>
                  IF NEGATIVE, PLEASE SPECIFY THE REASON :
                </td>
                <td className='p-2 border border-gray-300'>
                  {reportData?.negativeReason || "N/A"}
                </td>
              </tr>
              <tr className='bg-gray-100'>
                <td className='bg-blue-100 p-2 font-bold' colSpan={4}>
                  4. CERTIFICATE
                </td>
              </tr>
              <tr>
                <td className='p-2 border border-gray-300 font-bold'>
                  CERTIFICATE :
                </td>
                <td className='p-2 border border-gray-300' colSpan={3}>
                  {reportData?.certificateText || "N/A"}
                </td>
              </tr>
              <tr className='bg-gray-100'>
                <td className='bg-blue-100 p-2 font-bold' colSpan={4}>
                  5. BILLING
                </td>
              </tr>
              <tr>
                <td className='p-2 border border-gray-300 font-bold'>
                  CHARGES :
                </td>
                <td className='p-2 border border-gray-300'>
                  {reportData?.charges || "N/A"}
                </td>
                <td className='p-2 border border-gray-300 font-bold'>
                  GST % (IF APPLICABLE)
                </td>
                <td className='p-2 border border-gray-300'>
                  {reportData?.gstPercentage || "N/A"}
                </td>
              </tr>
              <tr>
                <td className='p-2 border border-gray-300 font-bold'>
                  TOTAL :
                </td>
                <td className='p-2 border border-gray-300' colSpan={3}>
                  {reportData?.totalAmount}
                </td>
              </tr>
              <tr>
                <td
                  className=' border border-black px-4 mt font-semibold'
                  colSpan='8'
                >
                  <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 py-2  '>
                    {/* <td className="boder">he</td> */}
                    {reportData?.imageUrls?.length > 0 ? (
                      reportData.imageUrls.map((imageUrl, index) => {
                        const imageUrls = cleanPath(imageUrl);
                        return (
                          <div key={index} className='  overflow-hidden  '>
                            <img
                              src={`${CPANEL}/${imageUrls}`}
                              alt={`Property Image ${index + 1}`}
                              className='w-full h-96 object-cover'
                            />
                          </div>
                        )
                      }))
                      : (
                        <p>No images available.</p>
                      )}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className='mt-8 text-sm text-gray-600'>
          <p className='mb-1'>
            * This is a system-generated report. The data provided is based on
            site visit and available records.
          </p>
          <p>
            For any queries, please contact us at{" "}
            <a
              href='mailto:support@example.com'
              className='text-blue-500 underline'
            >
              support@example.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomeTrench;
