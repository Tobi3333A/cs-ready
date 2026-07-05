import type { Metadata } from "next";
import { SignupClient } from "./SignupClient";

export const metadata: Metadata = {
  title: "Create your account · CS-Ready",
};

export default function SignupPage() {
  return <SignupClient />;
}
