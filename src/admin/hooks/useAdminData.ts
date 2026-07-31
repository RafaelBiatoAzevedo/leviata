import { useContext } from "react";

import { AdminDataContext } from "../contexts/AdminDataContext";

export function useAdminData() {
  return useContext(AdminDataContext);
}
