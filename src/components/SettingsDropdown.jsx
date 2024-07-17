import { useState, useEffect } from "react";
import { FaCog } from "react-icons/fa";

export default function SettingsDropdown() {
  const [settings, setSettings] = useState({});
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // fetchSettings();
  }, []);

  const fetchSettings = async () => {
    const res = await fetch("/api/settings");
    if (res.ok) {
      const data = await res.json();
      setSettings(data);
    }
  };

  const updateSettings = async (newSettings) => {
    const res = await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newSettings),
    });
    if (res.ok) {
      const data = await res.json();
      setSettings(data);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-black hover:bg-slate-200 p-2 rounded-full"
      >
        <FaCog size={22} />
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg py-1">
          <div className="px-4 py-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.emailNotifications}
                onChange={(e) =>
                  updateSettings({ emailNotifications: e.target.checked })
                }
                className="mr-2"
              />
              Email Notifications
            </label>
          </div>
          <div className="px-4 py-2">
            <select
              value={settings.theme}
              onChange={(e) => updateSettings({ theme: e.target.value })}
              className="w-full"
            >
              <option value="light">Light Theme</option>
              <option value="dark">Dark Theme</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
}
