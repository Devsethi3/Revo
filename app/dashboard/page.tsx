// app/dashboard/page.tsx
export default async function Page() {
  await new Promise((resolve) => setTimeout(resolve, 10000)); // 3s delay
  return <div>Dashboard page loaded!</div>;
}
