import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Input from "./Input";

export default function PasswordInput({ showLabel = "Show password", hideLabel = "Hide password", ...props }) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="auth-password-field">
      <Input {...props} type={visible ? "text" : "password"} inputClassName="auth-password-field__input" />
      <button
        type="button"
        className="auth-password-field__toggle"
        onClick={() => setVisible((value) => !value)}
        aria-label={visible ? hideLabel : showLabel}
        aria-pressed={visible}
      >
        {visible ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
      </button>
    </div>
  );
}
