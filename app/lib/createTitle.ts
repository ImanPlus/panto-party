const APP_NAME = "Panto Party";

export function createTitle(pageTitle?: string) {
  return pageTitle ? `${APP_NAME} | ${pageTitle}` : APP_NAME;
}