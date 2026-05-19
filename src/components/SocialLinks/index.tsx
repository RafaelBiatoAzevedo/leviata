import { Links, SocialButton } from "./styles";

import { FaInstagram, FaFacebook, FaYoutube } from "react-icons/fa";

export const SocialLinks = () => {
  return (
    <Links>
      <SocialButton
        href="https://www.facebook.com/leviataeocativeiro"
        target="_blank"
        rel="noopener noreferrer"
      >
        <FaFacebook />
      </SocialButton>

      <SocialButton
        href="https://www.instagram.com/leviataeocativeiro"
        target="_blank"
        rel="noopener noreferrer"
      >
        <FaInstagram />
      </SocialButton>

      <SocialButton
        href="https://www.youtube.com/@LeviataeoCativeiro"
        target="_blank"
        rel="noopener noreferrer"
      >
        <FaYoutube />
      </SocialButton>
    </Links>
  );
};
