import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { isAxiosError } from "axios";
import {
  FiArrowLeft,
  FiArrowRight,
  FiAlertCircle,
  FiEye,
  FiEyeOff,
  FiLoader,
  FiLock,
  FiMail,
  FiShield,
} from "react-icons/fi";
import leviataLogo from "../../../assets/images/leviataLogo.png";
import { ThemeToggle } from "../../../components/ThemeToggle";
import { AppVersion } from "../../../components/AppVersion";
import { login } from "../../services/auth";
import { useAuth } from "../../hooks/useAuth";
import {
  BackLink,
  Brand,
  BrandPanel,
  Container,
  Card,
  Content,
  Eyebrow,
  ErrorNotice,
  Field,
  FieldControl,
  FieldIcon,
  Footer,
  Form,
  FormPanel,
  Input,
  PanelFootnote,
  PasswordToggle,
  Story,
  SubmitButton,
  Title,
  Subtitle,
  TopBar,
} from "./styles";

export function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const pending = useRef(false);
  const mounted = useRef(true);
  const navigate = useNavigate();
  const { signIn } = useAuth();

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending.current) return;
    pending.current = true;
    setSubmitting(true);
    setError("");
    try {
      const response = await login({
        email: email.trim().toLowerCase(),
        password,
      });
      if (!mounted.current) return;
      signIn(response);
      setShowPassword(false);
      navigate("/admin", { replace: true });
    } catch (failure) {
      if (!mounted.current) return;
      const status = isAxiosError(failure)
        ? failure.response?.status
        : undefined;
      setError(
        status === 401 || status === 403
          ? "Não foi possível entrar. Confira seu e-mail e sua senha."
          : status === 429
            ? "Muitas tentativas de acesso. Aguarde um pouco e tente novamente."
            : isAxiosError(failure) && !failure.response
              ? "Não foi possível conectar. Verifique sua conexão e tente novamente."
              : "O serviço está indisponível no momento. Tente novamente em instantes.",
      );
    } finally {
      pending.current = false;
      if (mounted.current) setSubmitting(false);
    }
  }

  return (
    <Container>
      <TopBar>
        <BackLink to="/">
          <FiArrowLeft aria-hidden="true" />
          Voltar ao portal
        </BackLink>
        <ThemeToggle />
      </TopBar>

      <Content>
        <Card aria-labelledby="login-title">
          <BrandPanel>
            <Brand>
              <img src={leviataLogo} alt="" />
              <div>
                <span>Grupo de pesquisa</span>
                <strong>Leviatã e o Cativeiro</strong>
              </div>
            </Brand>
            <Story>
              <span>Desde 2019</span>
              <h2>
                História em diálogo.
                <br />
                Pesquisa em movimento.
              </h2>
              <p>
                Um espaço para organizar conteúdos, compartilhar pesquisas e
                aproximar pessoas.
              </p>
            </Story>
            <PanelFootnote>
              Estado Moderno · Escravidão · Sociedade
            </PanelFootnote>
          </BrandPanel>

          <FormPanel>
            <Eyebrow>
              <FiShield aria-hidden="true" /> Área administrativa
            </Eyebrow>
            <Title id="login-title">Bem-vindo de volta.</Title>
            <Subtitle>Entre com sua conta para cuidar do portal.</Subtitle>

            <Form onSubmit={handleSubmit} aria-busy={submitting}>
              <Field>
                <label htmlFor="login-email">E-mail</label>
                <FieldControl>
                  <FieldIcon aria-hidden="true">
                    <FiMail />
                  </FieldIcon>
                  <Input
                    id="login-email"
                    name="email"
                    type="email"
                    inputMode="email"
                    autoComplete="username"
                    autoCapitalize="none"
                    spellCheck={false}
                    placeholder="seuemail@exemplo.com"
                    required
                    disabled={submitting}
                    value={email}
                    onChange={(event) => {
                      setEmail(event.target.value);
                      setError("");
                    }}
                    aria-describedby={error ? "login-error" : undefined}
                  />
                </FieldControl>
              </Field>

              <Field>
                <label htmlFor="login-password">Senha</label>
                <FieldControl>
                  <FieldIcon aria-hidden="true">
                    <FiLock />
                  </FieldIcon>
                  <Input
                    id="login-password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="Digite sua senha"
                    required
                    disabled={submitting}
                    $password
                    value={password}
                    onChange={(event) => {
                      setPassword(event.target.value);
                      setError("");
                    }}
                    aria-describedby={error ? "login-error" : undefined}
                  />
                  <PasswordToggle
                    type="button"
                    aria-label={
                      showPassword ? "Ocultar senha" : "Mostrar senha"
                    }
                    title={showPassword ? "Ocultar senha" : "Mostrar senha"}
                    aria-pressed={showPassword}
                    aria-controls="login-password"
                    onClick={() => setShowPassword((visible) => !visible)}
                  >
                    {showPassword ? (
                      <FiEyeOff aria-hidden="true" />
                    ) : (
                      <FiEye aria-hidden="true" />
                    )}
                  </PasswordToggle>
                </FieldControl>
              </Field>

              {error && (
                <ErrorNotice id="login-error" role="alert">
                  <FiAlertCircle aria-hidden="true" />
                  <span>{error}</span>
                </ErrorNotice>
              )}

              <SubmitButton type="submit" disabled={submitting}>
                {submitting ? (
                  <>
                    <FiLoader data-loading aria-hidden="true" /> Entrando…
                  </>
                ) : (
                  <>
                    Entrar no painel <FiArrowRight aria-hidden="true" />
                  </>
                )}
              </SubmitButton>
            </Form>
          </FormPanel>
        </Card>
      </Content>

      <Footer>
        <span>© {new Date().getFullYear()} Grupo de Pesquisa Leviatã e o Cativeiro</span>
        <AppVersion />
      </Footer>
    </Container>
  );
}
