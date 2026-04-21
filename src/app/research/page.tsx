"use client";

import { useState } from "react";
import { Search, Filter, ShoppingCart, Star, MapPin, Award } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/lib/supabase";

const DUMMY_PRODUCTS = [
  {
    id: "p1",
    name: "Kaos Distro Oversize Pria Wanita Bahan Combed 30s",
    imageUrl: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=300&h=300&fit=crop",
    priceNormal: 120000,
    priceDiscount: 65000,
    rating: 4.8,
    salesMonthly: 3500,
    location: "Jakarta Barat",
    shopStatus: "Star+",
    stock: 450,
    commissionRate: 12,
    commissionEstimate: 7800,
  },
  {
    id: "p2",
    name: "Sepatu Sneakers Putih Casual Korea Premium Quality",
    imageUrl: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&h=300&fit=crop",
    priceNormal: 250000,
    priceDiscount: 145000,
    rating: 4.9,
    salesMonthly: 1200,
    location: "Kota Bandung",
    shopStatus: "Shopee Mall",
    stock: 120,
    commissionRate: 10,
    commissionEstimate: 14500,
  },
  {
    id: "p3",
    name: "Tas Ransel Pria Waterproof Tahan Air Backpack Kuliah",
    imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop",
    priceNormal: 185000,
    priceDiscount: 89000,
    rating: 4.6,
    salesMonthly: 890,
    location: "Surabaya",
    shopStatus: "Star",
    stock: 65,
    commissionRate: 15,
    commissionEstimate: 13350,
  },
];

export default function ProductResearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const [onlyCommission, setOnlyCommission] = useState(false);
  const [savedProducts, setSavedProducts] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  const handleSaveToCollection = async (product: typeof DUMMY_PRODUCTS[0]) => {
    setIsProcessing(product.id);
    
    // Simulate generating short link
    const simulatedLink = `https://shp.ee/${Math.random().toString(36).substring(7)}`;

    // Insert to Supabase Postgres
    const { error } = await supabase
      .from('agency_collection')
      .insert([
        {
          product_id: product.id,
          product_name: product.name,
          image_url: product.imageUrl,
          price_normal: product.priceNormal,
          price_discount: product.priceDiscount,
          rating: product.rating,
          sales_monthly: product.salesMonthly,
          location: product.location,
          shop_status: product.shopStatus,
          stock: product.stock,
          commission_rate: product.commissionRate,
          commission_estimate: product.commissionEstimate,
          affiliate_link: simulatedLink
        }
      ]);

    if (!error) {
       setSavedProducts((prev) => [...prev, product.id]);
    } else {
       console.error("Supabase insert error:", error);
       alert("Gagal menyimpan ke database Supabase!");
    }
    
    setIsProcessing(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Product Research</h2>
          <p className="text-slate-400 mt-1">Gunakan fitur ini untuk mencari produk winning dan masukkan ke koleksi.</p>
        </div>
      </div>

      <Card className="bg-slate-900 border-slate-800">
        <CardContent className="p-4 flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <Input 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari kaos distro, sepatu, dll..." 
              className="pl-9 bg-slate-950 border-slate-800 h-12"
            />
          </div>
          <div className="flex gap-4 items-center w-full md:w-auto overflow-x-auto">
             <div className="flex items-center space-x-2 border border-slate-800 px-4 h-12 rounded-md bg-slate-950 min-w-max">
                <Checkbox 
                  id="commission" 
                  checked={onlyCommission} 
                  onCheckedChange={(c) => setOnlyCommission(!!c)} 
                />
                <label
                  htmlFor="commission"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-300"
                >
                  Hanya Ada Komisi
                </label>
             </div>
             <Button className="h-12 bg-orange-600 hover:bg-orange-700 min-w-max">
                <Filter className="w-4 h-4 mr-2" />
                Validasi API
             </Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-4">
        {DUMMY_PRODUCTS.map((product) => (
          <Card key={product.id} className="bg-slate-900 border-slate-800 overflow-hidden hover:border-slate-700 transition-colors group p-4 flex flex-col sm:flex-row gap-5">
            {/* Thumbnail */}
            <div className="relative w-full sm:w-40 sm:h-40 aspect-square sm:aspect-auto rounded-lg bg-slate-800 overflow-hidden flex-shrink-0">
               <img 
                 src={product.imageUrl} 
                 alt={product.name}
                 className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
               />
               <div className="absolute top-2 left-2">
                 <Badge variant="secondary" className="bg-slate-950/80 backdrop-blur-sm text-white border-none shadow-sm">
                    <Award className="w-3 h-3 mr-1 text-yellow-500" />
                    {product.shopStatus}
                 </Badge>
               </div>
            </div>

            {/* Info Produk */}
            <div className="flex-1 flex flex-col justify-center">
              <h3 className="text-lg font-medium text-slate-200 line-clamp-2 leading-tight">
                {product.name}
              </h3>
              
              <div className="mt-2 flex items-baseline gap-2">
                 <span className="text-2xl font-bold text-white">Rp {product.priceDiscount.toLocaleString('id-ID')}</span>
                 <span className="text-sm text-slate-500 line-through">Rp {product.priceNormal.toLocaleString('id-ID')}</span>
              </div>

              <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-400">
                 <div className="flex items-center gap-1.5">
                   <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                   <span className="text-slate-300 font-medium">{product.rating}</span>
                   <span>({product.salesMonthly}+ terjual)</span>
                 </div>
                 <div className="flex items-center gap-1.5">
                   <MapPin className="w-3.5 h-3.5 text-slate-500" />
                   <span className="truncate">{product.location}</span>
                 </div>
                 <div className="flex items-center gap-1.5">
                   Stok: <span className="text-slate-300 font-medium">{product.stock}</span>
                 </div>
              </div>
            </div>

            {/* Aksi & Komisi */}
            <div className="sm:w-64 sm:border-l border-slate-800 sm:pl-5 flex flex-col justify-center gap-4">
              <div className="bg-slate-950/50 rounded-lg p-3 border border-slate-800/80 flex justify-between items-center">
                 <div>
                   <p className="text-xs text-slate-400">Est. Komisi</p>
                   <p className="text-sm font-bold text-orange-400">Rp {product.commissionEstimate.toLocaleString('id-ID')}</p>
                 </div>
                 <Badge variant="outline" className="text-orange-400 border-orange-500/30 bg-orange-500/10">
                   {product.commissionRate}%
                 </Badge>
              </div>

              <Button 
                className={`w-full h-11 ${savedProducts.includes(product.id) ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-slate-800 hover:bg-slate-700 text-slate-200'} transition-all`}
                onClick={() => handleSaveToCollection(product)}
                disabled={savedProducts.includes(product.id) || isProcessing === product.id}
              >
                {isProcessing === product.id ? "Memproses..." : savedProducts.includes(product.id) ? "Tersimpan" : (
                  <>
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Simpan Ke Koleksi
                  </>
                )}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
