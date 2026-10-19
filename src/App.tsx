import React from 'react';
import { ShopProvider, useShop } from './context/ShopContext';
import { AnnouncementBanner } from './components/AnnouncementBanner';
import { Navbar } from './components/Navbar';
import { CartDrawer } from './components/CartDrawer';
import { Footer } from './components/Footer';

// Pages
import { HomePage } from './pages/HomePage';
import { CatalogPage } from './pages/CatalogPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderSuccessPage } from './pages/OrderSuccessPage';
import { CustomerAccountPage } from './pages/CustomerAccountPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { EditorialGuidesPage } from './pages/EditorialGuidesPage';
import { InfoPages } from './pages/InfoPages';

const AppRouter: React.FC = () => {
  const { currentRoute } = useShop();

  let pageContent = <HomePage />;

  if (currentRoute === '/') {
    pageContent = <HomePage />;
  } else if (currentRoute === '/catalog') {
    pageContent = <CatalogPage />;
  } else if (currentRoute.startsWith('/product/')) {
    const slug = currentRoute.replace('/product/', '');
    pageContent = <ProductDetailPage slug={slug} />;
  } else if (currentRoute === '/checkout') {
    pageContent = <CheckoutPage />;
  } else if (currentRoute.startsWith('/order-success/')) {
    const orderNumber = currentRoute.replace('/order-success/', '');
    pageContent = <OrderSuccessPage orderNumber={orderNumber} />;
  } else if (currentRoute === '/account') {
    pageContent = <CustomerAccountPage />;
  } else if (currentRoute === '/admin') {
    pageContent = <AdminDashboardPage />;
  } else if (currentRoute === '/guides') {
    pageContent = <EditorialGuidesPage />;
  } else if (currentRoute === '/about') {
    pageContent = <InfoPages page="about" />;
  } else if (currentRoute === '/contact') {
    pageContent = <InfoPages page="contact" />;
  } else if (currentRoute === '/faq') {
    pageContent = <InfoPages page="faq" />;
  } else if (currentRoute === '/info/shipping') {
    pageContent = <InfoPages page="shipping" />;
  } else if (currentRoute === '/info/returns') {
    pageContent = <InfoPages page="returns" />;
  } else if (currentRoute === '/info/terms') {
    pageContent = <InfoPages page="terms" />;
  } else if (currentRoute === '/info/privacy') {
    pageContent = <InfoPages page="privacy" />;
  } else if (currentRoute === '/info/digital-license') {
    pageContent = <InfoPages page="digital-license" />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#faf9f6] text-neutral-900 selection:bg-amber-100 selection:text-amber-900">
      <AnnouncementBanner />
      <Navbar />
      <main className="flex-1">{pageContent}</main>
      <CartDrawer />
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <ShopProvider>
      <AppRouter />
    </ShopProvider>
  );
}
