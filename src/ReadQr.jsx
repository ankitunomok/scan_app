import React from "react";
import QrReader  from "react-qr-reader-es6";

const ReadQr = ({ onScan }) => {
  const handleScan = (data) => {
    if (data) {
      onScan(data); // pass scanned text up to parent
    }
  };

  const handleError = (err) => {
    console.error("QR Scan Error:", err);
  };

  return (
    <div className="flex justify-center my-4">
       <QrReader
        delay={300}
        onError={handleError}
        onScan={handleScan}
        style={{ width: "250px", height: "250px" }}
      />
    </div>
  );
};

export default ReadQr;
