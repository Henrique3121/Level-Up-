import { useMemo, useState } from "react";
import {
  Activity,
  Apple,
  ArrowUpRight,
  Award,
  BarChart3,
  BookOpen,
  Brain,
  Check,
  ChevronRight,
  CircleHelp,
  Dumbbell,
  Flame,
  Home as HomeIcon,
  Leaf,
  Menu,
  Moon,
  MoreHorizontal,
  Play,
  Plus,
  ShieldCheck,
  Sparkles,
  Target,
  Trophy,
  UserRound,
  Utensils,
  X,
  Zap,
} from "lucide-react";

type Category = "Físico" | "Intelectual" | "Alimentação" | "Disciplina";
type Mission = { id: number; title: string; detail: string; category: Category; xp: number; icon: typeof Dumbbell; completed: boolean };

const initialMissions: Mission[] = [
  { id: 1, title: "Treino de força", detail: "Sessão de 45 min · Plano A", category: "Físico", xp: 80, icon: Dumbbell, completed: false },
  { id: 2, title: "Estudo focado", detail: "60 min de concentração", category: "Intelectual", xp: 60, icon: Brain, completed: true },
  { id: 3, title: "Refeição equilibrada", detail: "Registrar almoço com foto", category: "Alimentação", xp: 40, icon: Utensils, completed: false },
  { id: 4, title: "Hidratação", detail: "Beber 2,5 L de água", category: "Disciplina", xp: 30, icon: Leaf, completed: false },
];

const navItems = [
  { label: "Visão geral", icon: HomeIcon },
  { label: "Missões", icon: Target },
  { label: "Treinos", icon: Dumbbell },
  { label: "Cardio", icon: Activity },
  { label: "Alimentação", icon: Apple },
  { label: "Estudos", icon: BookOpen },
  { label: "Evolução", icon: BarChart3 },
];

const categoryClass: Record<Category, string> = {
  Físico: "lime",
  Intelectual: "violet",
  Alimentação: "orange",
  Disciplina: "blue",
};

function ProgressBar({ value, color = "lime" }: { value: number; color?: string }) {
  return <div className="progress-track"><div className={`progress-fill ${color}`} style={{ width: `${value}%` }} /></div>;
}

function Donut({ value }: { value: number }) {
  return <div className="donut" style={{ "--progress": `${value * 3.6}deg` } as React.CSSProperties}><div className="donut-inner"><strong>{value}%</strong><span>hoje</span></div></div>;
}

