import '@/assets/styles/globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/footer';

export const metadata = {
    title: 'San Diego Homes | Find your home',
    description: 'Find your dream rental in sunny San Diego.',
    keywords: 'rental, find rentals, san diego rentals, san diego homes',
}


const MainLayout = ({children}) => {
  return (
    <html lang="en">
      <body>
      <Navbar />
        <main>{children}</main>
      <Footer />
      </body>
    </html>
  );
};

export default MainLayout;
