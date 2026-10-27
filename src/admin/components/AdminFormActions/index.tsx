import { FiArrowLeft, FiSave } from "react-icons/fi";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

import { Actions } from "./styles";
import { AdminButton } from "../AdminButton";
import Spinner from "../Spinner";

interface AdminFormActionsProps {
  isSubmitting?: boolean;
  children?: ReactNode;
}

const AdminFormActions = ({
  isSubmitting = false,
  children,
}: AdminFormActionsProps) => {
  const navigate = useNavigate();

  return (
    <Actions>
      <AdminButton
        variant="outline"
        type="button"
        onClick={() => navigate(-1)}
        disabled={isSubmitting}
      >
        <FiArrowLeft />
        Cancelar
      </AdminButton>

      {children}

      <AdminButton type="submit" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Spinner />
            Salvando...
          </>
        ) : (
          <>
            <FiSave />
            Salvar
          </>
        )}
      </AdminButton>
    </Actions>
  );
};

export default AdminFormActions;
