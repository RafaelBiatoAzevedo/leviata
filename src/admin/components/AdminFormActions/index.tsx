import { FiArrowLeft, FiSave } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

import { Actions } from "./styles";
import { AdminButton } from "../AdminButton";
import Spinner from "../Spinner";

const AdminFormActions = ({ isSubmitting = false }) => {
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
