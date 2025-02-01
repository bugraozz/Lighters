"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FaUser, FaSignOutAlt, FaJediOrder } from "react-icons/fa";
import { Flame, Smartphone, Users, Archive } from "lucide-react";

export default function AdminPage() {
  const { logout } = useAuth();
  const [totalUsers, setTotalUsers] = useState<number | null>(null);
  const [totalProducts, setTotalProducts] = useState<number | null>(null);
  const [visitorCount, setVisitorCount] = useState(0);

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
  ];

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-black dark:text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-black shadow-md">
        <div className="p-4">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Admin Panel</h1>
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
      <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-black dark:text-white">
        <div className="container mx-auto px-6 py-8 dark:bg-black">
          <h2 className="text-3xl font-semibold text-gray-800 dark:bg-black dark:text-white mb-6">Genel Bakış</h2>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statistics.map((stat, index) => (
              <Card key={index} className="dark:bg-black dark:text-white">
                <CardContent className="flex items-center p-6">
                  <div className={`rounded-full p-3 ${stat.color}`}>
                    <stat.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="ml-4">
                    <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.title}</CardTitle>
                    <p className="text-2xl font-semibold text-gray-800 dark:text-white">
                      {typeof stat.value === "number" ? stat.value.toString() : stat.value}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

