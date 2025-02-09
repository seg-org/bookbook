import Link from "next/link";

export default function Home() {
  return (
    <main>
      <div>hi</div>

      <h1 style={{ color: "lightblue" }}>
        B is cooking searchPage <Link href="/searchPage">click here to see</Link>
      </h1>

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
      </ul>
    </main>
  );
}
