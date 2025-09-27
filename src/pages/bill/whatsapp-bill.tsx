import { useEffect, useState } from "react";

function WhatsAppBill() {
  const [pdfUrl, setPdfUrl] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const billId = params.get("billId");
    if (!billId) return;

    const generatedPdfUrl = `https://bill-backend-j5en.onrender.com/bill/pdf/${billId}`;
    setPdfUrl(generatedPdfUrl);

    // Open WhatsApp Web automatically
    const phoneNumber = "918160496588"; // Replace dynamically if possible
    const message = `Hello! Your bill is ready. Download here: ${generatedPdfUrl}`;
    window.open(`https://web.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`, "_blank");
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Your Bill</h2>
      {pdfUrl && (
        <a href={pdfUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
          Click here to download PDF
        </a>
      )}
    </div>
  );
}

export default WhatsAppBill;
