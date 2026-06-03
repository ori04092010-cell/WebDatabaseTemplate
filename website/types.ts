export async function send<T>(name: string, ...params: any[]): Promise<T> {
  const res = await fetch("/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, params })
  });

  return await res.json();
}
