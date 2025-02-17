import { getApiDocs } from "@/lib/swagger";
import { notFound } from "next/navigation";
import ReactSwagger from "./ReactSwagger";

export default async function IndexPage() {
  const spec = await getApiDocs();

  if (process.env.NODE_ENV !== "development") notFound();

  return (
    <section className="container">
      <ReactSwagger spec={spec} />
    </section>
  );
}
