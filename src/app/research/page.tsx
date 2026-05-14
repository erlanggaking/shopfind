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
    reviews: 1250,
    createdAt: "2023-11-15",
    trend: "Hot",
    sales30Days: 3500,
    totalSales: 45000,
    totalRevenue: 2925000000,
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
    reviews: 840,
    createdAt: "2024-02-10",
    trend: "Trending",
    sales30Days: 1200,
    totalSales: 8900,
    totalRevenue: 1290500000,
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
    reviews: 320,
    createdAt: "2024-04-05",
    trend: "New",
    sales30Days: 890,
    totalSales: 1200,
    totalRevenue: 106800000,
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
          sales_monthly: product.sales30Days,
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
          <Card key={product.id} className="bg-slate-900 border-slate-800 hover:border-slate-700 transition-colors p-5 flex flex-col lg:flex-row gap-6 group relative">
            {/* Thumbnail */}
            <div className="relative w-full lg:w-48 lg:h-48 aspect-square rounded-xl bg-slate-800 overflow-hidden flex-shrink-0 border border-slate-800">
               <img 
                 src={product.imageUrl} 
                 alt={product.name}
                 className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
               />
               <div className="absolute top-2 left-2 flex flex-col gap-2">
                 <Badge variant="secondary" className="bg-slate-950/80 backdrop-blur-md text-white border-none shadow-sm">
                    <Award className="w-3 h-3 mr-1 text-yellow-500" />
                    {product.shopStatus}
                 </Badge>
                 <Badge variant="secondary" className={`backdrop-blur-md border-none shadow-sm ${product.trend === 'Hot' ? 'bg-red-500/90 text-white' : product.trend === 'Trending' ? 'bg-orange-500/90 text-white' : 'bg-blue-500/90 text-white'}`}>
                    {product.trend}
                 </Badge>
               </div>
            </div>

            {/* Content Body */}
            <div className="flex-1 flex flex-col">
              {/* Header Info */}
              <div className="mb-4">
                <div className="flex justify-between items-start gap-4">
                  <h3 className="text-xl font-bold text-slate-100 line-clamp-2 leading-snug">
                    {product.name}
                  </h3>
                  <div className="text-right flex-shrink-0">
                    <div className="text-2xl font-black text-white">Rp {product.priceDiscount.toLocaleString('id-ID')}</div>
                    <div className="text-sm text-slate-500 line-through">Rp {product.priceNormal.toLocaleString('id-ID')}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-2 text-sm text-slate-400">
                  <span className="flex items-center"><MapPin className="w-3.5 h-3.5 mr-1 text-slate-500"/> {product.location}</span>
                  <span>•</span>
                  <span>Dibuat: <span className="text-slate-300">{product.createdAt}</span></span>
                </div>
              </div>

              {/* Data Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-950/50 p-4 rounded-lg border border-slate-800/60 mt-auto">
                 {/* Rating & Reviews */}
                 <div className="space-y-1">
                   <p className="text-xs text-slate-500 font-medium">Rating & Ulasan</p>
                   <div className="flex items-center gap-1.5">
                     <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                     <span className="font-bold text-slate-200">{product.rating}</span>
                     <span className="text-xs text-slate-400">({product.reviews.toLocaleString('id-ID')})</span>
                   </div>
                 </div>

                 {/* Sales 30 Days */}
                 <div className="space-y-1">
                   <p className="text-xs text-slate-500 font-medium">Penjualan 30 Hari</p>
                   <p className="font-bold text-slate-200">{product.sales30Days.toLocaleString('id-ID')} <span className="text-xs text-slate-400 font-normal">terjual</span></p>
                 </div>

                 {/* Total Sales */}
                 <div className="space-y-1">
                   <p className="text-xs text-slate-500 font-medium">Total Penjualan</p>
                   <p className="font-bold text-slate-200">{product.totalSales.toLocaleString('id-ID')} <span className="text-xs text-slate-400 font-normal">terjual</span></p>
                 </div>

                 {/* Total Revenue */}
                 <div className="space-y-1">
                   <p className="text-xs text-slate-500 font-medium">Total Pendapatan</p>
                   <p className="font-bold text-emerald-400">Rp {product.totalRevenue.toLocaleString('id-ID')}</p>
                 </div>
              </div>
            </div>

            {/* Action / Commission Column */}
            <div className="lg:w-64 lg:border-l border-slate-800 lg:pl-6 flex flex-col justify-center gap-4">
              <div className="space-y-3 w-full">
                <div className="bg-gradient-to-br from-orange-500/10 to-red-500/5 rounded-xl p-4 border border-orange-500/20 text-center">
                   <p className="text-xs text-slate-400 mb-1">Potensi Komisi</p>
                   <p className="text-3xl font-black bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                     {product.commissionRate}%
                   </p>
                   <p className="text-sm font-bold text-orange-400 mt-1">Rp {product.commissionEstimate.toLocaleString('id-ID')}</p>
                </div>
                
                <div className="flex justify-between items-center px-2 text-sm">
                  <span className="text-slate-500">Sisa Stok</span>
                  <span className="font-bold text-slate-200">{product.stock.toLocaleString('id-ID')}</span>
                </div>

                <Button 
                  className={`w-full h-12 shadow-lg ${savedProducts.includes(product.id) ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20' : 'bg-orange-600 hover:bg-orange-700 shadow-orange-500/20 text-white'} transition-all`}
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
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
