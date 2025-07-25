'use client';

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/(auth)/AuthContext";
import useMenuItems, { MenuItem } from "@/app/hooks/menu/useMenuItems";

import MenuHeader from "@/components/menu/MenuHeader";
import MenuTable from "@/components/menu/MenuTable";
import Pagination from "@/components/field/Pagination";

export default function MenuPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const { menuItems, loading, error } = useMenuItems();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Redirect unauthenticated users
  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/login");
    }
  }, [authLoading, user, router]);

  // Pagination logic
  const totalPages = Math.ceil(menuItems.length / itemsPerPage);
  const paginatedItems = menuItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [menuItems]);

  const columns = [
    { label: "Name" },
    { label: "Category" },
    { label: "Price" },
    { label: "Unit" },
    { label: "Quantity" },
    { label: "Added By" },
    { label: "Recorded At" },
  ];

  const rowRenderer = (item: MenuItem) => (
    <tr key={item.id}>
      <td className="border p-2 text-sm md:text-base">{item.name}</td>
      <td className="border p-2 text-sm md:text-base">{item.category || "-"}</td>
      <td className="border p-2 text-sm md:text-base">{item.price ?? "-"}</td>
      <td className="border p-2 text-sm md:text-base">{item.unit || "-"}</td>
      <td className="border p-2 text-sm md:text-base">{item.quantity ?? "-"}</td>
      <td className="border p-2 text-sm md:text-base">{item.addedBy || "-"}</td>
      <td className="border p-2 text-sm md:text-base">
        {item.recordedAt?.toDate ? item.recordedAt.toDate().toLocaleString() : "-"}
      </td>
    </tr>
  );

  // Guard render until auth status is known
  if (authLoading) return null;

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
      <div className="max-w-full sm:max-w-5xl mx-auto bg-white p-4 sm:p-6 rounded-lg shadow-md">
        <MenuHeader />
        {loading ? (
          <p className="text-center py-4">Loading...</p>
        ) : error ? (
          <p className="text-center text-red-600 py-4">{error}</p>
        ) : menuItems.length === 0 ? (
          <p className="text-center text-gray-500">No menu items found.</p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <MenuTable<MenuItem>
                items={paginatedItems}
                columns={columns}
                rowRenderer={rowRenderer}
              />
            </div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => {
                if (page >= 1 && page <= totalPages) setCurrentPage(page);
              }}
            />
          </>
        )}
      </div>
    </div>
  );
}
