import { useContext } from "react";
import { ModalContext } from "../shared/Modal/ModalProvider";

export function useModal() {
  return useContext(ModalContext);
}
