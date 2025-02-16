'use client';

import { useEffect } from "react";
import Cookies from "js-cookie"; // Çerez işlemleri için


const VisitorTracker = () => {
    useEffect(() => {
        // Çerez kontrolü yap
        const hasVisited = Cookies.get("visited");

        if (!hasVisited) {
            // Eğer çerez yoksa, API'ye istek at ve ziyaretçiyi artır
            fetch("/api/admin/admin-dashboard/admin-visitor-count", {
                method: "POST",
            })
                .then((res) => res.json())
                .then(() => {
                    // Çerezi oluştur (cihazı tanımak için)
                    Cookies.set("visited", "true", { expires: 1 }); // 1 gün geçerli
                })
                .catch((err) => console.error("Ziyaretçi sayacı hatası:", err));
        }
    }, []);

    return null;
};

export default VisitorTracker;
