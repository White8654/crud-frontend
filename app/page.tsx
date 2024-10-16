"use client";

import { addOrg, getOrgs, updateOrg, deleteOrg } from "@/actions/action";
import Popup from "@/components/Popup";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Org {
  id: number;
  orgName: string;
  Type: string;
  Status: string;
  Active: boolean;
  LastUpdated: string;
}

export default function Home() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [tableData, setTableData] = useState<Org[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState<Org[]>([]);
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;
  const router = useRouter();

  const openPopup = () => setIsPopupOpen(true);
  const closePopup = () => setIsPopupOpen(false);

  // Load organizations from API
  const loadTableData = async () => {
    try {
      const orgs: Org[] = await getOrgs();
      setTableData(orgs);
      setFilteredData(orgs);
    } catch (error) {
      console.error("Error loading organizations:", error);
    }
  };

  // Handle adding a new organization
  const handleOrgSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const target = event.target as typeof event.target & {
      orgName: { value: string };
      type: { value: string };
      status: { value: string };
      active: { checked: boolean };
    };

    const newOrg: Org = {
      id: Math.floor(Math.random() * 10000), // Temporary ID
      orgName: target.orgName.value,
      Type: target.type.value,
      Status: target.status.value,
      Active: target.active.checked,
      LastUpdated: new Date().toISOString(),
    };

    try {
      await addOrg(newOrg.orgName, newOrg.Type, newOrg.Status, newOrg.Active);
      closePopup();
      loadTableData(); // Reload table data after adding the new organization
    } catch (error) {
      console.error("Error submitting organization:", error);
    }
  };

  // Handle deleting an organization
  const handleDelete = async (id: number) => {
    try {
      await deleteOrg(id);
      loadTableData(); // Reload after deletion
    } catch (error) {
      console.error("Error deleting organization:", error);
    }
  };

  // Handle updating an organization (triggering the popup to edit can be added)
  const handleUpdate = async (id: number, updatedOrg: Partial<Org>) => {
    try {
      await updateOrg(id, updatedOrg.orgName || "", updatedOrg.Type || "", updatedOrg.Status || "", updatedOrg.Active || false);
      loadTableData();
    } catch (error) {
      console.error("Error updating organization:", error);
    }
  };

  useEffect(() => {
    loadTableData();
  }, []);

  useEffect(() => {
    const filtered = tableData.filter((org) =>
      org.orgName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredData(filtered);
  }, [searchTerm, tableData]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentData = filteredData.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return (
    <main className="bg-white w-4/5 mx-auto mt-20 p-5 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-3">
        <div className="text-3xl text-black">Organizations</div>
        <button onClick={openPopup} className="bg-blue-500 text-white px-5 py-2 rounded-xl">
          Add Organization
        </button>
      </div>

      <div className="mb-5">
        <input
          type="text"
          placeholder="Search organizations..."
          className="border text-black rounded-lg w-full p-2"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <Popup isOpen={isPopupOpen} onClose={closePopup}>
        <form onSubmit={handleOrgSubmit} className="mx-auto">
          <div className="mb-5">
            <label htmlFor="orgName" className="block mb-2 text-sm font-medium text-black">
              Organization Name
            </label>
            <input
              type="text"
              id="orgName"
              placeholder="Enter organization name"
              className="border rounded-lg block w-full p-2"
              required
            />
          </div>
          <div className="mb-5">
            <label htmlFor="type" className="block mb-2 text-sm font-medium text-black">
              Type
            </label>
            <select id="type" className="border rounded-lg block w-full p-2" required>
              <option value="" disabled selected>Select type</option>
              <option value="--None--">--None--</option>
              <option value="Sandbox">Sandbox</option>
              <option value="Production">Production</option>
            </select>
          </div>
          <div className="mb-5">
            <label htmlFor="status" className="block mb-2 text-sm font-medium text-black">
              Status
            </label>
            <select id="status" className="border rounded-lg block w-full p-2" required>
              <option value="" disabled selected>Select status</option>
              <option value="--None--">--None--</option>
              <option value="New">New</option>
              <option value="Authenticated">Authenticated</option>
              <option value="Auth-Expired">Auth-Expired</option>
            </select>
          </div>
          <div className="mb-5">
            <label htmlFor="active" className="block mb-2 text-sm font-medium text-black">
              Active
            </label>
            <input type="checkbox" id="active" className="border rounded-lg block w-4 h-4" />
          </div>
          <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-lg">
            Add Organization
          </button>
        </form>
      </Popup>

      <div className="mt-5">
        <table className="w-full border rounded-xl overflow-hidden">
          <thead className="bg-gray-800">
            <tr>
              <th className="text-left py-3 text-lg px-4 text-white" style={{ width: '10%' }}>
                #
              </th>
              <th className="text-left py-3 text-lg px-4 text-white" style={{ width: '55%' }}>
                Organization Name
              </th>
              <th className="text-left py-3 text-lg px-4 text-white" style={{ width: '20%' }}>
                Last Updated
              </th>
              
            </tr>
          </thead>
          <tbody>
            {currentData.map((row, index) => (
              <tr key={row.id} className="text-left text-black odd:bg-gray-100 even:bg-gray-50">
                <td className="py-3 px-4" style={{ width: '10%' }}>
                  {(page - 1) * itemsPerPage + index + 1}
                </td>
                <td className="py-3 px-4" style={{ width: '55%' }}>
                  <span className="text-blue-500 cursor-pointer hover:underline" onClick={() => router.push(`/org/${row.id}`)}>
                    {row.orgName}
                  </span>
                </td>
                <td className="py-3 px-4" style={{ width: '20%' }}>
                  {new Date(row.LastUpdated).toLocaleString()}
                </td>
                
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-5 flex justify-between items-center">
        <div className="text-black">
          Showing {currentData.length} of {filteredData.length} items
        </div>
        <div>
          <button
            disabled={page === 1}
            onClick={() => setPage((prev) => prev - 1)}
            className="bg-blue-500 text-white px-3 py-1 rounded-lg mr-2"
          >
            Previous
          </button>
          <button
            disabled={page === totalPages}
            onClick={() => setPage((prev) => prev + 1)}
            className="bg-blue-500 text-white px-3 py-1 rounded-lg"
          >
            Next
          </button>
        </div>
      </div>
    </main>
  );
}