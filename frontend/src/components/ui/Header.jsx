import React from "react";
import { useAuth } from "../../hooks/useAuth";
import { Button } from "./Button";

export const Header = () => {
  const { token, logout, userType, setUserType, isActualAdmin } = useAuth();

  const toggleUserType = () => {
    const newType = userType === "admin" ? "user" : "admin";
    setUserType(newType);
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <h1 className="text-2xl font-bold text-primary-600">Society Manager</h1>
          {token && (
            <div className="flex items-center space-x-4">
              {isActualAdmin && (
                <Button onClick={toggleUserType} variant="outline" size="sm">
                  Switch to {userType === "admin" ? "User View" : "Admin View"}
                </Button>
              )}
              <Button onClick={logout} variant="secondary" size="sm">
                Logout
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
