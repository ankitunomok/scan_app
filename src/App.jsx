import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import ReadQr from "./ReadQr";

function App() {
  const [codes, setCodes] = useState(""); // single input field (string)
  const [loading, setLoading] = useState(false);
  const [lat, setLat] = useState();
  const [long, setLong] = useState();

  // Handle QR scan → append to codes
  const handleQrScan = (value) => {
    if (!value) return;
    let currentCodes = codes ? codes.split(",") : [];
    if (!currentCodes.includes(value)) {
      currentCodes.push(value); // avoid duplicates
      setCodes(currentCodes.join(",")); // save as comma separated string
    }
  };

  const handleChange = (value) => {
    setCodes(value);
  };

  const isReady = codes.trim() !== "";

  const handleSubmit = async () => {
    if (!isReady) {
      Swal.fire("Please scan or enter at least one QR code!");
      return;
    }

    setLoading(true);
    const data = {
      codes: codes.split(","), // send as array
      longitude: long || "",
      latitude: lat || "",
    };

    try {
      // Remove empty values from codes array
      const filteredCodes = data.codes.filter((c) => c.trim() !== "");
      if (filteredCodes.length < 3) {
        Swal.fire(
          "Please provide at least start code, end code, and batch no!"
        );
        setLoading(false);
        return;
      }
      const payload = {
        startCode: filteredCodes[0],
        endCode: filteredCodes[1],
        BatchNo: filteredCodes[2],
      };
      const result = await axios.post(
        "https://deluxe.unomok.com/api/dulux/createStartEndCodes",
        payload,
        { headers: { "Content-Type": "application/json" } }
      );
      Swal.fire(result.data.message || "Submitted!");
      console.log("API Response:", result.data);
      setCodes(""); // reset field
    } catch (err) {
      Swal.fire("Something went wrong!");
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setLat(position.coords.latitude);
      setLong(position.coords.longitude);
    });
  }, []);

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">Scan QR Codes</h2>

      {/* QR Scanner */}
      <ReadQr onScan={handleQrScan} />

      {/* Single Input Field */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          QR Codes (comma separated)
        </label>
        <input
          type="text"
          value={codes}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="Enter or scan QR codes"
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Proceed Button */}
      <button
        disabled={!isReady || loading}
        onClick={handleSubmit}
        className={`w-full py-2 rounded-lg font-semibold ${
          isReady && !loading
            ? "bg-yellow-400 text-black hover:bg-yellow-500"
            : "bg-gray-300 text-gray-600 cursor-not-allowed"
        }`}
      >
        {loading ? "Submitting..." : "Proceed"}
      </button>
    </div>
  );
}

export default App;
