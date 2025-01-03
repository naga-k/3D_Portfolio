// app/admin/dahsboard/page.tsx
"use client";

import { useRouter } from "next/navigation";
import AuthContainer from "../components/AuthContainer";
import React, { useState, useEffect } from "react";

interface SplatItem {
  id: number;
  src: string;
  splatUrl: string;
}

export default function DashBoard() {
  const router = useRouter();
  return (
    <AuthContainer fallback={() => {router.push("/admin");}}>
      <DashboardContainer />
    </AuthContainer>
  );
}

function DashboardContainer() {
  const router = useRouter();
  const [splats, setSplats] = useState<SplatItem[]>([]);

  const handleLogout = async () => {
    fetch("/api/admin/logout", { method: "POST" })
      .then(() => {
        router.push("/admin");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    fetch("/api/fetchVideoItems")
      .then((res) => res.json())
      .then((data) => setSplats(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <>
      <div className="w-screen p-4 flex flex-row justify-between items-center">
        <div className="mx-2 p-2 font-bold text-lg hover:text-teal-400">
          <p>Admin Dashboard</p>
        </div>

        <ul className="flex flex-row justify-between list-none">
          <li className="mx-2 p-2 cursor-pointer hover:text-teal-400">
            <a onClick={() => {router.push("/");}}>Home</a>
          </li>
          <li className="mx-2 p-2 cursor-pointer hover:text-teal-400">
            <a onClick={handleLogout}>Log Out</a>
          </li>
        </ul>
      </div>

      <SplatList splats={splats} />
    </>
  );
}

function SplatList({ splats }: { splats: SplatItem[] }) {
  return (
    <table className="w-full mt-4">
      <thead>
        <tr className="bg-gray-200">
          <th className="p-2">ID</th>
          <th className="p-2">Source</th>
          <th className="p-2">Splat URL</th>
        </tr>
      </thead>
      <tbody>
        {splats.map(({ id, src, splatUrl }) => (
          <tr key={id} className="border-b">
            <td className="p-2">{id}</td>
            <td className="p-2">{src}</td>
            <td className="p-2">{splatUrl}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
