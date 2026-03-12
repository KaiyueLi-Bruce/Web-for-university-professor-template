import { useEffect, useState } from 'react';
import type { NavItem } from '../types/content';

interface NavbarProps {
  navItems: NavItem[];
  labName: string;
  labSubtitle: string;
}

export function Navbar({ navItems, labName, labSubtitle }: NavbarProps) {
  const [active, setActive] = useState(navItems[0]?.id ?? 'home');
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!navItems.length) return;
    setActive((prev) => (navItems.some((item) => item.id === prev) ? prev : navItems[0].id));
  }, [navItems]);

  useEffect(() => {
    const sections = navItems
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (!sections.length) return;

    const updateActiveByScroll = () => {
      const marker = 96;
      let currentId = sections[0].id;

      for (const section of sections) {
        if (section.getBoundingClientRect().top - marker <= 0) {
          currentId = section.id;
        } else {
          break;
        }
      }

      setActive(currentId);
    };

    updateActiveByScroll();
    window.addEventListener('scroll', updateActiveByScroll, { passive: true });
    window.addEventListener('resize', updateActiveByScroll);

    return () => {
      window.removeEventListener('scroll', updateActiveByScroll);
      window.removeEventListener('resize', updateActiveByScroll);
    };
  }, [navItems]);

  const handleNavClick = (id: string) => {
    setActive(id);
    setMenuOpen(false);
    const scrollToSection = () => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setTimeout(scrollToSection, 150);
    } else {
      scrollToSection();
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-teal-600 border-b border-teal-700/50">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:py-3.5">
        <div className="flex min-w-0 flex-1 items-baseline gap-2 md:flex-initial">
          <span className="font-display truncate text-base font-semibold tracking-tight text-white sm:text-lg md:text-xl">
            {labName}
          </span>
          <span className="shrink-0 text-xs font-medium text-teal-100">
            {labSubtitle}
          </span>
        </div>

        <div className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleNavClick(item.id)}
              className={`
                rounded-md px-3 py-2 text-sm font-medium text-white transition-colors duration-200
                hover:bg-teal-700
                ${active === item.id ? 'bg-teal-700' : ''}
              `}
            >
              {item.label}
            </button>
          ))}
        </div>

        <button
          type="button"
          className="inline-flex flex-col justify-center gap-1.5 rounded-md p-2 text-white transition hover:bg-teal-700 md:hidden"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? '关闭菜单' : '打开菜单'}
          aria-expanded={menuOpen}
        >
          <span
            className={`block h-0.5 w-6 rounded-full bg-white transition-all duration-200 ${
              menuOpen ? 'translate-y-2 rotate-45' : ''
            }`}
          />
          <span
            className={`block h-0.5 w-6 rounded-full bg-white transition-opacity duration-200 ${
              menuOpen ? 'opacity-0' : 'opacity-100'
            }`}
          />
          <span
            className={`block h-0.5 w-6 rounded-full bg-white transition-all duration-200 ${
              menuOpen ? '-translate-y-2 -rotate-45' : ''
            }`}
          />
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-teal-700/50 bg-teal-600 px-4 py-3 md:hidden">
          <div className="flex flex-col gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                className={`
                  w-full rounded-md px-3 py-2.5 text-left text-sm font-medium text-white transition-colors duration-200
                  hover:bg-teal-700 active:bg-teal-700
                  ${active === item.id ? 'bg-teal-700' : ''}
                `}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
