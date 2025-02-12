import Link from "next/link";

export default function Home() {
  return (
    <main>
      <div>hi</div>
      <h1>Pages list</h1>
      <ul style={{ listStyleType: "circle" }}>
        <li>
          <Link href="/searchPage" style={{ color: "blue", textDecoration: "underline" }}>
            searchPage
          </Link>
        </li>
        <li>
          <Link href="/sell-book" style={{ color: "blue", textDecoration: "underline" }}>
            sell-book
          </Link>
        </li>
        <li>
          <Link href="/potential-matches" style={{ color: "blue", textDecoration: "underline" }}>
            potential-matches
          </Link>
        </li>
        <li>
          <Link href="/transaction-initiation" style={{ color: "blue", textDecoration: "underline" }}>
            transaction-initiation
          </Link>
        </li>
      </ul>
    </main>
  );
}
