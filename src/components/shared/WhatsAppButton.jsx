import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import { ORGANIZATION } from '../../lib/seo';
import './WhatsAppButton.css';

export const WHATSAPP_NUMBER = ORGANIZATION.whatsappNumber;
export const DEFAULT_WHATSAPP_MESSAGE =
  "Hi, I'm interested in UrbanEdge Living Space properties.";

export function buildWhatsAppHref(message = DEFAULT_WHATSAPP_MESSAGE, number = WHATSAPP_NUMBER) {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

function WhatsAppButton({
  variant = 'floating',
  message = DEFAULT_WHATSAPP_MESSAGE,
  number = WHATSAPP_NUMBER,
  label = 'WhatsApp Us',
  className = '',
  ...rest
}) {
  const href = buildWhatsAppHref(message, number);
  const showLabel = variant !== 'floating';

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`wa-btn wa-btn--${variant} ${className}`}
      aria-label={
        showLabel
          ? undefined
          : 'Chat with UrbanEdge Living Space on WhatsApp (opens in a new tab)'
      }
      {...rest}
    >
      <FaWhatsapp className="wa-btn__icon" aria-hidden="true" />
      {showLabel && <span className="wa-btn__label">{label}</span>}
    </a>
  );
}

export default WhatsAppButton;
