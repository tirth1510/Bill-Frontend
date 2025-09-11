import { useState } from "react";
import axios from "axios";

interface Variant {
  gram: number;
  price: number;
  stock: number;
  BarCode?: string;
  BarCodenumber?: string;
}

interface ProductInput {
  ItemName: string;
  variants: Variant[];
}

export function useCreateProduct() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const createProduct = async (productData: ProductInput) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      const response = await axios.post(
        "https://bill-backend-j5en.onrender.com/products/create",
        productData,
        { withCredentials: true }
      );

      setSuccess(true);
      return response.data;
    } catch (err: any) {
      // Safe error handling
      if (err.response) {
        // Server responded with a status code out of 2xx
        setError(err.response.data?.message || "Server error");
      } else if (err.request) {
        // Request was made but no response received
        setError("No response from server");
      } else {
        // Other errors
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return { createProduct, loading, error, success };
}
