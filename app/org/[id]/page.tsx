"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation"; 
import { getOrgById, updateOrg, deleteOrg, authenticateUser } from "@/actions/action"; 
import { FiEdit, FiTrash2 } from "react-icons/fi"; 
import { AiOutlineSync } from "react-icons/ai"; 

interface AuthResult {
  device_code?: string;
  verification_url?: string;
  message?: string;
}

export default function OrgDetails() {
  const { id } = useParams(); 
  const router = useRouter(); 
  const [org, setOrg] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<{ [key: string]: boolean }>({
    orgName: false,
    Type: false,
    Status: false,
    Active: false,
  });
  const [editedOrg, setEditedOrg] = useState<any | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [authResult, setAuthResult] = useState<AuthResult | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [showIframe, setShowIframe] = useState(false); // State for iframe visibility

  useEffect(() => {
    if (id) {
      const loadOrgData = async () => {
        try {
          setLoading(true);
          const orgData = await getOrgById(Number(id));
          setOrg(orgData);
          setEditedOrg(orgData);
        } catch (error) {
          setError("Failed to load organization details.");
        } finally {
          setLoading(false);
        }
      };

      loadOrgData();
    }
  }, [id]);

  const handleEditField = (field: keyof typeof org, value: any) => {
    if (editedOrg) {
      const updatedOrg = { ...editedOrg, [field]: value };
      setEditedOrg(updatedOrg);
      setHasChanges(true);
    }
  };

  const handleSave = async () => {
    if (editedOrg) {
      try {
        await updateOrg(editedOrg.id, editedOrg.orgName, editedOrg.Type, editedOrg.Status, editedOrg.Active);
        setOrg(editedOrg);
        setHasChanges(false);
        setIsEditing({ orgName: false, Type: false, Status: false, Active: false });
      } catch (error) {
        setError("Failed to save changes.");
      }
    }
  };

  const handleCancel = () => {
    setEditedOrg(org);
    setHasChanges(false);
    setIsEditing({ orgName: false, Type: false, Status: false, Active: false });
  };

  const handleDelete = async () => {
    if (org) {
      try {
        await deleteOrg(org.id);
        router.push('/'); 
      } catch (error) {
        setError("Failed to delete organization.");
      }
    }
  };

  const handleAuthenticate = async () => {
    if (org) {
      setIsAuthLoading(true);
      setAuthResult(null);
      try {
        const alias = org.orgName.replace(/\s/g, '_');
        const result = await authenticateUser(alias);
        setAuthResult(result);
        if (result.verification_url) {
          setShowIframe(true); // Show iframe when authentication result is received
        }
      } catch (error) {
        setAuthResult({ message: 'Failed to authenticate.' });
      } finally {
        setIsAuthLoading(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center w-full h-screen">
        <div className="loader"></div> 
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-600">{error}</div>;
  }

  return (
    <main className="bg-gradient-to-r from-gray-50 to-gray-200 w-full min-h-screen text-black p-5 flex items-center justify-center">
      <div className="bg-white w-full max-w-2xl mx-auto p-8 rounded-lg shadow-lg border border-gray-300">
        {org ? (
          <>
            <header className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-semibold text-gray-800">Organization Details</h1>
              <div className="flex items-center">
                <FiTrash2 
                  className="ml-4 cursor-pointer text-red-500 hover:text-red-700 transition duration-200"
                  onClick={handleDelete}
                  title="Delete Organization"
                />
                <button 
                  onClick={handleAuthenticate}
                  className="ml-4 bg-green-500 text-white py-2 px-4 rounded transition duration-300 hover:bg-green-600 flex items-center"
                  disabled={isAuthLoading}
                >
                  {isAuthLoading ? (
                    <div className="loader"></div>
                  ) : (
                    <>
                      <AiOutlineSync className="mr-2" />
                      Authenticate
                    </>
                  )}
                </button>
              </div>
            </header>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-700">Organization Name:</span>
                  <div className="flex items-center">
                    {isEditing.orgName ? (
                      <input
                        type="text"
                        value={editedOrg?.orgName || ''}
                        onChange={(e) => handleEditField('orgName', e.target.value)}
                        className="border border-gray-300 rounded p-2 focus:outline-none focus:border-blue-500"
                      />
                    ) : (
                      <span className="text-gray-600">{org.orgName}</span>
                    )}
                    <FiEdit
                      className="ml-2 cursor-pointer text-blue-500 hover:text-blue-700 transition duration-200"
                      onClick={() => setIsEditing({ ...isEditing, orgName: !isEditing.orgName })}
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center mt-4">
                  <span className="font-semibold text-gray-700">Type:</span>
                  <div className="flex items-center">
                    {isEditing.Type ? (
                      <select
                        value={editedOrg?.Type || '--None--'}
                        onChange={(e) => handleEditField('Type', e.target.value)}
                        className="border border-gray-300 rounded p-2 focus:outline-none focus:border-blue-500"
                      >
                        <option value="--None--">--None--</option>
                        <option value="Sandbox">Sandbox</option>
                        <option value="Production">Production</option>
                      </select>
                    ) : (
                      <span className="text-gray-600">{org.Type}</span>
                    )}
                    <FiEdit
                      className="ml-2 cursor-pointer text-blue-500 hover:text-blue-700 transition duration-200"
                      onClick={() => setIsEditing({ ...isEditing, Type: !isEditing.Type })}
                    />
                  </div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-700">Status:</span>
                  <div className="flex items-center">
                    {isEditing.Status ? (
                      <select
                        value={editedOrg?.Status || '--None--'}
                        onChange={(e) => handleEditField('Status', e.target.value)}
                        className="border border-gray-300 rounded p-2 focus:outline-none focus:border-blue-500"
                      >
                        <option value="--None--">--None--</option>
                        <option value="New">New</option>
                        <option value="Authenticated">Authenticated</option>
                        <option value="Auth-Expired">Auth-Expired</option>
                      </select>
                    ) : (
                      <span className="text-gray-600">{org.Status}</span>
                    )}
                    <FiEdit
                      className="ml-2 cursor-pointer text-blue-500 hover:text-blue-700 transition duration-200"
                      onClick={() => setIsEditing({ ...isEditing, Status: !isEditing.Status })}
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center mt-4">
                  <span className="font-semibold text-gray-700">Active:</span>
                  <div className="flex items-center">
                    {isEditing.Active ? (
                      <select
                        value={editedOrg?.Active ? "true" : "false"}
                        onChange={(e) => handleEditField('Active', e.target.value === "true")}
                        className="border border-gray-300 rounded p-2 focus:outline-none focus:border-blue-500"
                      >
                        <option value="false">No</option>
                        <option value="true">Yes</option>
                      </select>
                    ) : (
                      <span className="text-gray-600">{org.Active ? 'Yes' : 'No'}</span>
                    )}
                    <FiEdit
                      className="ml-2 cursor-pointer text-blue-500 hover:text-blue-700 transition duration-200"
                      onClick={() => setIsEditing({ ...isEditing, Active: !isEditing.Active })}
                    />
                  </div>
                </div>
              </div>
            </div>

            {hasChanges && (
              <div className="mt-6">
                <button
                  onClick={handleSave}
                  className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
                >
                  Save Changes
                </button>
                <button
                  onClick={handleCancel}
                  className="ml-2 bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400 transition duration-200"
                >
                  Cancel
                </button>
              </div>
            )}

            {authResult && showIframe && authResult.verification_url && (
              <div className="mt-6">
                <iframe
                  src={authResult.verification_url}
                  className="w-full h-64 border border-gray-300 rounded"
                  title="Authentication"
                ></iframe>
              </div>
            )}
          </>
        ) : (
          <div>No organization details found.</div>
        )}
      </div>
    </main>
  );
}