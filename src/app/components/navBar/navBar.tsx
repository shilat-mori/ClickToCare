"use client";
import React, { useState, useEffect } from "react";
import { UserRole } from "../../types/users/userRole";
import { getUserRoleFromCookies } from "../../services/frontUtils";
import { useRouter } from "next/navigation";
import NavbarProps from "../../types/navBar/navbarProps";
import NavButton from "./NavButton";
import ScoreButton from "./ScoreButton";

const NavBar: React.FC<NavbarProps> = ({ handleNavigator }) => {
  const [role, setRole] = useState<UserRole | null>(null);

  useEffect(() => {
    const fetchRole = async () => {
      const userRole = await getUserRoleFromCookies();
      setRole(userRole);
    };

    fetchRole();
  }, []);

  if (!role) return <div className="navbar_blocks">Loading...</div>;

  return (
    <div className="navbar_blocks">
      {role === UserRole.unauthorized ? (
        <NavButton text={"⌚"} navigation={"/pages/waiting"} handleNavigator={handleNavigator} />
      ) : (
        <NavButton text={"All Tasks"} navigation={"/pages/protected/publicTasks"} handleNavigator={handleNavigator} />
      )}

      {(role === UserRole.admin) && <NavButton text={'Verify Users'} navigation={'/pages/protected/admin/reviewNewUsers'} handleNavigator={handleNavigator} />}
      {(role === UserRole.admin) && <NavButton text={'Add a Task'} navigation={'/pages/protected/admin/newTask'} handleNavigator={handleNavigator} />}
      {(role === UserRole.authorized) && <NavButton text={'My Tasks'} navigation={'/pages/protected/user/myTasks'} handleNavigator={handleNavigator} />}
      {(role === UserRole.authorized) && <NavButton text={'My Activity'} navigation={'/pages/protected/user/myActivity'} handleNavigator={handleNavigator} />}

      <ScoreButton
        text={"Score Board"}
        navigation={"/pages/scores"}
        handleNavigator={handleNavigator}
      />
    </div>
  );
};

export default NavBar;
