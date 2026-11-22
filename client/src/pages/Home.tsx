import { useEffect, useMemo, useState } from "react";
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
import { startLogin } from "@/const";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { useTheme } from "@/contexts/ThemeContext";

type Category = "Físico" | "Intelectual" | "Alimentação" | "Disciplina";
type Mission = { id: number; title: string; detail: string; category: Category; xp: number; icon: typeof Dumbbell; completed: boolean };

const initialMissions: Mission[] = [
  { id: 1, title: "Treino de força", detail: "Sessão de 45 min · Plano A", category: "Físico", xp: 80, icon: Dumbbell, completed: false },
  { id: 2, title: "Estudo focado", detail: "60 min de concentração", category: "Intelectual", xp: 60, icon: Brain, completed: false },
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
const sectionPaths: Record<string, string> = { "Visão geral": "/", "Missões": "/missoes", "Treinos": "/treinos", Cardio: "/cardio", "Alimentação": "/alimentacao", Estudos: "/estudos", "Evolução": "/evolucao" };

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
  const { user, loading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const { toggleTheme } = useTheme();
  const utils = trpc.useUtils();
  const progressQuery = trpc.progress.dashboard.useQuery(undefined, { enabled: isAuthenticated, retry: false });
  const ensureToday = trpc.progress.ensureToday.useMutation({ onSuccess: () => utils.progress.dashboard.invalidate() });
  const completeMission = trpc.missions.complete.useMutation({ onSuccess: () => utils.progress.dashboard.invalidate() });
  const askAi = trpc.levelAi.ask.useMutation({ onSuccess: ({ text }) => setToast(text), onError: () => setToast("Não foi possível falar com o LEVEL AI agora.") });
  const [active, setActive] = useState("Visão geral");
  const [missions, setMissions] = useState(initialMissions);
  const [showMenu, setShowMenu] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const completed = missions.filter((mission) => mission.completed).length;
  const earnedXp = useMemo(() => missions.filter((mission) => mission.completed).reduce((total, mission) => total + mission.xp, 0), [missions]);
  const xp = progressQuery.data?.profile.xpTotal ?? 0;
  const xpProgress = Math.round((xp / 1500) * 100);

  useEffect(() => {
    if (isAuthenticated && !ensureToday.isPending && !progressQuery.data) ensureToday.mutate();
  }, [isAuthenticated, progressQuery.data, ensureToday.isPending]);

  useEffect(() => {
    const remote = progressQuery.data?.missions;
    if (!remote?.length) return;
    const iconByCategory = { physical: Dumbbell, intellectual: Brain, nutrition: Utensils, discipline: Leaf } as const;
    const labelByCategory = { physical: "Físico", intellectual: "Intelectual", nutrition: "Alimentação", discipline: "Disciplina" } as const;
    setMissions(remote.map((mission) => ({ id: mission.id, title: mission.title, detail: mission.hint ?? "Missão diária", category: labelByCategory[mission.category], xp: mission.xp, icon: iconByCategory[mission.category], completed: mission.status === "approved" })));
  }, [progressQuery.data]);

  function toggleMission(id: number) {
    const mission = missions.find((item) => item.id === id);
    if (!mission || mission.completed) return;
    completeMission.mutate({ missionId: id }, { onSuccess: () => setToast(`+${mission.xp} XP conquistados`), onError: (error) => setToast(error.message) });
    window.setTimeout(() => setToast(null), 2200);
  }

  if (loading) return <div className="auth-screen"><div className="brand"><div className="brand-mark"><Zap size={18} fill="currentColor" /></div><span>LEVEL <b>UP</b></span></div><p>Carregando seu nível...</p></div>;
  if (!isAuthenticated) return <div className="auth-screen"><div className="brand"><div className="brand-mark"><Zap size={18} fill="currentColor" /></div><span>LEVEL <b>UP</b></span></div><h1>Your life. Your level. Your evolution.</h1><p>Entre para salvar suas missões, XP, streak e evolução em todos os dispositivos.</p><button className="primary-button" onClick={() => startLogin()}>Entrar com Manus <ArrowUpRight size={16} /></button></div>;

  return (
    <div className="app-shell">
      <aside className={`sidebar ${showMenu ? "open" : ""}`}>
        <div className="brand"><div className="brand-mark"><Zap size={18} fill="currentColor" /></div><span>LEVEL <b>UP</b></span></div>
        <div className="profile-mini"><div className="avatar">{(user?.name ?? "LU").slice(0, 2).toUpperCase()}</div><div><strong>{user?.name ?? "Explorador"}</strong><span>Nível {Math.max(1, Math.floor(Math.sqrt(xp / 100)))} · Explorador</span></div></div>
        <p className="eyebrow nav-eyebrow">Workspace</p>
        <nav>{navItems.map(({ label, icon: Icon }) => <button key={label} className={active === label ? "nav-item active" : "nav-item"} onClick={() => { setActive(label); setShowMenu(false); setLocation(sectionPaths[label]); }}><Icon size={18} /><span>{label}</span>{label === "Missões" && <em>{missions.filter((m) => !m.completed).length}</em>}</button>)}</nav>
        <div className="sidebar-bottom"><button className="nav-item" onClick={() => setLocation("/recompensas")}><Trophy size={18} /><span>Recompensas</span></button><button className="nav-item" onClick={() => setLocation("/perfil")}><UserRound size={18} /><span>Perfil</span></button><div className="ai-mini"><div className="ai-orb"><Sparkles size={16} /></div><div><strong>LEVEL AI</strong><span>Seu copiloto pessoal</span></div><ArrowUpRight size={16} /></div></div>
      </aside>

      <main className="main-content">
        <header className="topbar"><button className="mobile-menu" onClick={() => setShowMenu(!showMenu)} aria-label="Abrir menu">{showMenu ? <X /> : <Menu />}</button><div className="breadcrumb"><span>Workspace</span><ChevronRight size={14} /><strong>{active}</strong></div><div className="top-actions"><button className="icon-button" aria-label="Ajuda" onClick={() => setToast("Use o menu lateral para abrir cada área. Conclua missões para gerar XP.")}><CircleHelp size={18} /></button><button className="icon-button" aria-label="Alternar tema" onClick={() => toggleTheme?.()}><Moon size={18} /></button><div className="top-avatar">{(user?.name ?? "LU").slice(0, 2).toUpperCase()}</div></div></header>

        <div className="page-wrap">
          <section className="welcome-row"><div><p className="eyebrow">DOMINGO, 22 NOV 2026</p><h1>Bom dia, {(user?.name ?? "explorador").split(" ")[0]} <span>✦</span></h1><p className="subhead">Seu próximo nível começa com o próximo check.</p></div><button className="primary-button" onClick={() => { setActive("Missões"); document.getElementById("missions")?.scrollIntoView({ behavior: "smooth" }); }}><Plus size={18} /> Adicionar atividade</button></section>

          <section className="hero-grid">
            <div className="level-card card"><div className="level-copy"><div className="section-label"><span className="pulse-dot" /> PROGRESSO GERAL</div><div className="level-number"><strong>{Math.max(1, Math.floor(Math.sqrt(xp / 100)))}</strong><span>NÍVEL<br />ATUAL</span></div><p>Você está a <b>{Math.max(0, 100 - (xp % 100))} XP</b> do próximo nível.</p><ProgressBar value={xpProgress} /><div className="xp-label"><span>{xp.toLocaleString("pt-BR")} XP</span><span>1.500 XP</span></div></div><div className="level-ring" style={{ background: `conic-gradient(var(--lime) 0 ${Math.min(100, xpProgress)}%, #263126 ${Math.min(100, xpProgress)}% 100%)` }}><div className="ring-glow" /><div className="ring-content"><Zap size={22} fill="currentColor" /><span>LEVEL</span></div></div></div>
            <div className="streak-card card"><div className="card-header"><div><div className="section-label">CONSISTÊNCIA</div><h2><Flame size={25} fill="currentColor" /> {progressQuery.data?.streak ?? 0} <small>dias</small></h2></div><span className="trend">+0 <ArrowUpRight size={14} /></span></div><p className="muted">Seu melhor streak será calculado após as primeiras missões.</p><div className="week-dots"><span>S</span><span>T</span><span>Q</span><span>Q</span><span>S</span><span>S</span><span>D</span></div><div className="streak-foot"><span>Meta do mês</span><b>0 / 30 dias</b></div><ProgressBar value={0} color="orange" /></div>
            <div className="today-card card"><div className="card-header"><div><div className="section-label">MISSÕES DE HOJE</div><h2>{completed}<small> / {missions.length} concluídas</small></h2></div><Donut value={Math.round((completed / missions.length) * 100)} /></div><div className="today-list">{missions.slice(0, 3).map((mission) => <div className="mini-task" key={mission.id}><span className={`task-check ${mission.completed ? "checked" : ""}`}>{mission.completed && <Check size={13} />}</span><span>{mission.title}</span><b>+{mission.xp}</b></div>)}</div></div>
          </section>

          <section className="content-grid"><div className="main-column"><div className="section-heading"><div><p className="eyebrow">SEU FOCO DE HOJE</p><h2>Missões diárias <span className="count-badge">{missions.length - completed} restantes</span></h2></div><button className="text-button" onClick={() => setLocation("/missoes")}>Ver todas <ArrowUpRight size={15} /></button></div><div className="mission-list" id="missions">{missions.map((mission) => { const Icon = mission.icon; return <button className={`mission-row ${mission.completed ? "is-complete" : ""}`} key={mission.id} onClick={() => toggleMission(mission.id)}><span className={`mission-icon ${categoryClass[mission.category]}`}><Icon size={20} /></span><span className="mission-info"><strong>{mission.title}</strong><small>{mission.detail}</small></span><span className="mission-category">{mission.category}</span><span className="mission-xp">+{mission.xp} XP</span><span className={`round-check ${mission.completed ? "checked" : ""}`}>{mission.completed && <Check size={15} />}</span></button>; })}</div>
            <div className="section-heading evolution-heading"><div><p className="eyebrow">VISÃO DE EVOLUÇÃO</p><h2>Áreas em movimento</h2></div><button className="icon-button" onClick={() => setLocation("/evolucao")}><MoreHorizontal size={18} /></button></div><div className="area-grid"><div className="area-card"><span className="area-icon lime"><Dumbbell size={18} /></span><div><strong>Físico</strong><small>Treinos & cardio</small></div><b>0%</b><ProgressBar value={0} /></div><div className="area-card"><span className="area-icon violet"><Brain size={18} /></span><div><strong>Intelectual</strong><small>Estudos & foco</small></div><b>0%</b><ProgressBar value={0} color="violet" /></div><div className="area-card"><span className="area-icon orange"><Apple size={18} /></span><div><strong>Alimentar</strong><small>Nutrição & energia</small></div><b>0%</b><ProgressBar value={0} color="orange" /></div></div></div>
            <aside className="side-column"><div className="side-heading"><p className="eyebrow">CONQUISTAS</p><button className="text-button" onClick={() => setLocation("/recompensas")}>Ver todas</button></div><div className="achievements card"><div className="achievement locked"><span className="medal gray"><Award size={19} /></span><div><strong>Primeira semana</strong><small>7 dias de consistência</small></div><span className="lock-label">0 / 7</span></div><div className="achievement locked"><span className="medal gray"><ShieldCheck size={19} /></span><div><strong>Foco total</strong><small>5 sessões de estudo</small></div><span className="lock-label">0 / 5</span></div><div className="achievement locked"><span className="medal gray"><Trophy size={19} /></span><div><strong>Modo imparável</strong><small>30 dias de consistência</small></div><span className="lock-label">0 / 30</span></div></div><div className="ai-card"><div className="ai-card-top"><div className="ai-orb"><Sparkles size={17} /></div><span>LEVEL AI <em>ATIVO</em></span></div><h3>Converse com seu copiloto</h3><p>Faça uma pergunta sobre sua rotina, estudos, treino ou alimentação.</p><button onClick={() => { const message = window.prompt("O que você quer melhorar hoje?"); if (message?.trim()) askAi.mutate({ message }); }}>Conversar com LEVEL AI <ArrowUpRight size={15} /></button><small className="demo-note">As respostas são orientações gerais, não diagnóstico médico.</small></div><div className="reward-card"><div><p className="eyebrow">PRÓXIMA RECOMPENSA</p><h3>Kit de organização</h3><span>1.000 XP <ArrowUpRight size={14} /></span></div><div className="reward-icon"><Trophy size={25} /></div></div></aside></section>
        </div>
      </main>
      <nav className="bottom-nav">{navItems.slice(0, 5).map(({ label, icon: Icon }) => <button key={label} className={active === label ? "active" : ""} onClick={() => { setActive(label); setLocation(sectionPaths[label]); }}><Icon size={19} /><span>{label === "Visão geral" ? "Início" : label}</span></button>)}</nav>
      {toast && <div className="toast"><Check size={16} /> {toast}</div>}
    </div>
  );
}
