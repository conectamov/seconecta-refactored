"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowRight,
  Bookmark,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronRight,
  Clock3,
  Flame,
  Gauge,
  GraduationCap,
  Heart,
  LayoutGrid,
  MapPin,
  Menu,
  MessageCircle,
  Monitor,
  RotateCcw,
  Search,
  Share2,
  SlidersHorizontal,
  Sparkles,
  Star,
  Timer,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import "./opportunities.css";

type Opportunity = {
  id: number;
  title: string;
  organization: string;
  description: string;
  category: string;
  area: string;
  deadline: string;
  deadlineGroup: "Hoje" | "Esta semana" | "Este mês" | "Depois";
  daysLeft: number;
  difficulty: string;
  competition: string;
  location: string;
  format: string;
  time: string;
  level: string;
  language: string;
  fee: string;
  added: number;
  popularity: number;
  accent: "green" | "purple" | "blue" | "orange";
};

const opportunities: Opportunity[] = [
  {
    id: 1,
    title: "Programa de Verão em Inteligência Artificial",
    organization: "Instituto de Computação Aplicada",
    description: "Quatro semanas criando projetos de IA com pesquisadores e estudantes de todo o Brasil.",
    category: "Inteligência Artificial",
    area: "Tecnologia",
    deadline: "21 jul",
    deadlineGroup: "Esta semana",
    daysLeft: 5,
    difficulty: "Intermediário",
    competition: "Alta",
    location: "São Paulo, SP",
    format: "Híbrido",
    time: "6h por semana",
    level: "Ensino médio",
    language: "Português",
    fee: "Gratuito",
    added: 3,
    popularity: 98,
    accent: "purple",
  },
  {
    id: 2,
    title: "Olimpíada Brasileira de Matemática — 2ª fase",
    organization: "OBMEP",
    description: "A maior olimpíada científica do país, com bolsas de iniciação científica para medalhistas.",
    category: "Olimpíadas",
    area: "Matemática",
    deadline: "16 jul",
    deadlineGroup: "Hoje",
    daysLeft: 0,
    difficulty: "Avançado",
    competition: "Alta",
    location: "Brasil",
    format: "Presencial",
    time: "3h de prova",
    level: "Fundamental e médio",
    language: "Português",
    fee: "Gratuito",
    added: 8,
    popularity: 100,
    accent: "orange",
  },
  {
    id: 3,
    title: "Iniciação Científica Júnior em Biotecnologia",
    organization: "Laboratório Horizonte",
    description: "Participe de uma equipe de pesquisa e desenvolva seu primeiro projeto científico com mentoria.",
    category: "Pesquisa",
    area: "Ciências",
    deadline: "31 jul",
    deadlineGroup: "Este mês",
    daysLeft: 15,
    difficulty: "Iniciante",
    competition: "Média",
    location: "Campinas, SP",
    format: "Presencial",
    time: "8h por semana",
    level: "Ensino médio",
    language: "Português",
    fee: "Gratuito",
    added: 1,
    popularity: 91,
    accent: "green",
  },
  {
    id: 4,
    title: "Bolsa Jovens Talentos em Tecnologia",
    organization: "Fundação Pró-Futuro",
    description: "Bolsa integral para formação em programação, produto e carreira durante seis meses.",
    category: "Bolsas",
    area: "Programação",
    deadline: "28 jul",
    deadlineGroup: "Este mês",
    daysLeft: 12,
    difficulty: "Iniciante",
    competition: "Média",
    location: "Brasil",
    format: "Online",
    time: "5h por semana",
    level: "Ensino médio",
    language: "Português",
    fee: "Gratuito",
    added: 5,
    popularity: 95,
    accent: "blue",
  },
  {
    id: 5,
    title: "Desafio Nacional de Soluções Climáticas",
    organization: "Impacta Jovem",
    description: "Transforme uma ideia de impacto ambiental em uma solução apresentada a especialistas.",
    category: "Competições",
    area: "Empreendedorismo",
    deadline: "19 jul",
    deadlineGroup: "Esta semana",
    daysLeft: 3,
    difficulty: "Intermediário",
    competition: "Média",
    location: "Brasil",
    format: "Online",
    time: "4 semanas",
    level: "Ensino médio e superior",
    language: "Português",
    fee: "Gratuito",
    added: 2,
    popularity: 87,
    accent: "green",
  },
  {
    id: 6,
    title: "Summer School de Ciência de Dados",
    organization: "Universidade Atlântica",
    description: "Uma experiência internacional para aprender ciência de dados e conhecer um novo ecossistema.",
    category: "Programas de verão",
    area: "Tecnologia",
    deadline: "10 ago",
    deadlineGroup: "Depois",
    daysLeft: 25,
    difficulty: "Intermediário",
    competition: "Alta",
    location: "Lisboa, Portugal",
    format: "Presencial",
    time: "3 semanas",
    level: "Ensino médio e superior",
    language: "Inglês",
    fee: "Bolsa disponível",
    added: 7,
    popularity: 93,
    accent: "purple",
  },
  {
    id: 7,
    title: "Maratona Brasileira de Programação Júnior",
    organization: "Sociedade Brasileira de Computação",
    description: "Resolva problemas em equipe e conheça estudantes que também amam construir com tecnologia.",
    category: "Competições",
    area: "Programação",
    deadline: "24 jul",
    deadlineGroup: "Este mês",
    daysLeft: 8,
    difficulty: "Intermediário",
    competition: "Alta",
    location: "Brasil",
    format: "Híbrido",
    time: "1 dia",
    level: "Ensino médio",
    language: "Português",
    fee: "Gratuito",
    added: 4,
    popularity: 96,
    accent: "blue",
  },
  {
    id: 8,
    title: "Programa Jovens Empreendedores",
    organization: "Instituto Geração",
    description: "Desenvolva uma ideia do zero com oficinas, mentores e uma comunidade de jovens criadores.",
    category: "Empreendedorismo",
    area: "Empreendedorismo",
    deadline: "18 ago",
    deadlineGroup: "Depois",
    daysLeft: 33,
    difficulty: "Iniciante",
    competition: "Baixa",
    location: "Brasil",
    format: "Online",
    time: "3h por semana",
    level: "Ensino médio",
    language: "Português",
    fee: "Gratuito",
    added: 0,
    popularity: 82,
    accent: "orange",
  },
  {
    id: 9,
    title: "Mentoria para Bolsas Internacionais",
    organization: "Pontes Educação",
    description: "Prepare sua candidatura com estudantes brasileiros que já conquistaram bolsas no exterior.",
    category: "Bolsas",
    area: "Intercâmbios",
    deadline: "30 ago",
    deadlineGroup: "Depois",
    daysLeft: 45,
    difficulty: "Intermediário",
    competition: "Média",
    location: "Global",
    format: "Online",
    time: "2h por semana",
    level: "Ensino médio e superior",
    language: "Português",
    fee: "Gratuito",
    added: 6,
    popularity: 89,
    accent: "purple",
  },
];

