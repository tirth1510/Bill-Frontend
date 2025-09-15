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
import { Button } from "@/components/ui/button";
import {
  ArrowDownCircle,
  ArrowRightCircle,
  ArrowUpCircle,
  Eye,
  Package,
  Pencil,
  Trash2,
} from "lucide-react";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Barcode from "react-barcode";
import { FaBasketShopping } from "react-icons/fa6";
import ProductDetailsDialog from "./ProductDetailsDialog";
import Loader from "@/layouts/Loading";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
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
  const [itemSearch, setItemSearch] = useState(""); // live typed text
  const [appliedItemSearch, setAppliedItemSearch] = useState(""); // applied on search
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

/// Filter & search
useEffect(() => {
  let temp = [...products];

  // Stock filter
  if (stockFilter === "low") temp.sort((a, b) => a.Stock - b.Stock);
  if (stockFilter === "high") temp.sort((a, b) => b.Stock - a.Stock);

  // Exact match applied only after Enter / click
  if (appliedItemSearch.trim() !== "") {
    temp = temp.filter(
      (p) => p.ItemName.toLowerCase() === appliedItemSearch.toLowerCase()
    );
  } else if (itemSearch.trim() !== "") {
    // Live filtering (partial match while typing)
    temp = temp.filter((p) =>
      p.ItemName.toLowerCase().includes(itemSearch.toLowerCase())
    );
  }

  // Type filter
  if (typeSearch.trim() !== "") {
    temp = temp.filter(
      (p) => p.Type?.toLowerCase() === typeSearch.toLowerCase()
    );
  }

  setFilteredProducts(temp);
}, [products, stockFilter, itemSearch, appliedItemSearch, typeSearch]);


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

      toast.success(
        `Price for ${editProduct.ItemName} has been updated to ₹${editPrice}`
      );
    } catch (err) {
      console.error(err);

      toast.error("Something went wrong while updating the price.");
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
      toast.success(
        `Stock for ${editProduct.ItemName} has been updated to ${editStock}`
      );
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong while updating the Stock .");
    }
  };

  const handleSaveItemName = async () => {
    if (!editProduct || editItemName === null) return;
    try {
      await axios.put(
        `https://bill-backend-j5en.onrender.com/products/update-variant-itemname/${editProduct.id}/${editProduct._id}`,
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
        `https://bill-backend-j5en.onrender.com/products/${selectedProduct.id}/variants`,
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

  const handleSearch = () => {
    setAppliedItemSearch(itemSearch.trim());
  };

  return (
    <div className="p-6 min-h-screen">
      {/* Filters */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-4 bg-gray-50 rounded-lg shadow-sm mb-10">
        <div className="flex flex-col md:flex-row justify-between items-center w-full gap-4 mb-4">
          {/* 🔍 Search Bar (Left Side) */}
          <div className="relative w-full md:w-1/3">
            <input
              type="text"
              placeholder="Type item name..."
              value={itemSearch}
              onChange={(e) => setItemSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch();
              }}
              className="w-full border border-gray-300 rounded-lg pl-10 pr-10 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400"
            />

            {/* Left search icon */}
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <FiSearch className="w-5 h-5 text-gray-400" />
            </div>

            {/* Right button */}
            {appliedItemSearch ? (
              // Clear button after search applied
              <button
                type="button"
                onClick={() => {
                  setItemSearch("");
                  setAppliedItemSearch("");
                }}
                aria-label="Clear"
                className="absolute inset-y-0 right-2 flex items-center justify-center text-red-500 hover:text-red-700 z-10 pointer-events-auto"
              >
                ✕
              </button>
            ) : (
              // Search button before search applied
              <button
                type="button"
                onClick={handleSearch}
                aria-label="Search"
                className="absolute inset-y-0 right-2 flex items-center justify-center text-blue-500 hover:text-blue-700 z-10 pointer-events-auto"
              >
                <ArrowRightCircle className="w-6 h-6" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <Select
              value={stockFilter}
              onValueChange={(value: "low" | "high" | "none") =>
                setStockFilter(value)
              }
            >
              <SelectTrigger className="w-full md:w-48 text-center ">
                <SelectValue placeholder="Select Stock" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-gray-500" />
                    <span>None</span>
                  </div>
                </SelectItem>
                <SelectItem value="low">
                  <div className="flex items-center gap-2">
                    <ArrowDownCircle className="h-4 w-4 text-red-500" />
                    <span>Low Stock</span>
                  </div>
                </SelectItem>
                <SelectItem value="high">
                  <div className="flex items-center gap-2">
                    <ArrowUpCircle className="h-4 w-4 text-green-500" />
                    <span>High Stock</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {loading && <Loader />}
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
                className="border px-4 py-2 text-gray-700 font-semibold text-sm md:text-lg text-center align-middle"
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
        <DialogContent className="max-w-md w-full rounded-3xl shadow-2xl bg-white p-8">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-800 mb-4">
              Add Variant for{" "}
              <span className="text-blue-600">{selectedProduct?.ItemName}</span>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 mt-2">
            {[
              { field: "Gram", icon: "⚖️" },
              { field: "Price", icon: "💰" },
              { field: "Stock", icon: "📦" },
            ].map(({ field, icon }) => (
              <div key={field} className="flex items-center gap-3">
                <span className="text-xl">{icon}</span>
                <div className="flex-1 flex flex-col">
                  <Label
                    htmlFor={field}
                    className="mb-1 text-gray-700 font-medium"
                  >
                    {field}
                  </Label>
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
                    placeholder={`Enter ${field.toLowerCase()}`}
                    className="shadow-sm focus:ring-2 focus:ring-blue-300 focus:border-blue-400"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-3 mt-8">
            <Button
              variant="outline"
              onClick={() => setIsAddVariantOpen(false)}
              className="hover:bg-gray-100 text-gray-700"
            >
              Cancel
            </Button>
            <Button
              className="bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2"
              onClick={handleAddVariant}
            >
              Save
            </Button>
          </div>
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
  <DialogContent className="max-w-md w-full rounded-3xl shadow-2xl bg-white p-8">
    <DialogHeader>
      <DialogTitle className="text-xl font-bold text-gray-800 mb-4">
        {title}
      </DialogTitle>
    </DialogHeader>

    <div className="space-y-5">
      <Label htmlFor="editInput" className="text-gray-700 font-medium">
        {title}
      </Label>
      <Input
        id="editInput"
        type={isString ? "text" : "number"}
        value={value ?? ""}
        onChange={(e) =>
          isString
            ? setValue(e.target.value)
            : setValue(Number(e.target.value))
        }
        placeholder={`Enter ${title.toLowerCase()}`}
        className="shadow-sm focus:ring-2 focus:ring-blue-300 focus:border-blue-400"
      />
    </div>

    <div className="flex justify-end gap-3 mt-8">
      <Button
        variant="outline"
        onClick={() => setOpen(false)}
        className="hover:bg-gray-100 text-gray-700"
      >
        Cancel
      </Button>
      <Button
        onClick={onSave}
        className="bg-blue-600 text-white hover:bg-blue-700"
      >
        Save
      </Button>
    </div>
  </DialogContent>
</Dialog>

  );
}
