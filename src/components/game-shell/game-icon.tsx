"use client";

/**
 * GameIcon — registro central de ícones (Lucide) usados pelos jogos,
 * cartas de evidência, opções e HUD. Nome → componente, com fallback.
 * Mantém conteúdo desacoplado de imports diretos.
 */

import {
  AlertTriangle,
  Banknote,
  Beaker,
  BookOpen,
  BookOpenText,
  Briefcase,
  Calculator,
  Calendar,
  Coins,
  Dices,
  Dna,
  Droplet,
  Factory,
  FileText,
  FlaskConical,
  Globe2,
  Handshake,
  History,
  Leaf,
  Lightbulb,
  Link2,
  ListChecks,
  Map,
  MessageCircle,
  Newspaper,
  PawPrint,
  PenLine,
  PiggyBank,
  Rabbit,
  Scale,
  ScrollText,
  Search,
  Share2,
  ShieldCheck,
  Shuffle,
  Snowflake,
  Sun,
  Target,
  TrendingUp,
  User,
  Users,
  Wallet,
  Wheat,
  Zap,
  type LucideIcon,
} from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  // jogos e áreas
  book_open: BookOpen,
  BookOpenText: BookOpenText,
  Calculator: Calculator,
  Dices: Dices,
  Dna: Dna,
  FlaskConical: FlaskConical,
  Globe2: Globe2,
  Map: Map,
  Newspaper: Newspaper,
  PenLine: PenLine,
  Scale: Scale,
  ScrollText: ScrollText,
  TrendingUp: TrendingUp,
  Wallet: Wallet,
  Zap: Zap,

  // evidências e peças
  alerta: AlertTriangle,
  alvo: Target,
  banco: Banknote,
  bequer: Beaker,
  busca: Search,
  calendario: Calendar,
  cedula: Banknote,
  coelho: Rabbit,
  cofre: PiggyBank,
  conversa: MessageCircle,
  dados: Dices,
  documento: FileText,
  elo: Link2,
  escudo: ShieldCheck,
  fabrica: Factory,
  folha: Leaf,
  frasco: FlaskConical,
  gota: Droplet,
  grafico: TrendingUp,
  historia: History,
  lampada: Lightbulb,
  lista: ListChecks,
  maleta: Briefcase,
  mapa: Map,
  moedas: Coins,
  pata: PawPrint,
  porco: PiggyBank,
  rabbit: Rabbit,
  sol: Sun,
  neve: Snowflake,
  tomada: Zap,
  trigo: Wheat,
  usuario: User,
  usuarios: Users,
  embaralhar: Shuffle,
  compartilhar: Share2,
  aperto: Handshake,
};

export function GameIcon({
  name,
  className,
  strokeWidth = 2.2,
}: {
  name: string;
  className?: string;
  strokeWidth?: number;
}) {
  const Icon = ICONS[name] ?? Dices;
  return <Icon className={className} strokeWidth={strokeWidth} aria-hidden />;
}

export function areaIconName(area: string): string {
  switch (area) {
    case "linguagens":
      return "BookOpenText";
    case "matematica":
      return "Calculator";
    case "natureza":
      return "FlaskConical";
    case "humanas":
      return "Globe2";
    default:
      return "Dices";
  }
}
