const OPT_OUT_KEY = "leviata.analytics.optOut";
export const PRIVACY_EVENT = "leviata:analytics-privacy";

export function analyticsOptedOut(): boolean {
  try {
    return localStorage.getItem(OPT_OUT_KEY) === "true";
  } catch {
    return true;
  }
}
export function privacySignal(): boolean {
  return (
    navigator.doNotTrack === "1" ||
    (navigator as Navigator & { globalPrivacyControl?: boolean })
      .globalPrivacyControl === true
  );
}
export function setAnalyticsOptOut(value: boolean): boolean {
  try {
    localStorage.setItem(OPT_OUT_KEY, String(value));
    window.dispatchEvent(new Event(PRIVACY_EVENT));
    return true;
  } catch {
    return false;
  }
}
