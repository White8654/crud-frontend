// actions.ts
const apiUrl = "https://crud-backend-qxg3.onrender.com"; // Replace with your server URL if hosted elsewhere

// Function to authenticate a user
export const authenticateUser = async (alias: string) => {
  try {
    const response = await fetch(`${apiUrl}/authenticate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ alias }),
    });

    if (!response.ok) {
      throw new Error("Authentication failed.");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error authenticating user:", error);
    throw error;
  }
};

// Function to add a new organization
export const addOrg = async (orgName: string, Type: string, Status: string, Active: boolean) => {
  try {
    const response = await fetch(`${apiUrl}/org`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        orgName,
        Type,
        Status,
        Active,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to add organization.");
    }
  } catch (error) {
    console.error("Error adding organization:", error);
    throw error;
  }
};

// Function to get all organizations
export const getOrgs = async () => {
  try {
    const response = await fetch(`${apiUrl}/orgs`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch organizations.");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching organizations:", error);
    throw error;
  }
};

// Function to get a specific organization by ID
export const getOrgById = async (id: number) => {
  try {
    const response = await fetch(`${apiUrl}/org/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch organization.");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching organization:", error);
    throw error;
  }
};

// Function to update an organization
export const updateOrg = async (id: number, orgName: string, Type: string, Status: string, Active: boolean) => {
  try {
    const response = await fetch(`${apiUrl}/org/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        orgName,
        Type,
        Status,
        Active,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to update organization.");
    }
  } catch (error) {
    console.error("Error updating organization:", error);
    throw error;
  }
};

// Function to delete an organization
export const deleteOrg = async (id: number) => {
  try {
    const response = await fetch(`${apiUrl}/org`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });

    if (!response.ok) {
      throw new Error("Failed to delete organization.");
    }
  } catch (error) {
    console.error("Error deleting organization:", error);
    throw error;
  }
};