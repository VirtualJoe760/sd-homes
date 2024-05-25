import '@/assets/styles/globals.css';

export const metadata = {
    title: 'San Diego Homes | Find your home',
    description: 'Find your dream rental in sunny San Diego.',
    keywords: 'rental, find rentals, san diego rentals, san diego homes',
}


const MainLayout = ({children}) => {
  return (
    <html lang="en">
      <body>
        <div>{children}</div>
      </body>
    </html>
  );
};

export default MainLayout;
