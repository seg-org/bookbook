export default function Forbidden() {
  return (
    <main className="my-16 flex h-full w-full flex-col items-center">
      <h1 className="mb-2 text-3xl font-bold text-red-500">ไม่มีสิทธิ์เข้าถึง</h1>
      <p className="text-xl text-muted-foreground">คุณไม่มีสิทธิ์ในการเข้าถึงหน้านี้</p>
    </main>
  );
}
