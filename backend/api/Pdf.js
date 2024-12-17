const nodemailer = require('nodemailer');
const { jsPDF } = require('jspdf');
const express = require('express');
const app = express.Router();
// Function to generate PDF
function generatePDF(reportData) {
    const doc = new jsPDF();

  // Styling Details
  const greenColor = [34, 139, 34]; // Green color in RGB
  const marginLeft = 20;
  let currentY = 20;

  // --- Header Section ---
  doc.setFontSize(20);
  doc.setTextColor(...greenColor);
  doc.text("Carbon Emissions Report", 105, currentY, { align: "center" });

  doc.setDrawColor(...greenColor);
  doc.line(marginLeft, currentY + 5, 190, currentY + 5); // Green underline
  currentY += 15;

  // --- Selected Options Section ---
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text("Selected Values:", marginLeft, currentY);
  currentY += 8;

  doc.setFontSize(12);
  doc.text(`Sector: ${reportData.sector}`, marginLeft, currentY);
  currentY += 6;
  doc.text(`Geography: ${reportData.geography}`, marginLeft, currentY);
  currentY += 6;
  doc.text(`ISIC Classes: ${reportData.isicClasses.join(", ")}`, marginLeft, currentY);
  currentY += 6;
  doc.text(`Activities: ${reportData.activities.join(", ")}`, marginLeft, currentY);
  currentY += 10;

  // --- Activity Details Table ---
  doc.setFillColor(...greenColor);
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);

  // Table Headers
  doc.rect(marginLeft, currentY, 170, 10, "F"); // Table header background
  doc.text("Activity", marginLeft + 5, currentY + 7);
//   doc.text("Question", marginLeft + 45, currentY + 7);
  doc.text("Input (Kg)", marginLeft + 55, currentY + 7);
  doc.text("Rate (tCO2e/Kg)", marginLeft + 95, currentY + 7);
  doc.text("Total Emission", marginLeft + 135, currentY + 7);
  currentY += 10;

  // Table Rows
  let totalEmission = 0;
  reportData.activitiesDetails.forEach((activity, index) => {
    const isEvenRow = index % 2 === 0;
    if (isEvenRow) doc.setFillColor(245, 255, 245); // Light green background for even rows
    else doc.setFillColor(255, 255, 255); // White background for odd rows

    doc.rect(marginLeft, currentY, 170, 10, "F");
    doc.setTextColor(0, 0, 0);
    doc.text(activity.name, marginLeft + 5, currentY + 7);
    // doc.text(activity.question, marginLeft + 45, currentY + 7);
    doc.text(activity.input.toString(), marginLeft + 55, currentY + 7);
    doc.text(activity.rate.toString(), marginLeft + 95, currentY + 7);

    const emission = (activity.input * activity.rate).toFixed(2);
    doc.text(emission, marginLeft + 135, currentY + 7);
    totalEmission += parseFloat(emission);

    currentY += 10;
  });

  // --- Summary of Total Emissions ---
  currentY += 5;
  doc.setFillColor(...greenColor);
  doc.setTextColor(255, 255, 255);
  doc.rect(marginLeft, currentY, 170, 10, "F");
  doc.text(`Total Emissions: ${totalEmission.toFixed(2)} tCO2e`, marginLeft + 5, currentY + 7);
  currentY += 15;

  // --- Footer Section ---
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  doc.text("Generated by ACTS.Earth", marginLeft, currentY);
  doc.text(new Date().toLocaleString(), 180, currentY, { align: "right" });

const pdfBuffer = Buffer.from(doc.output('arraybuffer')); // Convert to Buffer
return pdfBuffer;
}
// Sample Report Data
// const reportData = {
//   sector: "Transportation",
//   geography: "Global",
//   isicClasses: ["Class 1", "Class 2"],
//   activities: ["Vehicle Usage", "Fuel Consumption"],
//   activitiesDetails: [
//     { name: "Vehicle Usage", question: "Distance traveled in Km?", input: 300, rate: 0.5 },
//     { name: "Fuel Consumption", question: "Liters of fuel consumed?", input: 500, rate: 0.25 },
//   ],
// };

// Email Configuration using Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',  // You can use other email services here
  auth: {
    user: 'sheharyarxd@gmail.com', // Replace with your email
    pass: 'dvle onvl qmod jrmd'   // Replace with your email password or app-specific password
  }
});

function sendEmail(pdfBuffer, recipientEmail) {
    const mailOptions = {
      from: 'sheharyarxd@gmail.com', 
      to: recipientEmail,         
      subject: 'Carbon Emissions Report',
      text: 'Please find the carbon emissions report attached.',
      attachments: [
        {
          filename: 'carbon_emissions_report.pdf',
          content: pdfBuffer,        
          encoding: 'base64'         
        }
      ]
    };
  
    // Send the email
    return transporter.sendMail(mailOptions);
  }
app.post('/send-report', async (req, res) => {
    try {
        const reportData = req.body;
        const pdfBuffer = generatePDF(reportData); // Ensure this is a valid Buffer object
        console.log(pdfBuffer); // Optionally, check if this prints a valid buffer
        
  
      // Extract recipient email from request body (e.g., { email: "user@example.com" })
    //   const { email } = req.body;
    const email='sheharyarxd@gmail.com'
  
      if (!email) {
        return res.status(400).send('Recipient email is required.');
      }
  
      // Send email with the generated PDF
      await sendEmail(pdfBuffer, email);
  
      res.status(200).send('Email sent successfully!');
    } catch (error) {
      console.error('Error generating or sending report:', error);
      res.status(500).send('Error generating or sending report.');
    }
  });
// Export functions
module.exports =app;