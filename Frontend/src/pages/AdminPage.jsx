import { useState } from "react";

const AdminPage = () => {
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("member");
  const [inviteSuccess, setInviteSuccess] = useState("");
  const [inviteError, setInviteError] = useState("");
  const [upgradeSuccess, setUpgradeSuccess] = useState("");
  const [upgradeError, setUpgradeError] = useState("");
  const [tenantSlug, setTenantSlug] = useState(""); // Admin should enter or select the tenant slug

  // Upgrade tenant to Pro
  const handleUpgrade = async () => {
    setUpgradeSuccess("");
    setUpgradeError("");
    if (!tenantSlug) {
      setUpgradeError("Please enter tenant slug.");
      return;
    }
    try {
      const res = await fetch(`http://localhost:5000/api/tenants/${tenantSlug}/upgrade`, {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) {
        setUpgradeSuccess("Tenant upgraded to Pro!");
      } else {
        setUpgradeError(data.message || "Upgrade failed.");
      }
    } catch (err) {
      setUpgradeError("Upgrade failed.");
    }
  };

  // Invite a new user
  const handleInvite = async (e) => {
    e.preventDefault();
    setInviteSuccess("");
    setInviteError("");
    if (!inviteEmail || !tenantSlug) {
      setInviteError("Please enter email and tenant slug.");
      return;
    }
    try {
      const res = await fetch("http://localhost:5000/api/auth/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email: inviteEmail,
          role: inviteRole,
          tenantSlug,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setInviteSuccess("User invited successfully!");
        setInviteEmail("");
      } else {
        setInviteError(data.message || "Invite failed.");
      }
    } catch (err) {
      setInviteError("Invite failed.");
    }
  };

  return (
    <div className="max-w-xl mx-auto py-12">
      <h1 className="text-3xl font-bold mb-8">Admin Panel</h1>

      {/* Upgrade Tenant */}
      <div className="mb-12 p-6 bg-white rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4">Upgrade Tenant to Pro</h2>
        <input
          type="text"
          placeholder="Tenant slug (e.g. acme)"
          value={tenantSlug}
          onChange={e => setTenantSlug(e.target.value)}
          className="border px-4 py-2 rounded w-full mb-4"
        />
        <button
          onClick={handleUpgrade}
          className="bg-blue-600 text-white px-6 py-2 rounded font-semibold hover:bg-blue-700"
        >
          Upgrade to Pro
        </button>
        {upgradeSuccess && <div className="text-green-600 mt-2">{upgradeSuccess}</div>}
        {upgradeError && <div className="text-red-600 mt-2">{upgradeError}</div>}
      </div>

      {/* Invite User */}
      <div className="p-6 bg-white rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4">Invite New User</h2>
        <form onSubmit={handleInvite} className="space-y-4">
          <input
            type="email"
            placeholder="User email"
            value={inviteEmail}
            onChange={e => setInviteEmail(e.target.value)}
            className="border px-4 py-2 rounded w-full"
            required
          />
          <select
            value={inviteRole}
            onChange={e => setInviteRole(e.target.value)}
            className="border px-4 py-2 rounded w-full"
          >
            <option value="member">Member</option>
            <option value="admin">Admin</option>
          </select>
          <button
            type="submit"
            className="bg-green-600 text-white px-6 py-2 rounded font-semibold hover:bg-green-700"
          >
            Invite User
          </button>
        </form>
        {inviteSuccess && <div className="text-green-600 mt-2">{inviteSuccess}</div>}
        {inviteError && <div className="text-red-600 mt-2">{inviteError}</div>}
      </div>
    </div>
  );
};

export default AdminPage;