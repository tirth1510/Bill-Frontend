"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Package, Plus } from "lucide-react";
import { useCreateProduct } from "@/hooks/product/useCreateProduct";
import ProductListTable from "@/pages/products/ProductListTable";
import { toast } from "sonner";

// Variant form type
type VariantForm = {
  gram: string;
  price: string;
  stock: string;
};

// Form data type
type FormData = {
  name: string;
  expiry: string;
  variants: VariantForm[];
};

export function ProductTable() {
  const { createProduct } = useCreateProduct();
  const [isNewProductOpen, setIsNewProductOpen] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    name: "",
    expiry: "",
    variants: [{ gram: "", price: "", stock: "" }],
  });

  // Handle variant input changes
  const handleVariantChange = (
    index: number,
    field: keyof VariantForm,
    value: string
  ) => {
    const updatedVariants = [...formData.variants];
    updatedVariants[index][field] = value;
    setFormData({ ...formData, variants: updatedVariants });
  };

  // Add new variant row
  const addVariant = () => {
    setFormData({
      ...formData,
      variants: [...formData.variants, { gram: "", price: "", stock: "" }],
    });
  };

  // Handle form submission
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      ItemName: formData.name,
      variants: formData.variants.map((v) => ({
        gram: Number(v.gram),
        price: Number(v.price),
        stock: Number(v.stock),
      })),
    };

    try {
      await createProduct(payload);

      toast.success(" Product added successfully!");

      // Reset form
      setFormData({
        name: "",
        expiry: "",
        variants: [{ gram: "", price: "", stock: "" }],
      });
      setIsNewProductOpen(false);
    } catch (err) {
      toast.error("❌ Failed to add product. Try again.");
    }
  };

  return (
    <div className="p-6 min-h-screen">
      {/* Header */}
      <div className="flex items-center">
        <h2 className="flex items-center text-2xl font-semibold ml-7 mt-7 bg-gradient-to-r from-blue-100 to-blue-600 bg-clip-text text-transparent">
          <Package className="w-6 h-6 mr-2 text-blue-600" />
          Products
        </h2>
        <Button
          className="ml-auto bg-blue-600 hover:bg-blue-700 text-white mr-7 mt-7"
          onClick={() => setIsNewProductOpen(true)}
        >
          <Plus className="w-4 h-4 mr-2" /> New Product
        </Button>
      </div>

      <ProductListTable />

      <Dialog open={isNewProductOpen} onOpenChange={setIsNewProductOpen}>
        <DialogContent className="max-w-lg rounded-2xl shadow-2xl bg-white p-8">
          <DialogHeader>
            <DialogTitle className="flex flex-col-1 text-xl font-semibold text-blue-500">
              <Package className="w-6 h-6 mr-2 text-blue-600" />
              Add New Product
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddProduct} className="space-y-6">
            {/* Product Name */}
            <div>
              <Label className="mb-1 block text-sm font-medium text-gray-700">
                Product Name
              </Label>
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Enter product name"
                required
                className="mt-1"
              />
            </div>

            {/* Variants */}
            {formData.variants.map((variant, idx) => (
              <div
                key={idx}
                className="grid grid-cols-3 gap-3 items-end border rounded-lg p-4 bg-gray-50"
              >
                <div>
                  <Label className="mb-1 block text-sm">Grams</Label>
                  <Input
                    type="number"
                    placeholder="Grams"
                    value={variant.gram}
                    onChange={(e) =>
                      handleVariantChange(idx, "gram", e.target.value)
                    }
                    required
                  />
                </div>
                <div>
                  <Label className="mb-1 block text-sm">Price</Label>
                  <Input
                    type="number"
                    placeholder="Price"
                    value={variant.price}
                    onChange={(e) =>
                      handleVariantChange(idx, "price", e.target.value)
                    }
                    required
                  />
                </div>
                <div>
                  <Label className="mb-1 block text-sm">Stock</Label>
                  <Input
                    type="number"
                    placeholder="Stock"
                    value={variant.stock}
                    onChange={(e) =>
                      handleVariantChange(idx, "stock", e.target.value)
                    }
                    required
                  />
                </div>
              </div>
            ))}

            {/* Add Variant Button */}
            <Button
              type="button"
              variant="secondary"
              onClick={addVariant}
              className="w-full"
            >
              + Add Variant
            </Button>

            {/* Actions */}
            <div className="flex justify-end gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsNewProductOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Add Product
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
