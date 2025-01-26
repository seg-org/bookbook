import Link from "next/link";

export default function Home() {
  return (
    <main>
      <div>hi</div>
      <h1 style={{color:"lightblue"}}>
        B is cooking searchPage <Link href="/searchPage">click here to see</Link>
      </h1>
    </main>
    

  );
}
