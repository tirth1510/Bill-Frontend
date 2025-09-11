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
import { FiChevronDown, FiSearch } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { Eye, Pencil, Trash2 } from "lucide-react";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Barcode from "react-barcode";
import { FaBasketShopping } from "react-icons/fa6";
import ProductDetailsDialog from "./ProductDetailsDialog";

type ProductVariant = {
  id: string; // Product ID
  _id: string; // Variant ID
  ItemName: string;
  Type?: string;
  Gram: number;
  Price: number;
  Stock: number;
  BarCode: string;
  BarCodenumber: string;
  image?: string;
};

export default function ProductTable() {
  const [products, setProducts] = useState<ProductVariant[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ProductVariant[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedProduct, setSelectedProduct] = useState<ProductVariant | null>(
    null
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [isEditPriceOpen, setIsEditPriceOpen] = useState(false);
  const [editPrice, setEditPrice] = useState<number | null>(null);

  const [isEditStockOpen, setIsEditStockOpen] = useState(false);
  const [editStock, setEditStock] = useState<number | null>(null);

  const [isEditItemNameOpen, setIsEditItemNameOpen] = useState(false);
  const [editItemName, setEditItemName] = useState<string | null>(null);

  const [editProduct, setEditProduct] = useState<ProductVariant | null>(null);

  // Add Variant dialog state
  const [isAddVariantOpen, setIsAddVariantOpen] = useState(false);
  const [newVariant, setNewVariant] = useState({
    Gram: 0,
    Price: 0,
    Stock: 0,
  });

  // Filters & search
  const [stockFilter, setStockFilter] = useState<"low" | "high" | "none">(
    "none"
  );
  const [itemSearch, setItemSearch] = useState("");
  const [typeSearch] = useState("");

  // Fetch products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `https://bill-backend-j5en.onrender.com/products/`,
        {
          withCredentials: true,
        }
      );
      setProducts(res.data.data);
      setFilteredProducts(res.data.data);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Filter & search
  useEffect(() => {
    let temp = [...products];

    if (stockFilter === "low") temp.sort((a, b) => a.Stock - b.Stock);
    if (stockFilter === "high") temp.sort((a, b) => b.Stock - a.Stock);

    if (itemSearch.trim() !== "")
      temp = temp.filter((p) =>
        p.ItemName.toLowerCase().includes(itemSearch.toLowerCase())
      );
    if (typeSearch.trim() !== "")
      temp = temp.filter((p) =>
        p.Type?.toLowerCase().includes(typeSearch.toLowerCase())
      );

    setFilteredProducts(temp);
  }, [products, stockFilter, itemSearch, typeSearch]);

  // Dialog handlers
  const openDialog = (product: ProductVariant) => {
    setSelectedProduct(product);
    setIsDialogOpen(true);
  };
  const closeDialog = () => {
    setSelectedProduct(null);
    setIsDialogOpen(false);
  };

  // Edit handlers
  const openEditPrice = (product: ProductVariant) => {
    setEditProduct(product);
    setEditPrice(product.Price);
    setIsEditPriceOpen(true);
  };
  const openEditStock = (product: ProductVariant) => {
    setEditProduct(product);
    setEditStock(product.Stock);
    setIsEditStockOpen(true);
  };
  const openEditItemName = (product: ProductVariant) => {
    setEditProduct(product);
    setEditItemName(product.ItemName);
    setIsEditItemNameOpen(true);
  };

  const handleSavePrice = async () => {
    if (!editProduct || editPrice === null) return;
    try {
      await axios.put(
        `https://bill-backend-j5en.onrender.com/products/update-variant-price/${editProduct.id}/${editProduct._id}`,
        { price: editPrice },
        { withCredentials: true }
      );
      setProducts((prev) =>
        prev.map((p) =>
          p._id === editProduct._id ? { ...p, Price: editPrice } : p
        )
      );
      setIsEditPriceOpen(false);
      setEditProduct(null);
      setEditPrice(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveStock = async () => {
    if (!editProduct || editStock === null) return;
    try {
      await axios.put(
        `https://bill-backend-j5en.onrender.com/products/update-variant-stock/${editProduct.id}/${editProduct._id}`,
        { Stock: editStock },
        { withCredentials: true }
      );
      setProducts((prev) =>
        prev.map((p) =>
          p._id === editProduct._id ? { ...p, Stock: editStock } : p
        )
      );
      setIsEditStockOpen(false);
      setEditProduct(null);
      setEditStock(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveItemName = async () => {
    if (!editProduct || editItemName === null) return;
    try {
      await axios.put(
        `https://bill-backend-j5en.onrender.com/products/update-variant-itemname/${editProduct.id}/${
          editProduct._id
        }`,
        { ItemName: editItemName },
        { withCredentials: true }
      );
      setProducts((prev) =>
        prev.map((p) =>
          p._id === editProduct._id ? { ...p, ItemName: editItemName } : p
        )
      );
      setIsEditItemNameOpen(false);
      setEditProduct(null);
      setEditItemName(null);
    } catch (err) {
      console.error(err);
    }
  };

  // Handle Add Variant
  const handleAddVariant = async () => {
    if (!selectedProduct) {
      console.error("No product selected for adding variant");
      return;
    }

    try {
      await axios.post(
        `https://bill-backend-j5en.onrender.com/products/${
          selectedProduct.id
        }/variants`,
        {
          gram: newVariant.Gram,
          price: newVariant.Price,
          stock: newVariant.Stock,
        },
        { withCredentials: true }
      );

      await fetchProducts(); // refresh product list
      setIsAddVariantOpen(false);
      setNewVariant({ Gram: 0, Price: 0, Stock: 0 });
    } catch (err: any) {
      console.error("Error adding variant:", err.response?.data || err.message);
    }
  };

  return (
    <div className="p-6 min-h-screen">
      <h2 className="text-xl font-semibold mb-4 text-center">Products</h2>

      {/* Filters */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-4 bg-gray-50 rounded-lg shadow-sm mb-10">
        <div className="flex flex-col md:flex-row gap-4 items-center w-full">
          <div className="relative w-full md:w-48">
            <select
              value={stockFilter}
              onChange={(e) =>
                setStockFilter(e.target.value as "low" | "high" | "none")
              }
              className="w-full appearance-none border border-gray-300 rounded-lg pr-10 pl-3 py-2 shadow-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400"
            >
              <option value="none">None</option>
              <option value="low">Low Stock</option>
              <option value="high">High Stock</option>
            </select>
            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
              <FiChevronDown className="w-5 h-5 text-gray-500" />
            </div>
          </div>

          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Type item name..."
              value={itemSearch}
              onChange={(e) => setItemSearch(e.target.value)}
              className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-green-400"
            />
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <FiSearch className="w-5 h-5 text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      {loading && <p className="text-center">Loading products...</p>}
      {error && <p className="text-red-500 text-center">{error}</p>}

      {/* Table */}
      <Table className="min-w-full border border-gray-200 rounded-lg overflow-hidden text-center">
        <TableCaption className="text-gray-500 py-2">
          All Product Variants
        </TableCaption>
        <TableHeader className="bg-gray-100">
          <TableRow>
            {[
              "Product Name",
              "Gram",
              "Price",
              "Stock",
              "Barcode",
              "Barcode Number",
              "Action",
            ].map((title) => (
              <TableHead
                key={title}
                className="border px-4 py-2 text-gray-700 font-semibold text-sm md:text-lg"
              >
                {title}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {filteredProducts.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="py-6 text-gray-500 text-center">
                No products found.
              </TableCell>
            </TableRow>
          ) : (
            filteredProducts.map((p, idx) => (
              <TableRow
                key={p._id}
                className={`text-sm md:text-base hover:bg-blue-50 transition-colors ${
                  idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                }`}
              >
                <TableCell className="border px-4 py-3 text-center font-medium text-gray-700">
                  <div className="flex items-center justify-center gap-2">
                    <span className="truncate max-w-[140px]">{p.ItemName}</span>
                    <Pencil
                      className="w-5 h-5 text-blue-600 cursor-pointer hover:text-blue-800"
                      onClick={() => openEditItemName(p)}
                    />
                  </div>
                </TableCell>
                <TableCell className="border px-4 py-3 text-center">
                  {p.Gram} g
                </TableCell>
                <TableCell className="border px-4 py-3 text-center text-green-600 font-semibold">
                  <div className="flex items-center justify-center gap-2">
                    ₹ {p.Price}/-
                    <Pencil
                      className="w-5 h-5 text-blue-600 cursor-pointer hover:text-blue-800"
                      onClick={() => openEditPrice(p)}
                    />
                  </div>
                </TableCell>
                <TableCell className="border px-4 py-3 text-center text-gray-700 font-semibold">
                  <div className="flex items-center justify-center gap-2">
                    {p.Stock} <FaBasketShopping className="text-gray-500" />
                    <Pencil
                      className="w-5 h-5 text-blue-600 cursor-pointer hover:text-blue-800"
                      onClick={() => openEditStock(p)}
                    />
                  </div>
                </TableCell>
                <TableCell className="border px-4 py-3 text-center">
                  <div className="flex justify-center">
                    <Barcode
                      value={p.BarCode}
                      format="CODE128"
                      width={1}
                      height={40}
                      displayValue
                    />
                  </div>
                </TableCell>
                <TableCell className="border px-4 py-3 text-center">
                  {p.BarCodenumber}
                </TableCell>

                {/* Action cell with Add Variant */}
                <TableCell className="border px-4 py-3 text-center">
                  <div className="flex flex-col md:flex-row justify-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="hover:bg-green-50 p-1 rounded"
                      onClick={() => openDialog(p)}
                    >
                      <Eye className="w-5 h-5 text-green-600" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="hover:bg-red-50 p-1 rounded"
                    >
                      <Trash2 className="w-5 h-5 text-red-600" />
                    </Button>
                    <Button
                      className="bg-blue-600 text-white hover:bg-blue-700"
                      onClick={() => {
                        setSelectedProduct(p);
                        setIsAddVariantOpen(true);
                      }}
                    >
                      + Add Variant
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      {selectedProduct && (
        <ProductDetailsDialog
          product={selectedProduct}
          open={isDialogOpen}
          onClose={closeDialog}
        />
      )}
      {/* Add Variant Dialog */}
      <Dialog open={isAddVariantOpen} onOpenChange={setIsAddVariantOpen}>
        <DialogContent className="max-w-md rounded-2xl shadow-xl bg-white p-6">
          <DialogHeader>
            <DialogTitle>
              Add Variant for {selectedProduct?.ItemName}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {["Gram", "Price", "Stock"].map((field) => (
              <div key={field}>
                <Label htmlFor={field}>{field}</Label>
                <Input
                  id={field}
                  type="number"
                  value={(newVariant as any)[field] || ""}
                  onChange={(e) =>
                    setNewVariant({
                      ...newVariant,
                      [field]: Number(e.target.value),
                    })
                  }
                />
              </div>
            ))}
          </div>

          <DialogFooter className="flex justify-end gap-2 mt-6">
            <Button
              variant="outline"
              onClick={() => setIsAddVariantOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="bg-green-600 text-white hover:bg-green-700"
              onClick={handleAddVariant}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reusable Edit Dialogs */}
      <EditDialog
        title="Edit Price"
        value={editPrice}
        setValue={setEditPrice}
        open={isEditPriceOpen}
        setOpen={setIsEditPriceOpen}
        onSave={handleSavePrice}
      />
      <EditDialog
        title="Edit Stock"
        value={editStock}
        setValue={setEditStock}
        open={isEditStockOpen}
        setOpen={setIsEditStockOpen}
        onSave={handleSaveStock}
      />
      <EditDialog
        title="Edit Item Name"
        value={editItemName}
        setValue={setEditItemName}
        open={isEditItemNameOpen}
        setOpen={setIsEditItemNameOpen}
        onSave={handleSaveItemName}
        isString
      />
    </div>
  );
}

// Reusable Edit Dialog
type EditDialogProps = {
  title: string;
  value: number | string | null;
  setValue: (v: any) => void;
  open: boolean;
  setOpen: (v: boolean) => void;
  onSave: () => void;
  isString?: boolean;
};

function EditDialog({
  title,
  value,
  setValue,
  open,
  setOpen,
  onSave,
  isString,
}: EditDialogProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md rounded-2xl shadow-xl bg-white p-6">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Label htmlFor="editInput">{title}</Label>
          <Input
            id="editInput"
            type={isString ? "text" : "number"}
            value={value ?? ""}
            onChange={(e) =>
              isString
                ? setValue(e.target.value)
                : setValue(Number(e.target.value))
            }
          />
        </div>
        <DialogFooter className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={onSave}
            className="bg-green-600 text-white hover:bg-green-700"
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
