// The production Turnstile site key is public but must be replaced before deployment.
export const TURNSTILE_SITE_KEY = import.meta.env.DEV
  ? "1x00000000000000000000AA"
  : "0x4AAAAAAFY8-wqbxMuJfBwP";
