import { Outlet } from "react-router";
import Footer from "~/components/Footer";
import Header from "~/components/Header";

export default function RootLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex flex-1 justify-center items-center bg-background text-foreground">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
