/**
 * This helper function is used to fetch data from the backend.
 * It automatically adds the Authorization header with the app instance.
 */
export async function fetchWithWixInstance(
  relativePath: string,
  method: string,
  body?: any
) {
  const res = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/${relativePath}`,
    {
      method,
      headers: {
        Authorization: getAppInstance(),
        ...(body && { "Content-Type": "application/json" }),
      },
      body: body && JSON.stringify(body),
    }
  );

  const json = await res.json();
  return json;
}

/**
 * This helper function retrieves the app instance from the URL.
 */
export function getAppInstance() {
  return new URLSearchParams(window.location.search).get("instance")!;
}
