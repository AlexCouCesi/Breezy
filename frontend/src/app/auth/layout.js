import Footer from '@/components/footer';

export default function AuthLayout({ children }) {
    return (
        <html lang="fr">
        <body>
            <main>{children}</main>
            <Footer /> {/* Unique ici aussi */}
        </body>
        </html>
    );
}