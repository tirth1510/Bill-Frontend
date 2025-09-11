"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Barcode from "react-barcode";
import { Printer } from "lucide-react";

type ProductVariant = {
  id: string;
  _id: string;
  ItemName: string;
  Type?: string;
  Gram: number;
  Price: number;
  Stock: number;
  BarCode: string;
  BarCodenumber: string;
  image?: string;
};

type Props = {
  product: ProductVariant | null;
  open: boolean;
  onClose: () => void;
};

export default function ProductDetailsDialog({
  product,
  open,
  onClose,
}: Props) {
  if (!product) return null;

  const handlePrint = () => {
    if (!product) return;

    const printWindow = window.open("", "_blank", "width=1100,height=1200");
    if (!printWindow) return;

    const html = `
<html>
  <body>
    <div class="label-grid">
      ${Array.from({ length: 6 })
        .map(
          () => `
        <div class="label-card">
          <!-- Top: Product Image -->
          <img src="${product.image || "/shop.png"}" alt="${
            product.ItemName
          }" />

          <!-- Bottom: Details and Barcode -->
          <div class="label-content">
            <div class="left">
              <h3>${product.ItemName}</h3>
              <p>Gram: ${product.Gram}</p>
              <p>Price: ₹ ${product.Price}</p>
            </div>
            <div class="right">
              <svg class="barcode"></svg>
              <p>${product.BarCodenumber}</p>
            </div>
          </div>
        </div>
      `
        )
        .join("")}
    </div>

    <style>
      @page {
        size: A4;
        margin: 0cm;
      }
      body {
        margin: 0;
        padding: 0.5cm;
        font-family: sans-serif;
      }
      .label-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr); /* 2 labels per row for A4 */
        gap: 1cm;
        width: 100%;
      }
      .label-card {
        border: 1px solid #ccc;
        border-radius: 0.5rem;
        padding: 0.3rem;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        align-items: stretch;
        justify-content: flex-start;
        height: 8cm; /* fixed height */
        width: 9cm;  /* fixed width */
      }
      .label-card img {
        max-height: 4cm; /* fixed image height */
        width: auto;
        object-fit: contain;
        margin-bottom: 0.3rem;
        border-radius: 0.5rem;
        border: 1px solid #e5e7eb;
      }
      .label-content {
        display: flex;
        justify-content: space-between;
        width: 100%;
        margin-top: 0.3rem;
      }
      .left {
        display: flex;
        flex-direction: column;
        gap: 0.2rem;
      }
      .left h3 {
        margin: 0;
        font-size: 0.9rem;
        font-weight: 700;
      }
      .right {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      }
      .right svg {
        margin-bottom: 0.2rem;
      }
    </style>

   <svg class="barcode"></svg>

<script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.5/dist/JsBarcode.all.min.js"></script>
<script>
  // Make sure the DOM is ready before running
  document.addEventListener("DOMContentLoaded", () => {
    const productBarCode = "123456789012"; // replace with dynamic value
    JsBarcode(".barcode", productBarCode, {
      format: "CODE128",
      width: 1.5,
      height: 50,
      displayValue: true,
    });

    // Print after barcode is rendered
    window.print();
  });
</script>
  </body>
</html>
`;

    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl rounded-2xl shadow-xl bg-blue-100 p-6">
        <DialogHeader>
          <DialogTitle>Product Details</DialogTitle>
        </DialogHeader>

        {/* Product Info */}
        <div className="flex flex-col justify-between h-full space-y-6 bg-white border-r-4 rounded-xl p-4">
          <div className="flex flex-col items-center space-y-4">
            <div className="flex justify-center w-full">
              <img
                src={product.image || "/shop.png"}
                alt={product.ItemName}
                className="rounded-lg border max-h-64 object-contain"
              />
            </div>

            <div className="p-6 bg-white shadow-md w-full max-w-md">
              <h3 className="text-2xl font-bold text-center text-gray-800 mb-4 truncate">
                {product.ItemName}
              </h3>

              <div className="grid grid-cols-2 gap-6 text-center items-center">
                <div className="space-y-2">
                  <Label className="block text-gray-600 font-medium">
                    Gram:{" "}
                    <span className="font-semibold text-gray-800">
                      {product.Gram}
                    </span>
                  </Label>
                  <Label className="block text-gray-600 font-medium">
                    Price:{" "}
                    <span className="font-semibold text-green-600">
                      ₹ {product.Price}
                    </span>
                  </Label>
                </div>

                <div className="flex flex-col items-center space-y-2">
                  <Barcode
                    value={product.BarCode}
                    format="CODE128"
                    width={1.5}
                    height={50}
                    displayValue={true}
                  />
                  <Label className="text-gray-600 font-medium">
                    Barcode:{" "}
                    <span className="font-semibold text-gray-800">
                      {product.BarCodenumber}
                    </span>
                  </Label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-between mt-4">
          <Button
            className="flex items-center gap-2 bg-green-600 text-white hover:bg-green-700"
            onClick={handlePrint}
          >
            <Printer className="w-4 h-4" /> Print Labels
          </Button>
          <Button onClick={onClose} variant="outline">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
