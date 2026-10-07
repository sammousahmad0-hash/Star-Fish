import { useState, useEffect } from 'react';
import { RestaurantProvider, useRestaurant } from './context/RestaurantContext.js';
import { RoleSelectionScreen } from './components/RoleSelectionScreen.js';
import { Header } from './components/Header.js';
import { Hero } from './components/Hero.js';
import { MenuSection } from './components/MenuSection.js';
import { AboutSection } from './components/AboutSection.js';
import { GallerySection } from './components/GallerySection.js';
import { ReservationSection } from './components/ReservationSection.js';
import { ContactSection } from './components/ContactSection.js';
import { Footer } from './components/Footer.js';
import { CartDrawer } from './components/CartDrawer.js';
import { Toasts } from './components/Toasts.js';
import { ManagerDashboard } from './components/manager/ManagerDashboard.js';

function MainApp() {
  const { currentView, setCurrentView, isManagerAuthenticated } = useRestaurant();
  const [activeSection, setActiveSection] = useState('hero');
  const [cartOpen, setCartOpen] = useState(false);

  // Smooth scroll handler
  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Section observer to update active header link while scrolling
  useEffect(() => {
    if (currentView !== 'client') return;

    const sections = ['hero', 'menu', 'about', 'gallery', 'reservation', 'contact'];
    const handleScroll = () => {
      const scrollY = window.scrollY + 200;
      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollY >= top && scrollY < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentView]);

  // If Manager view is requested but user is not authenticated, fallback to role selection
  if (currentView === 'manager' && !isManagerAuthenticated) {
    setCurrentView('role-selection');
    return <RoleSelectionScreen />;
  }

  // 1. First Screen: Role Selection
  if (currentView === 'role-selection') {
    return <RoleSelectionScreen />;
  }

  // 2. Manager Section
  if (currentView === 'manager') {
    return <ManagerDashboard />;
  }

  // 3. Client Section
  return (
    <div className="min-h-screen bg-[#050C17] text-[#E2E8F0] flex flex-col">
      <Header
        onOpenCart={() => setCartOpen(true)}
        activeSection={activeSection}
        onNavigate={scrollToSection}
      />

      <main className="flex-1">
        <Hero onNavigate={scrollToSection} />
        <MenuSection />
        <AboutSection />
        <GallerySection />
        <ReservationSection />
        <ContactSection />
      </main>

      <Footer onNavigate={scrollToSection} />

      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        onGoToReservation={() => scrollToSection('reservation')}
      />
    </div>
  );
}

export default function App() {
  return (
    <RestaurantProvider>
      <MainApp />
      <Toasts />
    </RestaurantProvider>
  );
}
