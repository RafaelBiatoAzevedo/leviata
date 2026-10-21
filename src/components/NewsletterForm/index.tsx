import { useId, useRef, useState, type FormEvent } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FiArrowUpRight, FiCheckCircle, FiMail } from "react-icons/fi";
import { newsletterSubscriptionsService } from "../../services/newsletter";
import {
  newsletterSubscriptionSchema,
  type NewsletterSubscriptionFormData,
} from "../../validations/newsletter";
import {
  newsletterSubscriptionData,
  newsletterSubscriptionError,
} from "../../utils/newsletter";
import {
  Container,
  EmailActionRow,
  Field,
  FieldError,
  Form,
  Header,
  HeaderCopy,
  HeaderIcon,
  Input,
  NameFields,
  Note,
  StatusMessage,
  SubmitButton,
} from "./styles";

interface INewsletterFormProps {
  type: "single" | "middle" | "complete";
  size?: "small" | "larger";
}

export function NewsletterForm({
  type,
  size = "larger",
}: INewsletterFormProps) {
  const formId = useId();
  const titleId = `${formId}-title`;
  const noteId = `${formId}-note`;
  const inFlight = useRef(false);
  const [subscribed, setSubscribed] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<NewsletterSubscriptionFormData>({
    resolver: zodResolver(newsletterSubscriptionSchema),
    defaultValues: { email: "", name: "", lastName: "", cellphone: "" },
  });

  async function subscribe(values: NewsletterSubscriptionFormData) {
    setSubscribed(false);
    try {
      await newsletterSubscriptionsService.subscribe(
        newsletterSubscriptionData(values),
      );
      reset();
      setSubscribed(true);
    } catch (error) {
      setError("root", {
        type: "server",
        message: newsletterSubscriptionError(error),
      });
    }
  }

  async function submitForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (inFlight.current) return;
    inFlight.current = true;
    try {
      await handleSubmit(subscribe)(event);
    } finally {
      inFlight.current = false;
    }
  }

  return (
    <Container $size={size} aria-labelledby={titleId}>
      <Header>
        <HeaderIcon aria-hidden="true">
          <FiMail />
        </HeaderIcon>
        <HeaderCopy>
          <h3 id={titleId}>Receba nossas novidades</h3>
          <p>Pesquisas, publicações e encontros do grupo no seu e-mail.</p>
        </HeaderCopy>
      </Header>

      <Form
        onSubmit={submitForm}
        onChange={() => {
          if (subscribed) setSubscribed(false);
        }}
        aria-labelledby={titleId}
        aria-describedby={noteId}
        aria-busy={isSubmitting}
        noValidate
      >
        {type !== "single" && (
          <NameFields>
            <Field>
              Nome
              <Input
                {...register("name")}
                autoComplete="given-name"
                placeholder="Seu nome (opcional)"
                maxLength={120}
                disabled={isSubmitting}
                aria-invalid={!!errors.name}
                aria-describedby={
                  errors.name ? `${formId}-name-error` : undefined
                }
              />
              {errors.name && (
                <FieldError id={`${formId}-name-error`} role="alert">
                  {errors.name.message}
                </FieldError>
              )}
            </Field>
            <Field>
              Sobrenome
              <Input
                {...register("lastName")}
                autoComplete="family-name"
                placeholder="Seu sobrenome (opcional)"
                maxLength={120}
                disabled={isSubmitting}
                aria-invalid={!!errors.lastName}
                aria-describedby={
                  errors.lastName ? `${formId}-last-name-error` : undefined
                }
              />
              {errors.lastName && (
                <FieldError id={`${formId}-last-name-error`} role="alert">
                  {errors.lastName.message}
                </FieldError>
              )}
            </Field>
          </NameFields>
        )}

        {type === "complete" && (
          <Field>
            Telefone
            <Input
              {...register("cellphone")}
              type="tel"
              autoComplete="tel"
              placeholder="Seu telefone (opcional)"
              maxLength={30}
              disabled={isSubmitting}
              aria-invalid={!!errors.cellphone}
              aria-describedby={
                errors.cellphone ? `${formId}-cellphone-error` : undefined
              }
            />
            {errors.cellphone && (
              <FieldError id={`${formId}-cellphone-error`} role="alert">
                {errors.cellphone.message}
              </FieldError>
            )}
          </Field>
        )}

        <EmailActionRow>
          <Field>
            E-mail
            <Input
              {...register("email")}
              type="email"
              autoComplete="email"
              placeholder="voce@exemplo.com"
              maxLength={254}
              required
              disabled={isSubmitting}
              aria-invalid={!!errors.email}
              aria-describedby={
                errors.email ? `${formId}-email-error` : undefined
              }
            />
            {errors.email && (
              <FieldError id={`${formId}-email-error`} role="alert">
                {errors.email.message}
              </FieldError>
            )}
          </Field>
          <SubmitButton type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Salvando..." : "Quero receber"}
            <FiArrowUpRight aria-hidden="true" />
          </SubmitButton>
        </EmailActionRow>
        <Note id={noteId}>
          {type === "single"
            ? "Só precisamos do seu e-mail para cadastrar sua inscrição."
            : "Somente o e-mail é obrigatório. Os demais dados são opcionais."}
        </Note>
        {errors.root && (
          <StatusMessage $error role="alert">
            {errors.root.message}
          </StatusMessage>
        )}
        {subscribed && (
          <StatusMessage role="status">
            <FiCheckCircle aria-hidden="true" />
            Inscrição realizada com sucesso!
          </StatusMessage>
        )}
      </Form>
    </Container>
  );
}
