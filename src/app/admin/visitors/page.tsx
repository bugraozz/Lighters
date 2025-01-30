'use client';
import { useEffect, useState } from "react";

export default function VisitorList() {
  const [visitors, setVisitors] = useState([]);

  useEffect(() => {
    async function fetchVisitors() {
      const response = await fetch("/api/admin/admin-dashboard/get-visitors");
      const data = await response.json();
      setVisitors(data);
    }

    fetchVisitors();
  }, []);

  return (
    <div>
      <h1>Ziyaretçi Listesi</h1>
      <ul>
        {visitors.map((visitor) => (
          <li key={visitor.id}>
            IP: {visitor.ip}, User Agent: {visitor.user_agent}, Zaman:{" "}
            {new Date(visitor.visit_time).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
}
