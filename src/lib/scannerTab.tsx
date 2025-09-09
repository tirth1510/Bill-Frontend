import { useState } from "react";
import BarcodeScannerComponent from "react-qr-barcode-scanner";

type ScannerTabProps = {
  onDetected: (code: string) => void;
};

export default function ScannerTab({ onDetected }: ScannerTabProps) {
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="relative border rounded-lg w-full h-72 flex items-center justify-center bg-black">
      <BarcodeScannerComponent
        width={400}
        height={300}
        onUpdate={(err: unknown, result: any) => {
          if (result) {
            onDetected(result.getText());
          } else if (err) {
            setError("No code detected...");
          }
        }}
      />
      {error && (
        <p className="absolute bottom-2 text-white text-sm">{error}</p>
      )}
    </div>
  );
}
