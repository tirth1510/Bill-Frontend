import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { useCreateProduct } from "@/hooks/product/useCreateProduct";
import ProductListTable from "@/pages/products/ProductListTable"; // Import table separately

// Form variant type
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
  const handleVariantChange = (index: number, field: keyof VariantForm, value: string) => {
    const updatedVariants = [...formData.variants];
    updatedVariants[index][field] = value;
    setFormData({ ...formData, variants: updatedVariants });
  };

  // Add new variant row
  const addVariant = () => {
    setFormData({ ...formData, variants: [...formData.variants, { gram: "", price: "", stock: "" }] });
  };

  // Handle form submission
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      ItemName: formData.name,
      variants: formData.variants.map(v => ({
        gram: Number(v.gram),
        price: Number(v.price),
        stock: Number(v.stock),
      })),
    };

    await createProduct(payload);

    // Reset form
    setFormData({ name: "", expiry: "", variants: [{ gram: "", price: "", stock: "" }] });
    setIsNewProductOpen(false);
  };

  return (
    <div className="p-6 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Products</h2>
        <Button onClick={() => setIsNewProductOpen(true)}>
          <Plus className="w-4 h-4 mr-2" /> New Product
        </Button>
      </div>

      {/* Products Table */}
      <ProductListTable />

      {/* New Product Dialog */}
      <Dialog open={isNewProductOpen} onOpenChange={setIsNewProductOpen}>
        <DialogContent className="max-w-lg rounded-2xl shadow-xl bg-white p-6">
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddProduct} className="space-y-5">
            <div>
              <Label>Product Name</Label>
              <Input
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter product name"
                required
              />
            </div>

            {formData.variants.map((variant, idx) => (
              <div key={idx} className="grid grid-cols-3 gap-3">
                <Input
                  type="number"
                  placeholder="Grams"
                  value={variant.gram}
                  onChange={e => handleVariantChange(idx, "gram", e.target.value)}
                  required
                />
                <Input
                  type="number"
                  placeholder="Price"
                  value={variant.price}
                  onChange={e => handleVariantChange(idx, "price", e.target.value)}
                  required
                />
                <Input
                  type="number"
                  placeholder="Stock"
                  value={variant.stock}
                  onChange={e => handleVariantChange(idx, "stock", e.target.value)}
                  required
                />
              </div>
            ))}

            <Button type="button" onClick={addVariant} className="bg-green-600 text-white">Add Variant</Button>

            <div className="flex justify-end gap-3 mt-6">
              <Button type="button" variant="outline" onClick={() => setIsNewProductOpen(false)}>Cancel</Button>
              <Button type="submit" className="bg-blue-600 text-white">Add Product</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
