import React, { useContext } from 'react';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';
import { AuthContext } from '@/App';

const LogoutButton = ({ size = "md", variant = "ghost", className = "" }) => {
  const { logout } = useContext(AuthContext);

  return (
    <Button
      variant={variant}
      size={size}
      onClick={logout}
      className={`text-slate-600 hover:text-red-600 ${className}`}
      title="Logout"
    >
      <ApperIcon name="LogOut" size={size === "sm" ? 14 : 16} />
    </Button>
  );
};

export default LogoutButton;