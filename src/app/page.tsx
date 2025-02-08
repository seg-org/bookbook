import Link from "next/link";

export default function Home() {
  return (
    <main>
      <div>hi</div>
      <h1>Pages list</h1>
      <ul style={{ listStyleType: "circle"}}>
        <li>
          <Link href="/searchPage" style={{ color: "blue", textDecoration: "underline" }}>
            searchPage
          </Link>
        </li>
        <li>
          <Link href="/sellBook" style={{ color: "blue", textDecoration: "underline" }}>
          sellBook
          </Link>
        </li>
      </ul>
    </main>
  );
}
