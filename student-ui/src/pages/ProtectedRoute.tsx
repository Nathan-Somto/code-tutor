import { useAuth } from "@/providers/AuthProvider";
import { Outlet, useNavigate } from "react-router-dom";
import React from "react";
import { Spinner } from "@/components/ui/spinner";
export function ProtectedRoute() {
  const { state, isChecking } = useAuth();
  const navigate = useNavigate();
  React.useEffect(() => {
    console.log(state.auth);
    if (!state.auth && !isChecking) {
      navigate("/login");
    }
  }, [state.auth, isChecking]);
  if (isChecking) {
    return (
      <Spinner containerType="center" containerBackground="blur" size="md" />
    );
  }
  if (!state.auth) {
    return null;
  }
  return (
    <>
      <Outlet />
    </>
  );
}
