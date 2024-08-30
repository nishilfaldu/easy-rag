import NavBar from "../_components/NavBar";




export default function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
        <NavBar/>
        <main>
            {children}
        </main>
        </>
    );
}