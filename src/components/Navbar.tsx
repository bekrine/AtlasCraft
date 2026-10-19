import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { ShoppingBag, User as UserIcon, Search, Menu, X, ShieldCheck } from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    t,
    currentRoute,
    navigate,
    cartItemCount,
    setIsCartOpen,
    user,
    setSearchQuery,
    searchQuery,
  } = useShop();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const handleNavClick = (route: string) => {
    navigate(route);
    setMobileMenuOpen(false);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate('/catalog');
      setSearchOpen(false);
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#faf9f6]/95 backdrop-blur-md border-b border-neutral-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-18">
          {/* Zone 1: Single text element wordmark in display face */}
          <button
            onClick={() => handleNavClick('/')}
            className="text-2xl font-serif font-bold tracking-tight text-neutral-900 whitespace-nowrap shrink-0 hover:text-amber-800 transition-colors"
          >
            AtlasCraft
          </button>

          {/* Zone 2: 4-5 clean single-line text navigation links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-neutral-600">
            <button
              onClick={() => handleNavClick('/catalog')}
              className={`hover:text-neutral-900 transition-colors whitespace-nowrap shrink-0 py-1 ${
                currentRoute === '/catalog' ? 'text-neutral-900 font-semibold border-b-2 border-neutral-900' : ''
              }`}
            >
              {t.navCatalog}
            </button>
            <button
              onClick={() => {
                navigate('/catalog');
              }}
              className="hover:text-neutral-900 transition-colors whitespace-nowrap shrink-0 py-1"
            >
              {t.navPhysical}
            </button>
            <button
              onClick={() => {
                navigate('/catalog');
              }}
              className="hover:text-neutral-900 transition-colors whitespace-nowrap shrink-0 py-1"
            >
              {t.navDigital}
            </button>
            <button
              onClick={() => handleNavClick('/guides')}
              className={`hover:text-neutral-900 transition-colors whitespace-nowrap shrink-0 py-1 ${
                currentRoute === '/guides' ? 'text-neutral-900 font-semibold border-b-2 border-neutral-900' : ''
              }`}
            >
              {t.navGuides}
            </button>
            <button
              onClick={() => handleNavClick('/about')}
              className={`hover:text-neutral-900 transition-colors whitespace-nowrap shrink-0 py-1 ${
                currentRoute === '/about' ? 'text-neutral-900 font-semibold border-b-2 border-neutral-900' : ''
              }`}
            >
              {t.navAbout}
            </button>
          </nav>

          {/* Zone 3: Primary Action Cluster */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Search Toggle */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              aria-label="Search"
              className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Account / Admin Trigger */}
            <button
              onClick={() => handleNavClick(user?.role === 'admin' ? '/admin' : '/account')}
              aria-label="Account"
              className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <UserIcon className="w-5 h-5" />
              {user && (
                <span className="hidden lg:inline text-xs font-semibold text-amber-900 truncate max-w-[90px]">
                  {user.role === 'admin' ? 'Admin' : user.name.split(' ')[0]}
                </span>
              )}
            </button>

            {/* Shopping Bag CTA */}
            <button
              onClick={() => setIsCartOpen(true)}
              aria-label="Open Cart"
              className="relative px-3.5 py-2 text-xs font-medium text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap shrink-0"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">{t.cartTitle}</span>
              {cartItemCount > 0 && (
                <span className="bg-amber-500 text-neutral-950 text-[11px] font-bold px-1.5 py-0.2 rounded-full tabular-nums">
                  {cartItemCount}
                </span>
              )}
            </button>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Menu"
              className="md:hidden p-2 text-neutral-600 hover:text-neutral-900 rounded-lg transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Search Bar Drawer/Dropdown */}
        {searchOpen && (
          <form
            onSubmit={handleSearchSubmit}
            className="pb-4 pt-1 animate-fadeIn flex items-center gap-2 border-t border-neutral-200/60"
          >
            <div className="relative flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.searchPlaceholder}
                autoFocus
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-neutral-300 rounded-lg text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-amber-700 rtl:pl-4 rtl:pr-10"
              />
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-3.5 rtl:left-auto rtl:right-3 pointer-events-none" />
            </div>
            <button
              type="submit"
              className="px-4 py-2.5 bg-neutral-900 text-white text-xs font-medium rounded-lg hover:bg-neutral-800 transition-colors whitespace-nowrap shrink-0"
            >
              OK
            </button>
            <button
              type="button"
              onClick={() => {
                setSearchOpen(false);
                setSearchQuery('');
              }}
              className="p-2 text-neutral-400 hover:text-neutral-600"
            >
              <X className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>

      {/* Mobile Menu Flyout */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-neutral-200 px-4 pt-2 pb-6 space-y-3 shadow-lg">
          <button
            onClick={() => handleNavClick('/catalog')}
            className="block w-full text-left rtl:text-right py-2 text-sm font-medium text-neutral-800 hover:text-amber-800"
          >
            {t.navCatalog}
          </button>
          <button
            onClick={() => handleNavClick('/guides')}
            className="block w-full text-left rtl:text-right py-2 text-sm font-medium text-neutral-800 hover:text-amber-800"
          >
            {t.navGuides}
          </button>
          <button
            onClick={() => handleNavClick('/about')}
            className="block w-full text-left rtl:text-right py-2 text-sm font-medium text-neutral-800 hover:text-amber-800"
          >
            {t.navAbout}
          </button>
          <button
            onClick={() => handleNavClick('/contact')}
            className="block w-full text-left rtl:text-right py-2 text-sm font-medium text-neutral-800 hover:text-amber-800"
          >
            {t.navContact}
          </button>
          <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-600">
            <button
              onClick={() => handleNavClick(user?.role === 'admin' ? '/admin' : '/account')}
              className="font-medium text-neutral-900 py-1"
            >
              {user ? (user.role === 'admin' ? t.adminDashboard : t.account) : t.login}
            </button>
            <button
              onClick={() => handleNavClick('/admin')}
              className="text-amber-800 font-medium py-1 flex items-center gap-1"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Admin Portal
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
