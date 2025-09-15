"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableCaption,
} from "@/components/ui/table";
import { FiSearch } from "react-icons/fi";
import { X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import Loader from "@/layouts/Loading";

type Product = {
  _id: string;
  ItemName: string;
  Gram: number;
  Price: number;
  Stock: number;
  BarCode?: string;
};

type ProductListProps = {
  onAddItem: (item: { name: string; gram: number; price: number }) => void;
};

export default function ProductList({ onAddItem }: ProductListProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        "https://bill-backend-j5en.onrender.com/products/",
        { withCredentials: true }
      );
      setProducts(res.data.data);
      setFilteredProducts(res.data.data);
    } catch (err) {
      console.error("Failed to fetch products", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddItem = (p: Product) => {
    onAddItem({ name: p.ItemName, gram: p.Gram, price: p.Price });
  };

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setFilteredProducts(products); // show all if empty
      return;
    }
    setFilteredProducts(
      products.filter(
        (p) => p.ItemName.toLowerCase() === searchTerm.toLowerCase()
      )
    );
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setFilteredProducts(products);
  };

  return (
    <div>
      {/* Search Bar Right Side */}
      <div className="flex justify-end mb-4 ">
        <div className="relative w-full md:w-64">
          <input
            type="text"
            placeholder="Search item..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="w-full border rounded-lg pl-10 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          {/* Icons */}
          <div className="absolute inset-y-0 left-3 flex items-center cursor-pointer">
            {searchTerm ? (
              <X
                className="w-5 h-5 text-gray-500"
                onClick={handleClearSearch}
              />
            ) : (
              <FiSearch
                className="w-5 h-5 text-gray-400"
                onClick={handleSearch}
              />
            )}
          </div>
        </div>
      </div>

      {loading ? (
        <Loader />
      ) : (
        <div className="relative border rounded-lg overflow-hidden mb-5">
          <div className="max-h-[400px] overflow-y-auto">
            <Table className="min-w-full text-center">
              <TableCaption className="text-gray-500 py-2">
                Click + to add an item
              </TableCaption>
              <TableHeader className="bg-gray-100">
                <TableRow>
                  <TableHead className="border px-4 py-2 text-center">
                    Item Name
                  </TableHead>
                  <TableHead className="border px-4 py-2 text-center">
                    Gram
                  </TableHead>
                  <TableHead className="border px-4 py-2 text-center">
                    Price
                  </TableHead>
                  <TableHead className="border px-4 py-2 text-center">
                    Stock
                  </TableHead>
                  <TableHead className="border px-4 py-2 text-center">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredProducts.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="py-6 text-gray-500 text-center"
                    >
                      No products found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProducts.map((p) => (
                    <TableRow
                      key={p._id}
                      className="hover:bg-blue-50 transition-colors"
                    >
                      <TableCell className="border px-4 py-2">
                        {p.ItemName}
                      </TableCell>
                      <TableCell className="border px-4 py-2">
                        {p.Gram} g
                      </TableCell>
                      <TableCell className="border px-4 py-2">
                        ₹ {p.Price}
                      </TableCell>
                      <TableCell className="border px-4 py-2">
                        {p.Stock}
                      </TableCell>
                      <TableCell className="border px-4 py-2">
                        <Button
                          className="bg-blue-100 hover:bg-blue-200"
                          size="icon"
                          onClick={() => handleAddItem(p)}
                        >
                          <Plus className="w-5 h-5 text-blue-600" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );
}
