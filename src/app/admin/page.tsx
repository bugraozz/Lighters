"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FaUser, FaTshirt, FaFileAlt, FaSquare, FaChartBar, FaSignOutAlt, FaJediOrder, FaArchive } from "react-icons/fa";
import { MdFemale, MdMale } from "react-icons/md";
import { MoveRight, Flame, Smartphone, Users, ChartArea, Archive  } from "lucide-react"

export default function AdminPage() {
  const { logout } = useAuth();
  const { user } = useAuth();
  const router = useRouter();
  const [totalUsers, setTotalUsers] = useState<number | null>(null);
  const [totalProducts, setTotalProducts] = useState<number | null>(null);
  const [totalAmount, setTotalAmount] = useState<number | null>(null);
  const [outOfStock, setOutOfStock] = useState<number | null>(null);
  const [lowStock, setLowStock] = useState<number | null>(null);
  const [lowOrOutOfStock, setLowOrOutOfStock] = useState<number | null>(null);
  const [visitorCount, setVisitorCount] = useState(0);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
 
    const fetchTotalUsers = async () => {
      try {
        const response = await fetch("/api/admin/admin-dashboard");
        const data = await response.json();
        setTotalUsers(data.total_users);
      } catch (error) {
        console.error("Client: Error fetching total users:", error);
      }
    };


    const fetchTotalProducts = async () => {
      try {
        const response = await fetch("/api/admin/admin-dashboard/admin-product");
        const data = await response.json();
        setTotalProducts(data.total_products);
      } catch (error) {
        console.error("Client: Error fetching total products:", error);
      }
    };

    const fetchTotalAmount = async () => {
      try {
        const response = await fetch("/api/admin/admin-dashboard/admin-totalamount");
        const data = await response.json();
        setTotalAmount(data.total_amount);
      } catch (error) {
        console.error("Client: Error fetching total amount:", error);
      }
    };

    const fetchLowOrOutOfStock = async () => {
      try {
        const response = await fetch("/api/admin/admin-dashboard/stock-warnings");
        const data = await response.json();
        setLowOrOutOfStock(data.low_or_out_of_stock || 0);
      } catch (error) {
        console.error("Error fetching stock warnings:", error);
      }
    };

    const fetchVisitorCount = async () => {
      try {
        const response = await fetch("/api/admin/admin-dashboard/admin-visitor-count");
        const data = await response.json();
        setVisitorCount(data.totalVisitors);
      } catch (error) {
        console.error("Error fetching visitor count:", error);
      }
    };


    fetchVisitorCount();
    fetchLowOrOutOfStock();
    fetchTotalAmount();
    fetchTotalProducts();
    fetchTotalUsers();
  }, []);

  const statistics = [
    {
      title: "Toplam Kullanıcı",
      value: totalUsers !== null ? totalUsers : "Yükleniyor...",
      icon: FaUser,
      color: "bg-green-500",
    },
    {
      title: "Toplam Ürün",
      value: totalProducts !== null ? totalProducts : "Yükleniyor...",
      icon: Flame,
      color: "bg-red-500",
    },
    {
      title: "Toplam Ziyaretçi",
      value: visitorCount,
      icon: FaJediOrder,
      color: "bg-purple-500",
    },
    // {
    //   title: "Toplam Satış",
    //   value: totalAmount !== null ? `₺${totalAmount}` : "Yükleniyor...",
    //   icon: FaChartBar,
    //   color: "bg-yellow-500",
    // },
    // {
    //   title: "Stok Uyarısı",
    //   value: lowOrOutOfStock !== null ? lowOrOutOfStock : "Yükleniyor...",
    //   icon: FaSquare,
    //   color: "bg-red-500",
    // },
  ];

  

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-black dark:text-white"> 
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-black shadow-md"> {/* dark:bg-gray-800 sınıfı eklendi */}
        <div className="p-4">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Admin Panel</h1> {/* dark:text-white sınıfı eklendi */}
        </div>
        <nav className="mt-6">
            {[
            { name: "Çakmak Ürünleri", href: "/admin/cakmak", icon: Flame, color: "text-orange-500" },
            { name: "Kılıf Ürünleri", href: "/admin/kilif", icon: Smartphone, color: "text-blue-500" },
            { name: "Kullanıcılar", href: "/admin/users", icon: Users, color: "text-green-500" },
            { name: "Ürünler", href: "/admin/products-stock", icon: Archive, color: "text-red-500" },
           
           
            ].map((item) => (
            <Link key={item.name} href={item.href}>
              <span className="flex items-center px-6 py-3 text-gray-600 hover:bg-gray-100 hover:text-gray-800 cursor-pointer">
              <item.icon className={`mr-3 ${item.color || ""}`} />
              {item.name}
              </span>
            </Link>
            ))}
        </nav>
        <div className="absolute bottom-0 w-64 p-4">
          <Button onClick={logout} className="w-full bg-red-500 text-white hover:bg-red-600">
            <FaSignOutAlt className="mr-2" /> Çıkış Yap
          </Button>
          <Button className="w-full mt-4 bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-black dark:text-white dark:hover:bg-gray-600">
            <Link href="/">Siteye Dön</Link>
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-black dark:text-white"> {/* dark:bg-gray-900 ve dark:text-white sınıfları eklendi */}
        <div className="container mx-auto px-6 py-8 dark:bg-black">
          <h2 className="text-3xl font-semibold text-gray-800 dark:bg-black dark:text-white mb-6">Genel Bakış</h2> {/* dark:text-white sınıfı eklendi */}

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statistics.map((stat, index) => (
              <Card key={index} className="dark:bg-black dark:text-white"> {/* dark:bg-gray-800 ve dark:text-white sınıfları eklendi */}
                <CardContent className="flex items-center p-6">
                  <div className={`rounded-full p-3 ${stat.color}`}>
                    <stat.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="ml-4">
                    <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.title}</CardTitle> {/* dark:text-gray-400 sınıfı eklendi */}
                    <p className="text-2xl font-semibold text-gray-800 dark:text-white">
                      {typeof stat.value === "number" ? stat.value.toString() : stat.value}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Recent Activity */}
        
        </div>
      </main>
    </div>
  );
}

