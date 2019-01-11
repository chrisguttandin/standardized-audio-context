// This is for sure not enough magic to reliably detect Safari but it is sufficient enough for this use case.
export const isSafari = ({ userAgent }) => (!/Chrome/.test(userAgent) && /Safari/.test(userAgent));