const quickInterests = [
  "Programação",
  "Matemática",
  "Ciências",
  "Pesquisa",
  "Bolsas",
  "Programas de verão",
  "Olimpíadas",
  "Competições",
  "Inteligência Artificial",
  "Empreendedorismo",
];

const intents = ["Olimpíadas", "Pesquisa", "Bolsas", "Programação", "Inteligência Artificial", "Outro"];

const categoryShelves = [
  { label: "Em destaque", icon: Flame, tone: "orange", copy: "As oportunidades que estão movimentando a comunidade." },
  { label: "Olimpíadas", icon: Star, tone: "purple", copy: "Desafios para transformar curiosidade em conquistas." },
  { label: "Pesquisa", icon: Sparkles, tone: "green", copy: "Seu primeiro passo para investigar grandes perguntas." },
  { label: "Intercâmbios", icon: MapPin, tone: "blue", copy: "Experiências para ampliar seu mundo e sua rede." },
  { label: "Tecnologia", icon: Monitor, tone: "purple", copy: "Construa projetos, produtos e novas habilidades." },
  { label: "Bolsas", icon: GraduationCap, tone: "green", copy: "Apoio para ir mais longe sem limitar seus planos." },
  { label: "Empreendedorismo", icon: ArrowRight, tone: "orange", copy: "Tire ideias do papel com pessoas que constroem." },
];

function Brand() {
  return (
    <Link href="/" className="explore-brand" aria-label="seConecta — página inicial">
      <span className="explore-brand-mark" aria-hidden="true">
        <span />
        <span />
      </span>
      <span>seConecta</span>
    </Link>
  );
}

