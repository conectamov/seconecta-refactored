"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useJourneyOnboarding } from "@/hooks/use-journey-onboarding";

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { startOnboarding } = useJourneyOnboarding();

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="site-header">
      <nav className="site-shell site-header-inner" aria-label="Navegação principal">
        <Link href="/" className="site-brand" aria-label="seConecta, página inicial"><span>se</span>Conecta<i /></Link>
        <div className={`site-nav ${menuOpen ? "is-open" : ""}`}>
          <Link href="/explorar" onClick={closeMenu}>Explorar</Link>
          <Link href="/historias" onClick={closeMenu}>Histórias</Link>
          <Link href="/comunidade" onClick={closeMenu}>Comunidade</Link>
          <Link href="/sobre" onClick={closeMenu}>Sobre</Link>
        </div>
        <button className="site-cta" type="button" onClick={startOnboarding}><span>Começar</span><b aria-hidden="true">&gt;</b></button>
        <button className="site-menu" type="button" onClick={() => setMenuOpen((open) => !open)} aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}>
          {menuOpen ? <X /> : <Menu />}
        </button>
      </nav>
    </header>
  );
}
