export const CONFIRM_EMAIL_COPY = {
  title: "Check your email",
  descriptionBefore: "We've sent a confirmation link to ",
  descriptionAfter: " Please verify your email to activate your account.",
  tipTitle: "Didn't receive the email?",
  tipDescription: "Check your spam folder or request a new confirmation email.",
  backToLogin: "Back to log in",
  resend: "Resend confirmation email",
  network: "Couldn't resend the confirmation email. Please try again.",
  wait: "Please wait before resending.",
  waitHour: "Please wait about an hour before resending another confirmation email.",
} as const;

export type ConfirmEmailWait = { type: "wait"; seconds?: number };
export type ConfirmEmailResendResult = "network" | "sent" | "wait" | ConfirmEmailWait;

export function confirmEmailErrorMessage(
  result: ConfirmEmailResendResult | void,
): string | undefined {
  if (result === "network") return CONFIRM_EMAIL_COPY.network;
  if (result === "wait") return CONFIRM_EMAIL_COPY.wait;
  if (typeof result === "object" && result?.type === "wait") {
    if (typeof result.seconds === "number") {
      const unit = result.seconds === 1 ? "second" : "seconds";
      return `Please wait ${result.seconds} ${unit} before resending.`;
    }
    return CONFIRM_EMAIL_COPY.waitHour;
  }
  return undefined;
}