export default function Home() {
  const [active, setActive] = useState("Visão geral");
  const [missions, setMissions] = useState(initialMissions);
  const [showMenu, setShowMenu] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const completed = missions.filter((mission) => mission.completed).length;
  const earnedXp = useMemo(() => missions.filter((mission) => mission.completed).reduce((total, mission) => total + mission.xp, 0), [missions]);
  const xp = 1240 + earnedXp - 60;
  const xpProgress = Math.round((xp / 1500) * 100);

  function toggleMission(id: number) {
    setMissions((current) => current.map((mission) => mission.id === id ? { ...mission, completed: !mission.completed } : mission));
    const mission = missions.find((item) => item.id === id);
    if (mission) setToast(mission.completed ? "Missão reaberta" : `+${mission.xp} XP conquistados`);
    window.setTimeout(() => setToast(null), 2200);
  }

  return (
    <div className="app-shell">
      <aside className={`sidebar ${showMenu ? "open" : ""}`}>
        <div className="brand"><div className="brand-mark"><Zap size={18} fill="currentColor" /></div><span>LEVEL <b>UP</b></span></div>
        <div className="profile-mini"><div className="avatar">PH</div><div><strong>Pedro Henrique</strong><span>Nível 12 · Explorador</span></div><MoreHorizontal size={17} /></div>
        <p className="eyebrow nav-eyebrow">Workspace</p>
        <nav>{navItems.map(({ label, icon: Icon }) => <button key={label} className={active === label ? "nav-item active" : "nav-item"} onClick={() => { setActive(label); setShowMenu(false); }}><Icon size={18} /><span>{label}</span>{label === "Missões" && <em>{missions.filter((m) => !m.completed).length}</em>}</button>)}</nav>
        <div className="sidebar-bottom"><button className="nav-item"><Trophy size={18} /><span>Recompensas</span></button><button className="nav-item"><UserRound size={18} /><span>Perfil</span></button><div className="ai-mini"><div className="ai-orb"><Sparkles size={16} /></div><div><strong>LEVEL AI</strong><span>Seu copiloto pessoal</span></div><ArrowUpRight size={16} /></div></div>
      </aside>

      <main className="main-content">
        <header className="topbar"><button className="mobile-menu" onClick={() => setShowMenu(!showMenu)} aria-label="Abrir menu">{showMenu ? <X /> : <Menu />}</button><div className="breadcrumb"><span>Workspace</span><ChevronRight size={14} /><strong>{active}</strong></div><div className="top-actions"><button className="icon-button" aria-label="Ajuda"><CircleHelp size={18} /></button><button className="icon-button" aria-label="Modo escuro"><Moon size={18} /></button><div className="top-avatar">PH</div></div></header>

        <div className="page-wrap">
          <section className="welcome-row"><div><p className="eyebrow">DOMINGO, 22 NOV 2026</p><h1>Bom dia, Pedro <span>✦</span></h1><p className="subhead">Seu próximo nível começa com o próximo check.</p></div><button className="primary-button" onClick={() => { setActive("Missões"); document.getElementById("missions")?.scrollIntoView({ behavior: "smooth" }); }}><Plus size={18} /> Adicionar atividade</button></section>

          <section className="hero-grid">
            <div className="level-card card"><div className="level-copy"><div className="section-label"><span className="pulse-dot" /> PROGRESSO GERAL</div><div className="level-number"><strong>12</strong><span>NÍVEL<br />ATUAL</span></div><p>Você está a <b>260 XP</b> do nível 13.</p><ProgressBar value={xpProgress} /><div className="xp-label"><span>{xp.toLocaleString("pt-BR")} XP</span><span>1.500 XP</span></div></div><div className="level-ring"><div className="ring-glow" /><div className="ring-content"><Zap size={22} fill="currentColor" /><span>LEVEL</span></div></div></div>
            <div className="streak-card card"><div className="card-header"><div><div className="section-label">CONSISTÊNCIA</div><h2><Flame size={25} fill="currentColor" /> 18 <small>dias</small></h2></div><span className="trend">+4 <ArrowUpRight size={14} /></span></div><p className="muted">Seu melhor streak: <b>24 dias</b></p><div className="week-dots"><span className="done">S</span><span className="done">T</span><span className="done">Q</span><span className="done">Q</span><span className="done">S</span><span className="today">S</span><span>D</span></div><div className="streak-foot"><span>Meta do mês</span><b>24 / 30 dias</b></div><ProgressBar value={80} color="orange" /></div>
            <div className="today-card card"><div className="card-header"><div><div className="section-label">MISSÕES DE HOJE</div><h2>{completed}<small> / {missions.length} concluídas</small></h2></div><Donut value={Math.round((completed / missions.length) * 100)} /></div><div className="today-list">{missions.slice(0, 3).map((mission) => <div className="mini-task" key={mission.id}><span className={`task-check ${mission.completed ? "checked" : ""}`}>{mission.completed && <Check size={13} />}</span><span>{mission.title}</span><b>+{mission.xp}</b></div>)}</div></div>
          </section>

          <section className="content-grid"><div className="main-column"><div className="section-heading"><div><p className="eyebrow">SEU FOCO DE HOJE</p><h2>Missões diárias <span className="count-badge">{missions.length - completed} restantes</span></h2></div><button className="text-button" onClick={() => setActive("Missões")}>Ver todas <ArrowUpRight size={15} /></button></div><div className="mission-list" id="missions">{missions.map((mission) => { const Icon = mission.icon; return <button className={`mission-row ${mission.completed ? "is-complete" : ""}`} key={mission.id} onClick={() => toggleMission(mission.id)}><span className={`mission-icon ${categoryClass[mission.category]}`}><Icon size={20} /></span><span className="mission-info"><strong>{mission.title}</strong><small>{mission.detail}</small></span><span className="mission-category">{mission.category}</span><span className="mission-xp">+{mission.xp} XP</span><span className={`round-check ${mission.completed ? "checked" : ""}`}>{mission.completed && <Check size={15} />}</span></button>; })}</div>
            <div className="section-heading evolution-heading"><div><p className="eyebrow">VISÃO DE EVOLUÇÃO</p><h2>Áreas em movimento</h2></div><button className="icon-button"><MoreHorizontal size={18} /></button></div><div className="area-grid"><div className="area-card"><span className="area-icon lime"><Dumbbell size={18} /></span><div><strong>Físico</strong><small>Treinos & cardio</small></div><b>72%</b><ProgressBar value={72} /></div><div className="area-card"><span className="area-icon violet"><Brain size={18} /></span><div><strong>Intelectual</strong><small>Estudos & foco</small></div><b>64%</b><ProgressBar value={64} color="violet" /></div><div className="area-card"><span className="area-icon orange"><Apple size={18} /></span><div><strong>Alimentar</strong><small>Nutrição & energia</small></div><b>48%</b><ProgressBar value={48} color="orange" /></div></div></div>
            <aside className="side-column"><div className="side-heading"><p className="eyebrow">CONQUISTAS</p><button className="text-button">Ver todas</button></div><div className="achievements card"><div className="achievement"><span className="medal gold"><Award size={19} /></span><div><strong>Primeira semana</strong><small>7 dias de consistência</small></div><Check size={16} className="achievement-check" /></div><div className="achievement"><span className="medal blue"><ShieldCheck size={19} /></span><div><strong>Foco total</strong><small>5 sessões de estudo</small></div><Check size={16} className="achievement-check" /></div><div className="achievement locked"><span className="medal gray"><Trophy size={19} /></span><div><strong>Modo imparável</strong><small>30 dias de consistência</small></div><span className="lock-label">12 dias</span></div></div><div className="ai-card"><div className="ai-card-top"><div className="ai-orb"><Sparkles size={17} /></div><span>LEVEL AI <em>DEMO</em></span></div><h3>Uma pequena melhoria para hoje</h3><p>Você tem mantido um bom ritmo nos estudos. Que tal registrar seu treino antes do almoço?</p><button onClick={() => setToast("LEVEL AI será conectado em breve")}>Conversar com LEVEL AI <ArrowUpRight size={15} /></button><small className="demo-note">Demonstração — recomendações reais ainda não estão conectadas.</small></div><div className="reward-card"><div><p className="eyebrow">PRÓXIMA RECOMPENSA</p><h3>Kit de organização</h3><span>1.000 XP <ArrowUpRight size={14} /></span></div><div className="reward-icon"><Trophy size={25} /></div></div></aside></section>
        </div>
      </main>
      <nav className="bottom-nav">{navItems.slice(0, 5).map(({ label, icon: Icon }) => <button key={label} className={active === label ? "active" : ""} onClick={() => setActive(label)}><Icon size={19} /><span>{label === "Visão geral" ? "Início" : label}</span></button>)}</nav>
      {toast && <div className="toast"><Check size={16} /> {toast}</div>}
    </div>
  );
}