function OpportunityCard({
  opportunity,
  saved,
  onSave,
  compact = false,
}: {
  opportunity: Opportunity;
  saved: boolean;
  onSave: (id: number) => void;
  compact?: boolean;
}) {
  return (
    <motion.article
      layout
      className={`opportunity-card opportunity-card--${opportunity.accent} ${compact ? "opportunity-card--compact" : ""}`}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.24 }}
    >
      <div className="opportunity-card-topline">
        <span className="opportunity-category">{opportunity.category}</span>
        <div className="opportunity-actions">
          <button className="icon-button" type="button" aria-label={`Compartilhar ${opportunity.title}`}>
            <Share2 size={17} />
          </button>
          <button
            className={`icon-button ${saved ? "is-saved" : ""}`}
            type="button"
            onClick={() => onSave(opportunity.id)}
            aria-label={saved ? `Remover ${opportunity.title} dos salvos` : `Salvar ${opportunity.title}`}
            aria-pressed={saved}
          >
            <Bookmark size={17} fill={saved ? "currentColor" : "none"} />
          </button>
        </div>
      </div>

      <div>
        <p className="opportunity-org">{opportunity.organization}</p>
        <h3>{opportunity.title}</h3>
        <p className="opportunity-description">{opportunity.description}</p>
      </div>

      {!compact && (
        <div className="opportunity-meta-grid">
          <span><Gauge size={15} /> {opportunity.difficulty}</span>
          <span><Users size={15} /> Concorrência {opportunity.competition.toLowerCase()}</span>
          <span><MapPin size={15} /> {opportunity.location}</span>
          <span><Monitor size={15} /> {opportunity.format}</span>
          <span><Timer size={15} /> {opportunity.time}</span>
          <span><GraduationCap size={15} /> {opportunity.level}</span>
        </div>
      )}

      <div className="opportunity-card-footer">
        <div className={`deadline-pill ${opportunity.daysLeft <= 5 ? "is-urgent" : ""}`}>
          <CalendarDays size={15} />
          <span>{opportunity.daysLeft === 0 ? "Encerra hoje" : `Até ${opportunity.deadline}`}</span>
        </div>
        <button className="card-open-button" type="button" aria-label={`Ver detalhes de ${opportunity.title}`}>
          Ver oportunidade <ArrowRight size={16} />
        </button>
      </div>
    </motion.article>
  );
}

