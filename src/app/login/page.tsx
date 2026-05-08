import { LoginForm } from "./LoginForm";

type LoginPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function getFirst(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const redirectTo = getFirst(params.redirectTo) ?? "/";
  const signupParam = getFirst(params.signup);
  const passwordParam = getFirst(params.password);
  const signupState =
    signupParam === "success"
      ? "success"
      : signupParam === "check-email"
        ? "check-email"
        : "none";
  const passwordResetSuccess = passwordParam === "reset";

  return (
    <LoginForm
      redirectTo={redirectTo}
      signupState={signupState}
      passwordResetSuccess={passwordResetSuccess}
    />
  );
}
