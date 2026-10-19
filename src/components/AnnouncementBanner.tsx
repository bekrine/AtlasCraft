import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { Language, Currency } from '../types/ecommerce';
import { X, Globe } from 'lucide-react';

export const AnnouncementBanner: React.FC = () => {
  const { language, setLanguage, currency, setCurrency, storeSettings, t } = useShop();
  const [dismissed, setDismissed] = useState(false);

  if (dismissed || !storeSettings.announcementActive) return null;

  const notice = storeSettings.announcementNotice[language] || storeSettings.announcementNotice.fr;

  return (
    <aside
      aria-label="Store announcement"
      className="bg-neutral-900 text-neutral-200 text-xs py-2 px-4 border-b border-neutral-800"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Notice text */}
        <p className="truncate text-center flex-1 font-medium tracking-wide">
          {notice}
        </p>

        {/* Quick Language & Currency Switchers */}
        <div className="flex items-center gap-3 shrink-0 text-xs">
          {/* Language Selector */}
          <div className="flex items-center gap-1.5 border-r border-neutral-700 pr-3 rtl:border-l rtl:border-r-0 rtl:pl-3 rtl:pr-0">
            <Globe className="w-3.5 h-3.5 text-neutral-400" />
            <button
              onClick={() => setLanguage('fr')}
              className={`px-1 hover:text-white transition-colors ${language === 'fr' ? 'font-bold text-amber-400' : 'text-neutral-400'}`}
              title="Français"
            >
              FR
            </button>
            <span className="text-neutral-600" aria-hidden="true">·</span>
            <button
              onClick={() => setLanguage('ar')}
              className={`px-1 hover:text-white transition-colors ${language === 'ar' ? 'font-bold text-amber-400 font-arabic' : 'text-neutral-400'}`}
              title="العربية"
            >
              عربي
            </button>
            <span className="text-neutral-600" aria-hidden="true">·</span>
            <button
              onClick={() => setLanguage('en')}
              className={`px-1 hover:text-white transition-colors ${language === 'en' ? 'font-bold text-amber-400' : 'text-neutral-400'}`}
              title="English"
            >
              EN
            </button>
          </div>

          {/* Currency Selector */}
          <div className="flex items-center gap-1">
            {(['MAD', 'EUR', 'USD'] as Currency[]).map((c) => (
              <button
                key={c}
                onClick={() => setCurrency(c)}
                className={`px-1.5 py-0.5 rounded text-[11px] transition-colors ${
                  currency === c
                    ? 'bg-neutral-800 text-amber-300 font-semibold'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Dismiss */}
          <button
            onClick={() => setDismissed(true)}
            aria-label="Dismiss banner"
            className="text-neutral-400 hover:text-white transition-colors pl-2 rtl:pr-2 rtl:pl-0"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
};