function FilterContent({
  category,
  setCategory,
  onlineOnly,
  setOnlineOnly,
  freeOnly,
  setFreeOnly,
  savedOnly,
  setSavedOnly,
  resetFilters,
}: {
  category: string;
  setCategory: (value: string) => void;
  onlineOnly: boolean;
  setOnlineOnly: (value: boolean) => void;
  freeOnly: boolean;
  setFreeOnly: (value: boolean) => void;
  savedOnly: boolean;
  setSavedOnly: (value: boolean) => void;
  resetFilters: () => void;
}) {
  return (
    <div className="filter-content">
      <div className="filter-heading">
        <span>Filtros</span>
        <button type="button" onClick={resetFilters}><RotateCcw size={14} /> Limpar</button>
      </div>

      <label className="filter-group">
        <span>Categoria</span>
        <div className="select-wrap">
          <select value={category} onChange={(event) => setCategory(event.target.value)}>
            <option value="">Todas as categorias</option>
            {[...new Set(opportunities.map((item) => item.category))].map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
          <ChevronDown size={16} />
        </div>
      </label>

      <div className="filter-group">
        <span>Formato e acesso</span>
        <label className="check-row">
          <input type="checkbox" checked={onlineOnly} onChange={(event) => setOnlineOnly(event.target.checked)} />
          <i><Check size={13} /></i>
          Disponível online
        </label>
        <label className="check-row">
          <input type="checkbox" checked={freeOnly} onChange={(event) => setFreeOnly(event.target.checked)} />
          <i><Check size={13} /></i>
          Gratuito
        </label>
        <label className="check-row">
          <input type="checkbox" checked={savedOnly} onChange={(event) => setSavedOnly(event.target.checked)} />
          <i><Check size={13} /></i>
          Somente salvas
        </label>
      </div>

      {["Nível de ensino", "Área de interesse", "Localização", "Prazo de inscrição", "Duração", "Nível de concorrência", "Idioma"].map((label) => (
        <button className="collapsed-filter" type="button" key={label}>
          {label} <ChevronDown size={16} />
        </button>
      ))}
    </div>
  );
}

export default function OpportunitiesPage() {
  const [query, setQuery] = useState("");
  const [intent, setIntent] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("recommended");
  const [onlineOnly, setOnlineOnly] = useState(false);
  const [freeOnly, setFreeOnly] = useState(false);
  const [savedOnly, setSavedOnly] = useState(false);
  const [saved, setSaved] = useState<number[]>([3]);
  const [visibleCount, setVisibleCount] = useState(6);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const normalizedIntent = intent === "Outro" ? "" : intent;
  const recommended = useMemo(() => {
    if (!normalizedIntent) return [opportunities[0], opportunities[2], opportunities[3]];
    const matching = opportunities.filter((item) =>
      `${item.category} ${item.area}`.toLowerCase().includes(normalizedIntent.toLowerCase()),
    );
    return [...matching, ...opportunities.filter((item) => !matching.includes(item))].slice(0, 3);
  }, [normalizedIntent]);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    const result = opportunities.filter((item) => {
      const searchable = `${item.title} ${item.organization} ${item.category} ${item.area} ${item.description}`.toLowerCase();
      return (
        (!term || searchable.includes(term)) &&
        (!category || item.category === category) &&
        (!onlineOnly || item.format === "Online" || item.format === "Híbrido") &&
        (!freeOnly || item.fee === "Gratuito") &&
        (!savedOnly || saved.includes(item.id))
      );
    });

    return [...result].sort((a, b) => {
      if (sort === "newest") return a.added - b.added;
      if (sort === "deadline") return a.daysLeft - b.daysLeft;
      if (sort === "popular") return b.popularity - a.popularity;
      return (normalizedIntent && `${b.category} ${b.area}`.includes(normalizedIntent) ? 100 : b.popularity) -
        (normalizedIntent && `${a.category} ${a.area}`.includes(normalizedIntent) ? 100 : a.popularity);
    });
  }, [category, freeOnly, normalizedIntent, onlineOnly, query, saved, savedOnly, sort]);

  const toggleSaved = (id: number) => {
    setSaved((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  };

  const chooseInterest = (value: string) => {
    setIntent(value);
    setCategory(quickInterests.includes(value) && opportunities.some((item) => item.category === value) ? value : "");
  };

  const resetFilters = () => {
    setCategory("");
    setOnlineOnly(false);
    setFreeOnly(false);
    setSavedOnly(false);
    setQuery("");
  };

  const savedOpportunities = opportunities.filter((item) => saved.includes(item.id));

  return (
    <main className="opportunities-page">
      <header className="explore-header">
        <div className="explore-shell explore-header-inner">
          <Brand />
          <nav className="explore-nav" aria-label="Navegação principal">
            <Link className="is-active" href="/explorar">Explorar</Link>
            <Link href="/prazos">Prazos</Link>
            <button type="button" onClick={() => setSavedOnly(true)}>Minhas oportunidades</button>
          </nav>
          <div className="explore-header-actions">
            <button className="header-saved" type="button" onClick={() => setSavedOnly(true)}>
              <Bookmark size={17} /> <span>{saved.length}</span>
            </button>
            <button className="profile-button" type="button" aria-label="Abrir perfil">MC</button>
            <button className="mobile-menu" type="button" onClick={() => setMobileNavOpen(!mobileNavOpen)} aria-label="Abrir menu">
              {mobileNavOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
        <AnimatePresence>
          {mobileNavOpen && (
            <motion.nav className="mobile-nav" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
              <Link href="/explorar">Explorar</Link>
              <Link href="/prazos">Prazos</Link>
              <button type="button" onClick={() => setSavedOnly(true)}>Minhas oportunidades</button>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>

      <section className="explore-hero">
        <div className="explore-hero-glow" aria-hidden="true" />
        <div className="explore-shell explore-hero-inner">
          <motion.div initial={false} animate={{ opacity: 1, y: 0 }}>
            <span className="eyebrow"><Sparkles size={15} /> Seu próximo passo começa aqui</span>
            <h1>O que você quer fazer <em>a seguir?</em></h1>
            <p>Encontre oportunidades que combinam com seus interesses, seu momento e seus planos.</p>
          </motion.div>

          <motion.div className="hero-search-wrap" initial={false} animate={{ opacity: 1, scale: 1 }}>
            <Search size={23} />
            <label htmlFor="opportunity-search" className="sr-only">Pesquisar oportunidades</label>
            <input
              id="opportunity-search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Ex.: OBMEP, IA, bolsas, pesquisa..."
              autoComplete="off"
            />
            {query && <button type="button" onClick={() => setQuery("")} aria-label="Limpar pesquisa"><X size={18} /></button>}
            <span className="search-shortcut">⌘ K</span>
          </motion.div>

          <div className="quick-filters" aria-label="Interesses rápidos">
            {quickInterests.map((item) => (
              <button type="button" className={intent === item ? "is-active" : ""} onClick={() => chooseInterest(item)} key={item}>
                {item}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="explore-shell explore-content">
        <AnimatePresence mode="wait">
          {!intent ? (
            <motion.section className="intent-card" key="question" initial={false} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <div>
                <span className="section-kicker">Só uma pergunta</span>
                <h2>O que você procura hoje?</h2>
                <p>Uma escolha basta para começar. Você pode mudar quando quiser.</p>
              </div>
              <div className="intent-options">
                {intents.map((item) => (
                  <button type="button" onClick={() => chooseInterest(item)} key={item}>
                    {item} <ChevronRight size={16} />
                  </button>
                ))}
              </div>
            </motion.section>
          ) : (
            <motion.div className="personalized-notice" key="personalized" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <span><Check size={16} /> Sua página está personalizada para <strong>{intent}</strong>.</span>
              <button type="button" onClick={() => setIntent("")}>Alterar interesse</button>
            </motion.div>
          )}
        </AnimatePresence>

        <section className="recommendation-section section-block" aria-labelledby="recommended-title">
          <div className="section-heading">
            <div>
              <span className="section-kicker"><Sparkles size={14} /> Escolhas para o seu momento</span>
              <h2 id="recommended-title">Recomendado para você</h2>
            </div>
            <button className="text-link" type="button" onClick={() => document.getElementById("all-opportunities")?.scrollIntoView({ behavior: "smooth" })}>
              Ver todas <ArrowRight size={16} />
            </button>
          </div>

          <div className="recommendation-grid">
            {recommended.map((item, index) => (
              <div className="recommendation-wrap" key={item.id}>
                <div className="recommendation-reason">
                  {index === 0 && intent ? <><Sparkles size={14} /> Porque você escolheu {intent}.</> : null}
                  {index === 0 && !intent ? <><Star size={14} /> Popular entre estudantes de tecnologia.</> : null}
                  {index === 1 ? <><Flame size={14} /> Prazo termina em {item.daysLeft || "menos de um"} {item.daysLeft === 1 ? "dia" : "dias"}.</> : null}
                  {index === 2 ? <><Users size={14} /> Estudantes com interesses parecidos salvaram.</> : null}
                </div>
                <OpportunityCard opportunity={item} saved={saved.includes(item.id)} onSave={toggleSaved} compact />
              </div>
            ))}
          </div>
        </section>

        <section className="section-block category-section" aria-labelledby="categories-title">
          <div className="section-heading">
            <div>
              <span className="section-kicker">Explore no seu ritmo</span>
              <h2 id="categories-title">Caminhos que podem combinar com você</h2>
            </div>
            <span className="drag-hint">Arraste para explorar <ArrowRight size={15} /></span>
          </div>
          <div className="category-rail">
            {categoryShelves.map(({ label, icon: Icon, tone, copy }) => (
              <motion.button
                type="button"
                className={`category-card category-card--${tone}`}
                key={label}
                onClick={() => chooseInterest(label === "Em destaque" ? "Outro" : label)}
                whileHover={{ y: -4 }}
              >
                <span className="category-icon"><Icon size={20} /></span>
                <span className="category-count">{label === "Em destaque" ? "Seleção da semana" : `${opportunities.filter((item) => `${item.category} ${item.area}`.includes(label)).length || 12}+ oportunidades`}</span>
                <strong>{label}</strong>
                <small>{copy}</small>
                <span className="category-arrow"><ArrowRight size={17} /></span>
              </motion.button>
            ))}
          </div>
        </section>

        <section className="section-block deadline-section" aria-labelledby="deadline-title">
          <div className="section-heading">
            <div>
              <span className="section-kicker"><Clock3 size={14} /> Para agir no momento certo</span>
              <h2 id="deadline-title">Prazos que merecem sua atenção</h2>
            </div>
            <Link className="text-link" href="/prazos">Ver todos os prazos <ArrowRight size={16} /></Link>
          </div>
          <div className="deadline-grid">
            {[
              { label: "Encerra hoje", icon: Flame, item: opportunities.find((op) => op.deadlineGroup === "Hoje")!, tone: "red" },
              { label: "Esta semana", icon: AlertTriangle, item: opportunities.find((op) => op.deadlineGroup === "Esta semana")!, tone: "yellow" },
              { label: "Este mês", icon: CalendarDays, item: opportunities.find((op) => op.deadlineGroup === "Este mês")!, tone: "green" },
            ].map(({ label, icon: Icon, item, tone }) => (
              <button type="button" className={`deadline-highlight deadline-highlight--${tone}`} key={label}>
                <span className="deadline-highlight-icon"><Icon size={18} /></span>
                <span>
                  <small>{label}</small>
                  <strong>{item.title}</strong>
                  <em>{item.deadline} · {item.organization}</em>
                </span>
                <ChevronRight size={18} />
              </button>
            ))}
          </div>
        </section>

        <section className="section-block feed-section" id="all-opportunities" aria-labelledby="feed-title">
          <div className="section-heading feed-heading">
            <div>
              <span className="section-kicker">Todas as oportunidades</span>
              <h2 id="feed-title">Continue explorando</h2>
              <p>{filtered.length} oportunidades encontradas para você.</p>
            </div>
            <div className="feed-controls">
              <button className="mobile-filter-button" type="button" onClick={() => setFiltersOpen(true)}>
                <SlidersHorizontal size={17} /> Filtros
              </button>
              <label className="sort-control">
                <span>Ordenar por</span>
                <select value={sort} onChange={(event) => setSort(event.target.value)}>
                  <option value="recommended">Mais recomendadas</option>
                  <option value="newest">Mais recentes</option>
                  <option value="deadline">Encerram primeiro</option>
                  <option value="popular">Mais populares</option>
                </select>
                <ChevronDown size={15} />
              </label>
              <span className="grid-view"><LayoutGrid size={18} /></span>
            </div>
          </div>

          <div className="feed-layout">
            <aside className="desktop-filters" aria-label="Filtros de oportunidades">
              <FilterContent
                category={category}
                setCategory={setCategory}
                onlineOnly={onlineOnly}
                setOnlineOnly={setOnlineOnly}
                freeOnly={freeOnly}
                setFreeOnly={setFreeOnly}
                savedOnly={savedOnly}
                setSavedOnly={setSavedOnly}
                resetFilters={resetFilters}
              />
            </aside>

            <div>
              {filtered.length ? (
                <motion.div layout className="feed-grid">
                  <AnimatePresence>
                    {filtered.slice(0, visibleCount).map((item) => (
                      <OpportunityCard key={item.id} opportunity={item} saved={saved.includes(item.id)} onSave={toggleSaved} />
                    ))}
                  </AnimatePresence>
                </motion.div>
              ) : (
                <div className="empty-state">
                  <span><Search size={25} /></span>
                  <h3>Nenhuma oportunidade combina com esses filtros.</h3>
                  <p>Tente ampliar sua busca ou deixe a seConecta encontrar opções parecidas para você.</p>
                  <div>
                    <button type="button" onClick={resetFilters}>Limpar filtros</button>
                    <a href="#whatsapp-personalization"><MessageCircle size={16} /> Receber sugestões</a>
                  </div>
                </div>
              )}
              {visibleCount < filtered.length && (
                <button className="load-more" type="button" onClick={() => setVisibleCount((count) => count + 3)}>
                  Mostrar mais oportunidades <ChevronDown size={17} />
                </button>
              )}
            </div>
          </div>
        </section>

        <section className="section-block saved-section" aria-labelledby="saved-title">
          <div className="section-heading">
            <div>
              <span className="section-kicker"><Bookmark size={14} /> Seu caminho</span>
              <h2 id="saved-title">Minhas oportunidades</h2>
            </div>
            <div className="saved-tabs" role="tablist" aria-label="Status das oportunidades">
              <button className="is-active" type="button" role="tab">Salvas <span>{saved.length}</span></button>
              <button type="button" role="tab">Tenho interesse</button>
              <button type="button" role="tab">Inscrições</button>
              <button type="button" role="tab">Concluídas</button>
            </div>
          </div>
          {savedOpportunities.length ? (
            <div className="saved-list">
              {savedOpportunities.slice(0, 3).map((item) => (
                <div className="saved-row" key={item.id}>
                  <span className={`saved-row-mark saved-row-mark--${item.accent}`}><Bookmark size={17} fill="currentColor" /></span>
                  <span><small>{item.organization}</small><strong>{item.title}</strong></span>
                  <span className="saved-row-deadline"><Clock3 size={15} /> {item.daysLeft === 0 ? "Hoje" : `${item.daysLeft} dias`}</span>
                  <button type="button">Continuar <ArrowRight size={15} /></button>
                </div>
              ))}
            </div>
          ) : (
            <div className="saved-empty"><Heart size={20} /><span><strong>Seu próximo passo pode começar com um favorito.</strong> Salve oportunidades para acompanhar prazos e decidir com calma.</span></div>
          )}
        </section>

        <section className="whatsapp-cta" id="whatsapp-personalization">
          <div className="whatsapp-orbit" aria-hidden="true"><span /><span /><span /></div>
          <div className="whatsapp-copy">
            <span className="whatsapp-kicker"><MessageCircle size={15} /> No WhatsApp, do seu jeito</span>
            <h2>Quer receber oportunidades como essas automaticamente?</h2>
            <p>A seConecta seleciona o que combina com você e avisa antes que o prazo termine.</p>
            <ul>
              <li><Check size={15} /> Recomendações personalizadas</li>
              <li><Check size={15} /> Lembretes de prazos</li>
              <li><Check size={15} /> Um resumo por semana</li>
            </ul>
            <button type="button">Quero receber no WhatsApp <ArrowRight size={17} /></button>
            <small>Gratuito. Sem mensagens desnecessárias.</small>
          </div>
          <div className="whatsapp-preview" aria-label="Exemplo de recomendação no WhatsApp">
            <div className="whatsapp-preview-header">
              <span className="wa-logo">se</span>
              <span><strong>seConecta</strong><small>online</small></span>
            </div>
            <div className="wa-message">
              <span className="wa-spark"><Sparkles size={15} /></span>
              <p>Encontrei uma oportunidade que combina com seu interesse em IA:</p>
              <strong>Programa de Verão em Inteligência Artificial</strong>
              <small>Inscrições até 21 de julho</small>
              <button type="button">Ver oportunidade</button>
            </div>
            <div className="wa-time">Agora</div>
          </div>
        </section>
      </div>

      <footer className="explore-footer">
        <div className="explore-shell">
          <Brand />
          <p>Oportunidades certas. No momento certo.</p>
          <div><Link href="/sobre">Sobre</Link><Link href="/privacidade">Privacidade</Link><Link href="/">Voltar ao início</Link></div>
        </div>
      </footer>

      <AnimatePresence>
        {filtersOpen && (
          <>
            <motion.button className="filter-backdrop" type="button" aria-label="Fechar filtros" onClick={() => setFiltersOpen(false)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
            <motion.aside className="mobile-filter-sheet" initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", damping: 30, stiffness: 300 }}>
              <div className="sheet-handle" />
              <div className="sheet-title"><strong>Refinar oportunidades</strong><button type="button" onClick={() => setFiltersOpen(false)} aria-label="Fechar"><X size={20} /></button></div>
              <FilterContent
                category={category}
                setCategory={setCategory}
                onlineOnly={onlineOnly}
                setOnlineOnly={setOnlineOnly}
                freeOnly={freeOnly}
                setFreeOnly={setFreeOnly}
                savedOnly={savedOnly}
                setSavedOnly={setSavedOnly}
                resetFilters={resetFilters}
              />
              <button className="apply-filters" type="button" onClick={() => setFiltersOpen(false)}>Ver {filtered.length} oportunidades</button>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </main>
  );
}
