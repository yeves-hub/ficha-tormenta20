// ═══════════════════════════════════════════════════
// PARTE 1/3 — Constantes, Estilos e Componentes Base
// ═══════════════════════════════════════════════════

import { useState, useEffect, useRef } from "react";

const VERSAO_DADOS_FICHA = 2;

const ATRIBUTOS = ["FOR", "DES", "CON", "INT", "SAB", "CAR"];
const ATRIB_ICONES = { FOR:"⚔️", DES:"🏹", CON:"🛡️", INT:"📚", SAB:"🌿", CAR:"👑" };

const PERICIAS = [
  "Acrobacia","Adestramento","Atletismo","Atuação","Cavalgar",
  "Conhecimento","Cura","Diplomacia","Enganação","Fortitude",
  "Furtividade","Guerra","Iniciativa","Intimidação","Intuição","Investigação",
  "Jogatina","Ladinagem","Luta","Misticismo","Nobreza",
  "Ofício","Percepção","Pilotagem","Pontaria","Reflexos",
  "Religião","Sobrevivência","Vontade"
];

const PERICIAS_ATRIB_PADRAO = {
  Acrobacia:"DES", Adestramento:"SAB", Atletismo:"FOR", Atuação:"CAR",
  Cavalgar:"DES", Conhecimento:"INT", Cura:"SAB", Diplomacia:"CAR",
  Enganação:"CAR", Fortitude:"CON", Furtividade:"DES", Guerra:"INT", Iniciativa:"DES", Intimidação:"CAR", Intuição:"SAB", Investigação:"INT", Jogatina:"CAR", Ladinagem:"DES", Luta:"FOR", Misticismo:"INT", Nobreza:"INT", Ofício:"INT", Percepção:"SAB", Pilotagem:"DES", Pontaria:"DES", Reflexos:"DES", Religião:"SAB", Sobrevivência:"SAB", Vontade:"SAB"
};

function bonusTreinamento(nivel) {
  if (nivel <= 6)  return 2;
  if (nivel <= 14) return 4;
  return 6;
}

const ABAS_BASE = [
  { id:0, label:"Herói",    icon:"🧙" },
  { id:1, label:"Combate",  icon:"⚔️" },
  { id:2, label:"Perícias", icon:"📜" },
  { id:3, label:"Poderes",  icon:"✨" },
  { id:4, label:"Mochila",  icon:"🎒" },
];
const ABA_MAGIAS = { id:5, label:"Magias", icon:"🔮" };

function calcMod(v) { return Math.floor((v - 10) / 2); }
function fmtMod(m)  { return m >= 0 ? `+${m}` : `${m}`; }

function criarAtributosIniciais() {
  return ATRIBUTOS.reduce(
    (resultado, atributo) => ({
      ...resultado,
      [atributo]: 10,
    }),
    {}
  );
}

function criarPericiasIniciais() {
  return PERICIAS.reduce(
    (resultado, pericia) => ({
      ...resultado,
      [pericia]: {
        treinado: false,
        outros: 0,
        atrib: PERICIAS_ATRIB_PADRAO[pericia],
      },
    }),
    {}
  );
}

const CATEGORIAS_PODER = [
  { id:"raca",      label:"Raça",      icone:"🌿", cor:"#4caf7d", corBg:"#1a3a2a" },
  { id:"origem",    label:"Origem",    icone:"🌊", cor:"#4a9fd4", corBg:"#0d2035" },
  { id:"classe",    label:"Classe",    icone:"⚔️", cor:"#e8922a", corBg:"#2a1800" },
  { id:"divindade", label:"Divindade", icone:"✨", cor:"#a06ad4", corBg:"#1e0d35" },
  { id:"geral",     label:"Gerais",    icone:"📖", cor:"#8a8a8a", corBg:"#1a1a1a" },
];

const poderVazio = (categoria = "geral") => ({
  id: Date.now() + Math.random(), nome:"", descricao:"", categoria,
});

const ESCOLAS_MAGIA = [
  "Abjuração","Adivinhação","Convocação","Encantamento",
  "Evocação","Ilusão","Necromancia","Transmutação"
];
const CIRCULOS = [1,2,3,4,5];
const ESCOLA_ICONES = {
  Abjuração:"🛡️", Adivinhação:"🔮", Convocação:"🌀", Encantamento:"💫",
  Evocação:"⚡",  Ilusão:"🪞",      Necromancia:"💀", Transmutação:"⚗️",
};
const ESCOLA_CORES = {
  Abjuração:"#4a9fd4", Adivinhação:"#a06ad4", Convocação:"#4caf7d", Encantamento:"#e8922a",
  Evocação:"#e06060",  Ilusão:"#c8922a",       Necromancia:"#8a8a8a", Transmutação:"#7ec87e",
};

const magiaVazia = () => ({
  id:Date.now()+Math.random(), nome:"", tipo:"Arcana", circulo:1, escola:"Evocação",
  execucao:"", alcance:"", alvo:"", duracao:"", resistencia:"", descricao:"", preparada:false, custoPM:"",
});

const CUSTO_PM_CIRCULO = { 1:1, 2:3, 3:6, 4:10, 5:15 };

function custoMagia(magia) {
  const c = parseInt(magia?.custoPM);
  if (Number.isFinite(c) && c >= 0) return c;
  return CUSTO_PM_CIRCULO[Number(magia?.circulo)] || 1;
}

const CONDICOES = [
  { nome:"Abalado",       icone:"😨", resumo:"–2 em perícias. Se repetir → Apavorado",                          categoria:"Medo",       cor:"#c8922a", descricao:"O personagem sofre –2 em testes de perícia. Se ficar abalado novamente, em vez disso fica apavorado." },
  { nome:"Agarrado",      icone:"🤼", resumo:"Desprevenido, imóvel, –2 ataques, só armas leves",                 categoria:"Movimento",  cor:"#4a9fd4", descricao:"O personagem fica desprevenido e imóvel, sofre –2 em testes de ataque e só pode atacar com armas leves." },
  { nome:"Alquebrado",    icone:"💔", resumo:"+1 PM no custo de todas as habilidades",                           categoria:"Mental",     cor:"#a06ad4", descricao:"O custo em pontos de mana das habilidades do personagem aumenta em +1." },
  { nome:"Apavorado",     icone:"😱", resumo:"–5 em perícias, não pode se aproximar da fonte do medo",           categoria:"Medo",       cor:"#c8922a", descricao:"O personagem sofre –5 em testes de perícia e não pode se aproximar voluntariamente da fonte do medo." },
  { nome:"Atordoado",     icone:"😵", resumo:"Desprevenido, não pode fazer ações",                               categoria:"Mental",     cor:"#a06ad4", descricao:"O personagem fica desprevenido e não pode fazer ações." },
  { nome:"Caído",         icone:"🧎", resumo:"–5 Def CaC, +5 vs distância, –5 atq CaC, deslocamento 1,5m",      categoria:"—",          cor:"#8a8a8a", descricao:"O personagem sofre –5 na Defesa contra ataques corpo a corpo e recebe +5 na Defesa contra ataques à distância." },
  { nome:"Cego",          icone:"🙈", resumo:"Desprevenido, lento, –5 perícias FOR/DES, camuflagem total",       categoria:"Sentidos",   cor:"#e8922a", descricao:"O personagem fica desprevenido e lento, não pode fazer testes de Percepção e sofre –5 em perícias de FOR/DES." },
  { nome:"Confuso",       icone:"🌀", resumo:"Age aleatoriamente — rola 1d6 no início do turno",                 categoria:"Mental",     cor:"#a06ad4", descricao:"Role 1d6: 1) Move aleatório; 2-3) Não age; 4-5) Ataca o mais próximo; 6) Age normalmente." },
  { nome:"Debilitado",    icone:"🤕", resumo:"–5 em FOR/DES/CON e perícias. Se repetir → Inconsciente",          categoria:"—",          cor:"#8a8a8a", descricao:"O personagem sofre –5 em testes de Força, Destreza e Constituição e perícias baseadas nesses atributos." },
  { nome:"Desprevenido",  icone:"🛡️",resumo:"–5 Defesa e Reflexos",                                             categoria:"—",          cor:"#8a8a8a", descricao:"O personagem sofre –5 na Defesa e em Reflexos." },
  { nome:"Doente",        icone:"🤒", resumo:"Sob efeito de uma doença",                                         categoria:"Metabolismo",cor:"#4caf7d", descricao:"O personagem está sob efeito de uma doença." },
  { nome:"Em Chamas",     icone:"🔥", resumo:"1d6 dano de fogo por turno. Ação padrão para apagar",              categoria:"—",          cor:"#e06060", descricao:"No início de seus turnos, sofre 1d6 pontos de dano de fogo. Pode gastar uma ação padrão para apagar." },
  { nome:"Enfeitiçado",   icone:"💫", resumo:"Prestativo à fonte, +10 em Diplomacia para ela",                   categoria:"Mental",     cor:"#a06ad4", descricao:"O personagem se torna prestativo em relação à fonte da condição." },
  { nome:"Enjoado",       icone:"🤢", resumo:"Só 1 ação por rodada (padrão OU movimento)",                       categoria:"Metabolismo",cor:"#4caf7d", descricao:"O personagem só pode realizar uma ação padrão ou de movimento por rodada." },
  { nome:"Enredado",      icone:"🕸️",resumo:"Lento, vulnerável, –2 em ataques",                                 categoria:"Movimento",  cor:"#4a9fd4", descricao:"O personagem fica lento, vulnerável e sofre –2 em testes de ataque." },
  { nome:"Envenenado",    icone:"☠️", resumo:"Efeito varia pelo veneno",                                         categoria:"Veneno",     cor:"#4caf7d", descricao:"O efeito desta condição varia de acordo com o veneno." },
  { nome:"Esmorecido",    icone:"😞", resumo:"–5 em INT/SAB/CAR e perícias",                                     categoria:"Mental",     cor:"#a06ad4", descricao:"O personagem sofre –5 em testes de Inteligência, Sabedoria e Carisma." },
  { nome:"Exausto",       icone:"😩", resumo:"Debilitado + lento + vulnerável. Se repetir → Inconsciente",       categoria:"Cansaço",    cor:"#e8922a", descricao:"O personagem fica debilitado, lento e vulnerável." },
  { nome:"Fascinado",     icone:"👀", resumo:"–5 Percepção, não age, atenção presa em algo",                     categoria:"Mental",     cor:"#a06ad4", descricao:"O personagem sofre –5 em Percepção e não pode fazer ações." },
  { nome:"Fatigado",      icone:"😓", resumo:"Fraco + vulnerável. Se repetir → Exausto",                         categoria:"Cansaço",    cor:"#e8922a", descricao:"O personagem fica fraco e vulnerável. Se ficar fatigado novamente, fica exausto." },
  { nome:"Fraco",         icone:"💪", resumo:"–2 em FOR/DES/CON e perícias. Se repetir → Debilitado",            categoria:"—",          cor:"#8a8a8a", descricao:"O personagem sofre –2 em testes de Força, Destreza e Constituição." },
  { nome:"Frustrado",     icone:"😤", resumo:"–2 em INT/SAB/CAR e perícias. Se repetir → Esmorecido",            categoria:"Mental",     cor:"#a06ad4", descricao:"O personagem sofre –2 em testes de Inteligência, Sabedoria e Carisma." },
  { nome:"Imóvel",        icone:"⛓️",resumo:"Deslocamento reduzido a 0m",                                        categoria:"Movimento",  cor:"#4a9fd4", descricao:"Todas as formas de deslocamento do personagem são reduzidas a 0m." },
  { nome:"Inconsciente",  icone:"💤", resumo:"Indefeso, não age, não faz reações",                               categoria:"—",          cor:"#8a8a8a", descricao:"O personagem fica indefeso e não pode fazer ações, incluindo reações." },
  { nome:"Indefeso",      icone:"🪦", resumo:"Desprevenido, –10 Defesa, falha em Reflexos",                      categoria:"—",          cor:"#e06060", descricao:"O personagem fica desprevenido, sofre –10 na Defesa e falha automaticamente em Reflexos." },
  { nome:"Lento",         icone:"🐢", resumo:"Deslocamento pela metade, não pode correr ou investir",            categoria:"Movimento",  cor:"#4a9fd4", descricao:"Todas as formas de deslocamento são reduzidas à metade. Não pode correr ou fazer investidas." },
  { nome:"Ofuscado",      icone:"🌫️",resumo:"–2 em ataques e Percepção",                                        categoria:"Sentidos",   cor:"#e8922a", descricao:"O personagem sofre –2 em testes de ataque e de Percepção." },
  { nome:"Paralisado",    icone:"🧊", resumo:"Imóvel + indefeso, só ações mentais",                              categoria:"Movimento",  cor:"#4a9fd4", descricao:"Fica imóvel e indefeso e só pode realizar ações puramente mentais." },
  { nome:"Pasmo",         icone:"😶", resumo:"Não pode fazer ações",                                             categoria:"Mental",     cor:"#a06ad4", descricao:"Não pode fazer ações." },
  { nome:"Petrificado",   icone:"🗿", resumo:"Inconsciente + redução de dano 8",                                 categoria:"Metamorfose",cor:"#8a8a8a", descricao:"O personagem fica inconsciente e recebe redução de dano 8." },
  { nome:"Sangrando",     icone:"🩸", resumo:"Teste de CON CD 15 por turno ou perde 1d6 PV",                     categoria:"Metabolismo",cor:"#e06060", descricao:"No início do turno, deve fazer CON CD 15. Se falhar, perde 1d6 PV." },
  { nome:"Sobrecarregado",icone:"🎒", resumo:"–5 penalidade de armadura, –3m deslocamento",                      categoria:"Movimento",  cor:"#4a9fd4", descricao:"O personagem sofre penalidade de armadura –5 e seu deslocamento é reduzido em –3m." },
  { nome:"Surdo",         icone:"🔇", resumo:"Não ouve, –5 Iniciativa",                                          categoria:"Sentidos",   cor:"#e8922a", descricao:"O personagem não pode ouvir e sofre –5 em testes de Iniciativa." },
  { nome:"Surpreendido",  icone:"⚡", resumo:"Desprevenido, não pode agir",                                      categoria:"—",          cor:"#8a8a8a", descricao:"O personagem fica desprevenido e não pode fazer ações." },
  { nome:"Vulnerável",    icone:"🛡️",resumo:"–2 na Defesa",                                                     categoria:"—",          cor:"#8a8a8a", descricao:"O personagem sofre –2 na Defesa." },
];

// ─── ESTILOS ─────────────────────────────────────────────────────────────────

const s = {
  root:       { minHeight:"100vh", height:"100vh", background:"linear-gradient(160deg,#1c0e00 0%,#140a00 50%,#0d0700 100%)", fontFamily:"'IM Fell English',Georgia,serif", color:"#f0d8a0", display:"flex", flexDirection:"column", position:"relative", overflow:"hidden" },
  noiseBg:    { position:"fixed", inset:0, pointerEvents:"none", zIndex:0, backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`, opacity:0.6 },
  topo:       { position:"sticky", top:0, zIndex:20, background:"linear-gradient(180deg,#2e1800,#1c0e00)", borderBottom:"1px solid #8b5e1a", padding:"12px 16px 10px", textAlign:"center", boxShadow:"0 4px 24px #000a" },
  topoTitulo: { fontFamily:"'Cinzel Decorative','Cinzel',serif", fontSize:20, fontWeight:900, letterSpacing:4, color:"#e8a020", textShadow:"0 0 18px #e8a02066,0 2px 4px #000", margin:0 },
  topoSub:    { fontSize:9, letterSpacing:5, color:"#7a5020", marginTop:2, fontFamily:"'Cinzel',serif" },
  topoNome:   { fontSize:13, color:"#c8922a", marginTop:6, fontStyle:"italic", minHeight:18 },
  scroll:     { flex:1, minHeight:0, overflowY:"auto", padding:"14px 12px 90px", position:"relative", zIndex:1 },
  secao:      { marginBottom:14, background:"linear-gradient(135deg,#22120088,#180d0088)", border:"1px solid #8b5e1a", borderRadius:8, overflow:"hidden", boxShadow:"0 2px 12px #00000060,inset 0 1px 0 #c8922a22" },
  secaoHead:  { background:"linear-gradient(90deg,#3a1e00,#281400,#3a1e00)", borderBottom:"1px solid #8b5e1a55", padding:"8px 16px 8px 40px", display:"flex", alignItems:"center", gap:8, position:"relative" },
  secaoIcone: { fontSize:15 },
  secaoTitulo:{ fontFamily:"'Cinzel',serif", fontSize:10, letterSpacing:3, color:"#e8a020", fontWeight:700, textTransform:"uppercase" },
  secaoBody:  { padding:"12px 14px" },
  label:      { fontFamily:"'Cinzel',serif", fontSize:9, letterSpacing:2, color:"#7a5020", textTransform:"uppercase" },
  input:      { background:"#0d070088", border:"1px solid #8b5e1a", borderRadius:5, color:"#f0d8a0", fontFamily:"'Merriweather',Georgia,serif", fontSize:12, padding:"7px 10px", outline:"none", width:"100%", boxSizing:"border-box", transition:"border-color 0.2s" },
  textarea:   { background:"#0d070088", border:"1px solid #8b5e1a", borderRadius:5, color:"#f0d8a0", fontFamily:"'Merriweather',Georgia,serif", fontSize:12, padding:"8px 10px", outline:"none", resize:"vertical", width:"100%", boxSizing:"border-box", lineHeight:1.6 },
  atribGrid:  { display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8 },
  atribBox:   { background:"linear-gradient(160deg,#2a150088,#1a0d0088)", border:"1px solid #8b5e1a", borderRadius:8, padding:"8px 4px 6px", textAlign:"center", display:"flex", flexDirection:"column", alignItems:"center", gap:1 },
  atribIcone: { fontSize:16, lineHeight:1 },
  atribNome:  { fontFamily:"'Cinzel',serif", fontSize:8, letterSpacing:2, color:"#c8922a", marginTop:2 },
  atribValor: { fontFamily:"'Cinzel Decorative','Cinzel',serif", fontSize:22, fontWeight:900, color:"#f0d8a0", lineHeight:1.1 },
  atribMod:   { fontFamily:"'Cinzel',serif", fontSize:11, fontWeight:700 },
  atribBtns:  { display:"flex", gap:5, marginTop:3 },
  btnMini:    { width:24, height:24, borderRadius:4, border:"1px solid #8b5e1a", background:"linear-gradient(180deg,#3a1e00,#1c0e00)", color:"#e8a020", fontSize:15, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", lineHeight:1, fontFamily:"'Cinzel',serif" },
  barraWrap:  { marginBottom:14 },
  barraFundo: { height:18, background:"#0d070088", borderRadius:9, border:"1px solid #8b5e1a", overflow:"hidden", position:"relative" },
  barraFill:  { height:"100%", borderRadius:9, transition:"width 0.4s cubic-bezier(.4,0,.2,1)" },
  barraGlow:  { position:"absolute", inset:0, background:"linear-gradient(180deg,#ffffff18 0%,transparent 60%)", borderRadius:9, pointerEvents:"none" },
  btnBarra:   { padding:"3px 7px", borderRadius:5, border:"1px solid #8b5e1a", background:"linear-gradient(180deg,#3a1e00,#1c0e00)", color:"#c8922a", fontSize:9, letterSpacing:1, fontFamily:"'Cinzel',serif", cursor:"pointer" },
  statsGrid:  { display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8 },
  statBox:    { background:"linear-gradient(160deg,#2a150088,#1a0d0088)", border:"1px solid #8b5e1a", borderRadius:8, padding:"8px 6px 7px", textAlign:"center" },
  statIcone:  { fontSize:18, display:"block", marginBottom:2 },
  statNome:   { fontFamily:"'Cinzel',serif", fontSize:8, letterSpacing:2, color:"#7a5020", textTransform:"uppercase" },
  statValor:  { fontFamily:"'Cinzel Decorative','Cinzel',serif", fontSize:24, fontWeight:900, color:"#f0d8a0", lineHeight:1.1 },
  statBtns:   { display:"flex", gap:5, justifyContent:"center", marginTop:4 },
  navBar:     { position:"fixed", bottom:0, left:0, right:0, zIndex:20, background:"linear-gradient(0deg,#0d0700,#1c0e00)", borderTop:"1px solid #8b5e1a", display:"flex", boxShadow:"0 -4px 20px #00000088" },
  navItem:    { flex:1, padding:"10px 4px 12px", display:"flex", flexDirection:"column", alignItems:"center", gap:3, cursor:"pointer", transition:"background 0.2s", borderTop:"2px solid transparent" },
  navIcone:   { fontSize:20 },
  navLabel:   { fontFamily:"'Cinzel',serif", fontSize:8, letterSpacing:1, textTransform:"uppercase" },
  grid2:      { display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 },
  grid3:      { display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8 },
};

const sCard = {
  input:    { background:"#0d070088", border:"1px solid #8b5e1a55", borderRadius:5, color:"#f0d8a0", fontSize:13, padding:"7px 10px", outline:"none", width:"100%", boxSizing:"border-box", transition:"border-color 0.2s" },
  textarea: { background:"#0d070088", border:"1px solid #8b5e1a55", borderRadius:5, color:"#c8a060", fontFamily:"'IM Fell English',Georgia,serif", fontSize:13, padding:"8px 10px", outline:"none", resize:"vertical", width:"100%", boxSizing:"border-box", lineHeight:1.6, transition:"border-color 0.2s" },
  btnDanger:{ padding:"4px 10px", borderRadius:5, border:"1px solid #5a1a1a", background:"#2a0d0d88", color:"#e06060", fontFamily:"'Cinzel',serif", fontSize:9, letterSpacing:1, cursor:"pointer" },
  btnSalvar:{ padding:"4px 12px", borderRadius:5, border:"1px solid", background:"transparent", fontFamily:"'Cinzel',serif", fontSize:9, letterSpacing:1, cursor:"pointer" },
};

const sLogin = {
  input:    { background:"#0d070088", border:"1px solid #8b5e1a", borderRadius:5, color:"#f0d8a0", fontFamily:"'Cinzel',serif", fontSize:13, padding:"8px 10px", outline:"none", width:"100%", boxSizing:"border-box", transition:"border-color 0.2s" },
  btnEntrar:{ width:"100%", padding:"11px 0", background:"linear-gradient(180deg,#5a3200,#3a1e00)", border:"1px solid #c8922a", borderRadius:6, color:"#e8a020", fontFamily:"'Cinzel',serif", fontSize:12, fontWeight:700, letterSpacing:3, cursor:"pointer" },
};

const armaVazia     = () => ({ id:Date.now()+Math.random(), nome:"", teste:"", dano:"", critico:"", tipo:"", alcance:"" });
const itemVazio     = () => ({ id:Date.now()+Math.random(), descricao:"", qtd:"", espaco:"" });
const fonteCargaVazia = () => ({
  id: Date.now() + Math.random(),
  nome: "",
  valor: 0,
});
const armaduraVazia = () => ({
  id: Date.now() + Math.random(),
  nome: "",
  tipo: "armadura",
  defesa: "",
  penalidade: "",
});
const classeVazia = () => ({
  id: Date.now() + Math.random(),
  nome: "", nivel: 1,
  pvInicial: 0, pvNivel: 0,
  pmInicial: 0, pmNivel: 0,
});

const condicaoAtiva = (rodadaAtual = 1) => ({
  id: Date.now() + Math.random(),
  nome: "",
  permanente: true,          // começa sem duração
  duracao: null,             // rodadas de duração total
  rodadaInicio: rodadaAtual, // em que rodada foi criada
});

// Rodadas restantes: null = permanente. <=0 = expirada.
const rodadasRestantes = (cond, rodadaAtual) => {
  if (cond.permanente || cond.duracao == null) return null;
  const decorridas = Math.max(0, (rodadaAtual ?? 1) - (cond.rodadaInicio ?? 1));
  return cond.duracao - decorridas;
};

const CENA_INICIAL = {
  ativa: false,
  nome: "",
  rodada: 1,
  efeitos: [], // Manter vazio por enquanto, será usado para condições de cena
  modificadores: {
    ataque: 0,
    dano: 0,
    defesa: 0,
    iniciativa: 0,
    pericias: { geral: 0, regras: [] }, // Será usado para modificadores de perícias específicos
  },
  observacoes: "",
};

const ESCOPOS_REGRA = ["todas", "resistencia", "atributo", "pericia"];

function sanearRegrasPericia(regras) {
  if (!Array.isArray(regras)) return [];
  return regras
    .filter(r => r && typeof r === "object")
    .map(r => ({
      id: r.id ?? Date.now() + Math.random(),
      escopo: ESCOPOS_REGRA.includes(r.escopo) ? r.escopo : "todas",
      alvo: typeof r.alvo === "string" ? r.alvo : "",
      valor: Number.isFinite(Number(r.valor)) ? Number(r.valor) : 0,
    }));
}

const regraPericiaVazia = () => ({
  id: Date.now() + Math.random(),
  escopo: "todas",
  alvo: "",
  valor: 0,
});


function criarFichaInicial() {
  return {
    nome: "",
    raca: "",
    classe: "",
    classes: [classeVazia()],
    nivel: 1,
    origem: "",
    divindade: "",
    deslocamento: 9,
    cena: structuredClone(CENA_INICIAL),

    usaMagia: false,

    magiaConfig: {
      atributoChave: "INT",
      bonusCD: 0,
    },

    magias: [],
    poderes: [],
    condicoes: [],

    atributos: criarAtributosIniciais(),

    pv: {
      valor: 20,
      max: 20,
    },

    pm: {
      valor: 10,
      max: 10,
    },

    pvt: {
      valor: 0,
      max: 0,
    },

    pmt: {
      valor: 0,
      max: 0,
    },

    defesaComp: {
      bonArmadura: 0,
      bonEscudo: 0,
      bonEscudoAuto: false,
      outros: 0,
    },

    rd: 0,
    penArmadura: 0,
    iniciativa: 0,
    bonAtaque: 0,
    bonDano: 0,

    armaduras: [armaduraVazia()],
    pericias: criarPericiasIniciais(),

    armas: [armaVazia()],
    itens: [itemVazio()],

    anotacoes: "",

    carga: {
      fontesExtras: [],
    },

    avatar: {
      imagem: "",
    },
    
    evolucao: {
      pvInicial: 0,
      pmInicial: 0,
      pvPorNivel: 0,
      pmPorNivel: 0,
      bonusPV: 0,
      bonusPM: 0,
      observacoes: "",
    },
  };
}

function calcularPvPm(classesLista, modCon, evolucao) {
  let pv = 0, pm = 0;
  classesLista.forEach((cl, idx) => {
    const niv = parseInt(cl.nivel) || 0;
    if (niv <= 0) return;
    const pvN = parseInt(cl.pvNivel) || 0;
    const pmN = parseInt(cl.pmNivel) || 0;
    if (idx === 0) {
      pv += (parseInt(cl.pvInicial) || 0) + modCon;
      pm += (parseInt(cl.pmInicial) || 0);
      const r = niv - 1;
      pv += (pvN + modCon) * r;
      pm += pmN * r;
    } else {
      pv += (pvN + modCon) * niv;
      pm += pmN * niv;
    }
  });
  const bonusPV = parseInt(evolucao?.bonusPV) || 0;
  const bonusPM = parseInt(evolucao?.bonusPM) || 0;
  return { pvCalculado: pv + bonusPV, pmCalculado: pm + bonusPM };
}

function calcularDerivados(ficha) {
  const classes = ficha.classes?.length ? ficha.classes : [classeVazia()];
  const nivel = classes.reduce((a, cl) => a + (parseInt(cl.nivel) || 0), 0) || 1;
  const modCon = calcMod(ficha.atributos?.CON ?? 10);
  const { pvCalculado, pmCalculado } = calcularPvPm(classes, modCon, ficha.evolucao);

  const pvAuto = pvCalculado > 0;
  const pmAuto = pmCalculado > 0;
  const pvMax = pvAuto ? pvCalculado : Math.max(0, Number(ficha.pv?.max) || 0);
  const pmMax = pmAuto ? pmCalculado : Math.max(0, Number(ficha.pm?.max) || 0);

  const eq = ficha.armaduras || [];
  const ehEscudo = a => (a.tipo || "armadura") === "escudo";
  const soma = (lista, campo) => lista.reduce((t, a) => t + (parseInt(a[campo]) || 0), 0);

  const temEscudo = eq.some(ehEscudo);
  const bonArmadura = soma(eq.filter(a => !ehEscudo(a)), "defesa");
  const bonEscudo = temEscudo
    ? soma(eq.filter(ehEscudo), "defesa")
    : parseInt(ficha.defesaComp?.bonEscudo) || 0; // valor legado de fichas antigas
  const penArmadura = soma(eq, "penalidade");

  return { nivel, pvCalculado, pmCalculado, pvAuto, pmAuto, pvMax, pmMax, bonArmadura, bonEscudo, penArmadura };
}

function calcularDefesaCondicoes(condicoes = []) {
  const nomes = new Set(
    (Array.isArray(condicoes) ? condicoes : [])
      .map(condicao => condicao?.nome)
      .filter(Boolean)
  );

  const temUm = lista =>
    lista.some(nome => nomes.has(nome));

  /*
   * Estes estados tornam o personagem indefeso.
   * O modificador de -10 já substitui o -5 de desprevenido.
   */
  const indefeso = temUm([
    "Indefeso",
    "Paralisado",
    "Inconsciente",
    "Petrificado",
  ]);

  /*
   * Estes estados aplicam o efeito de desprevenido.
   * Se o personagem já estiver indefeso, não somamos -5 novamente.
   */
  const desprevenido =
    !indefeso &&
    temUm([
      "Desprevenido",
      "Surpreendido",
      "Agarrado",
      "Atordoado",
      "Cego",
    ]);

  /*
   * Estes estados aplicam o efeito de vulnerável.
   */
  const vulneravel = temUm([
    "Vulnerável",
    "Enredado",
    "Exausto",
    "Fatigado",
  ]);

  const caido = nomes.has("Caído");

  const modificadorIndefeso = indefeso ? -10 : 0;
  const modificadorDesprevenido = desprevenido ? -5 : 0;
  const modificadorVulneravel = vulneravel ? -2 : 0;

  /*
   * Este é o modificador geral de Defesa, sem considerar
   * a diferença especial da condição Caído.
   */
  const modificadorBase =
    modificadorIndefeso +
    modificadorDesprevenido +
    modificadorVulneravel;

  /*
   * Caído altera a Defesa de forma diferente dependendo
   * do tipo de ataque.
   */
  const modificadorCorpoACorpo =
    modificadorBase + (caido ? -5 : 0);

  const modificadorDistancia =
    modificadorBase + (caido ? 5 : 0);

  const detalhes = [];

  if (indefeso) {
    detalhes.push(
      "Indefeso: −10 Defesa"
    );
  } else if (desprevenido) {
    detalhes.push(
      "Desprevenido: −5 Defesa"
    );
  }

  if (vulneravel) {
    detalhes.push(
      "Vulnerável: −2 Defesa"
    );
  }

  if (caido) {
    detalhes.push(
      "Caído: −5 contra corpo a corpo e +5 contra distância"
    );
  }

  return {
    indefeso,
    desprevenido,
    vulneravel,
    caido,
    modificadorBase,
    modificadorCorpoACorpo,
    modificadorDistancia,
    detalhes,
  };
}

function calcularEfeitosPericiaCondicoes(
  condicoes = [],
  nomePericia,
  atributo
) {
  const nomes = new Set(
    (Array.isArray(condicoes) ? condicoes : [])
      .map(condicao => condicao?.nome)
      .filter(Boolean)
  );

  const tem = nome => nomes.has(nome);

  const detalhes = [];
  let modificador = 0;
  let indisponivel = false;
  let falhaAutomatica = false;

  function adicionar(valor, detalhe) {
    modificador += valor;
    detalhes.push(detalhe);
  }

  const eResistencia = [
    "Fortitude",
    "Reflexos",
    "Vontade",
  ].includes(nomePericia);

  const eForDesCon = [
    "FOR",
    "DES",
    "CON",
  ].includes(atributo);

  const eIntSabCar = [
    "INT",
    "SAB",
    "CAR",
  ].includes(atributo);

  const indefeso = [
    "Indefeso",
    "Paralisado",
    "Inconsciente",
    "Petrificado",
  ].some(tem);

  const desprevenido =
    !indefeso &&
    [
      "Desprevenido",
      "Surpreendido",
      "Agarrado",
      "Atordoado",
      "Cego",
    ].some(tem);

  const cegoImpedePercepcao =
    nomePericia === "Percepção" &&
    tem("Cego");

  if (cegoImpedePercepcao) {
    indisponivel = true;

    detalhes.push(
      "Cego: não pode fazer testes de Percepção"
    );
  } else {
    if (!eResistencia) {
      if (tem("Apavorado")) {
        adicionar(-5, "Apavorado: −5 em perícias");
      } else if (tem("Abalado")) {
        adicionar(-2, "Abalado: −2 em perícias");
      }

      if (eForDesCon) {
        const temDebilitado = tem("Debilitado") || tem("Exausto");
        const temFraco = tem("Fraco") || tem("Fatigado");

        if (temDebilitado) {
          adicionar(
            -5,
            `${tem("Exausto") ? "Exausto" : "Debilitado"}: −5 em perícias de FOR/DES/CON`
          );
        } else if (temFraco) {
          adicionar(
            -2,
            `${tem("Fatigado") ? "Fatigado" : "Fraco"}: −2 em perícias de FOR/DES/CON`
          );
        }
      }

      if (eIntSabCar) {
        if (tem("Esmorecido")) {
          adicionar(-5, "Esmorecido: −5 em perícias de INT/SAB/CAR");
        } else if (tem("Frustrado")) {
          adicionar(-2, "Frustrado: −2 em perícias de INT/SAB/CAR");
        }
      }

      if (
        tem("Cego") &&
        ["FOR", "DES"].includes(atributo)
      ) {
        adicionar(-5, "Cego: −5 em perícias de FOR/DES");
      }

      if (nomePericia === "Percepção") {
        if (tem("Fascinado")) {
          adicionar(-5, "Fascinado: −5 em Percepção");
        }

        if (tem("Ofuscado")) {
          adicionar(-2, "Ofuscado: −2 em Percepção");
        }
      }
    }
  }

  if (nomePericia === "Reflexos") {
    if (indefeso) {
      falhaAutomatica = true;

      detalhes.push(
        "Indefeso: falha automaticamente em Reflexos"
      );
    } else if (desprevenido) {
      adicionar(-5, "Desprevenido: −5 em Reflexos");
    }
  }

  if (
    nomePericia === "Iniciativa" &&
    tem("Surdo")
  ) {
    adicionar(-5, "Surdo: −5 em Iniciativa");
  }

  return {
    modificador,
    detalhes,
    indisponivel,
    falhaAutomatica,
  };
}

// ─── COMPONENTES AUXILIARES ───────────────────────────────────────────────────

const DiamondDivider = () => (
  <svg viewBox="0 0 200 12" style={{ width:"100%", height:12, display:"block", margin:"6px 0" }}>
    <line x1="0"   y1="6" x2="82"  y2="6" stroke="#8b5e1a" strokeWidth="1" />
    <polygon points="100,1 107,6 100,11 93,6" fill="#c8922a" />
    <line x1="118" y1="6" x2="200" y2="6" stroke="#8b5e1a" strokeWidth="1" />
  </svg>
);

const CornerOrnament = ({ flip }) => (
  <svg viewBox="0 0 28 28" style={{ width:28, height:28, position:"absolute", top:4, [flip?"right":"left"]:4, transform:flip?"scaleX(-1)":"none", opacity:0.55, pointerEvents:"none" }}>
    <path d="M2 2 L14 2 L2 14 Z" fill="none" stroke="#c8922a" strokeWidth="1.2" />
    <path d="M2 2 L8 2 L2 8 Z"   fill="#c8922a" opacity="0.4" />
    <circle cx="2" cy="2" r="1.5" fill="#e8a020" />
  </svg>
);

function Secao({ icone, titulo, children }) {
  return (
    <div style={s.secao}>
      <div style={s.secaoHead}>
        <CornerOrnament /><CornerOrnament flip />
        <span style={s.secaoIcone}>{icone}</span>
        <span style={s.secaoTitulo}>{titulo}</span>
      </div>
      <div style={s.secaoBody}>{children}</div>
    </div>
  );
}

function Modal({ titulo, onClose, children }) {
  return (
    <div style={{ position:"fixed", inset:0, zIndex:100, background:"#00000099", display:"flex", alignItems:"center", justifyContent:"center", padding:16 }} onClick={onClose}>
      <div style={{ background:"linear-gradient(160deg,#2e1800,#1c0e00)", border:"1px solid #c8922a", borderRadius:10, padding:"20px 18px", maxWidth:420, width:"100%", maxHeight:"80vh", overflowY:"auto", boxShadow:"0 8px 40px #000c", position:"relative" }} onClick={e => e.stopPropagation()}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:14, gap:10 }}>
          <div style={{ fontFamily:"'Cinzel',serif", fontSize:13, fontWeight:700, color:"#e8a020", letterSpacing:2 }}>{titulo}</div>
          <button onClick={onClose} style={{ background:"transparent", border:"none", color:"#7a5020", fontSize:18, cursor:"pointer", lineHeight:1, flexShrink:0 }}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function lerBonusAtaque(texto) {
  const valor = String(texto ?? "")
    .trim()
    .replace(/−/g, "-");

  if (!valor) return 0;

  // Pega o último número do campo.
  // Assim, funcionam valores como +12, 12, -2 ou 1d20+12.
  const match = valor.match(/([+-]?\d+)\s*$/);

  if (!match) return 0;

  const numero = Number(match[1]);

  return Number.isFinite(numero) ? numero : 0;
}

function interpretarExpressaoDano(expressao) {
  const texto = String(expressao ?? "")
    .trim()
    .toLowerCase()
    .replace(/−/g, "-")
    .replace(/\s+/g, "");

  /*
   * Aceita:
   * 1d8
   * d8
   * 2d6+3
   * 1d10-2
   */
  const partes = texto.match(
    /^(\d*)d(\d+)([+-]\d+)?$/
  );

  if (!partes) return null;

  const quantidade = Number(partes[1] || 1);
  const faces = Number(partes[2]);
  const modificador = Number(partes[3] || 0);

  if (
    !Number.isInteger(quantidade) ||
    quantidade < 1 ||
    quantidade > 100
  ) {
    return null;
  }

  if (
    !Number.isInteger(faces) ||
    faces < 2 ||
    faces > 1000
  ) {
    return null;
  }

  return {
    quantidade,
    faces,
    modificador,
    formula: texto,
  };
}

function lerMargemCritico(texto) {
  /*
   * Exemplos aceitos:
   * 19/×2
   * 18/x3
   * 20
   *
   * Se não houver número, considera crítico apenas no 20.
   */
  const match = String(texto ?? "").match(
    /^\s*(\d{1,2})/
  );

  if (!match) return 20;

  const valor = Number(match[1]);

  if (
    !Number.isInteger(valor) ||
    valor < 2 ||
    valor > 20
  ) {
    return 20;
  }

  return valor;
}

function AcoesArma({
  arma,
  bonusAtaque = 0,
  bonusDano = 0,
  onResultado,
}) {

  const [resultadoAtaque, setResultadoAtaque] =
    useState(null);

  const [resultadoDano, setResultadoDano] =
    useState(null);

  const [erro, setErro] = useState("");

  function rolarAtaque() {
    const natural =
      Math.floor(Math.random() * 20) + 1;
  
    const bonusArma = lerBonusAtaque(arma.teste);

    const bonusFicha = Number(bonusAtaque) || 0;

    const bonus = bonusArma + bonusFicha;
  
    const margemCritico = lerMargemCritico(
      arma.critico
    );
  
    const critico =
      natural !== 1 &&
      natural >= margemCritico;
  
    const resultado = {
      natural,
      bonus,
      total: natural + bonus,
      margemCritico,
      critico,
    };
  
    setResultadoAtaque(resultado);
    setResultadoDano(null);
  
    if (onResultado) {
      onResultado({
        tipo: "Ataque",
        nome: arma.nome?.trim() || "Ataque sem nome",
        natural,
        bonus,
        total: resultado.total,
        critico,
      });
    }
  
    setErro("");
  }

  function rolarDano() {
    const dados = interpretarExpressaoDano(arma.dano);
  
    if (!dados) {
      setErro("Dano inválido. Use um formato como 1d8+3.");
      return;
    }
  
    const modificadorArma =
      Number(dados.modificador) || 0;
  
    const bonusDanoFicha =
      Number(bonusDano) || 0;
  
    const ataqueCritico =
      resultadoAtaque?.critico === true;
  
    const multiplicador = ataqueCritico
      ? lerMultiplicadorCritico(arma.critico)
      : 1;
  
    /*
     * Em um crítico, aumentamos a quantidade de dados.
     *
     * Exemplo:
     * 1d8 ×2 => 2 rolagens de d8
     * 2d6 ×3 => 6 rolagens de d6
     */
    const quantidadeDados =
      dados.quantidade * multiplicador;
  
    const valores = Array.from(
      { length: quantidadeDados },
      () =>
        Math.floor(Math.random() * dados.faces) + 1
    );
  
    const somaDados = valores.reduce(
      (soma, valor) => soma + valor,
      0
    );
  
    /*
     * Os bônus fixos entram apenas uma vez.
     */
    const total =
      somaDados +
      modificadorArma +
      bonusDanoFicha;
  
    const resultado = {
      formula: dados.formula,
      quantidadeOriginal: dados.quantidade,
      quantidadeRolada: quantidadeDados,
      faces: dados.faces,
      valores,
      somaDados,
      modificador: modificadorArma,
      bonusDanoFicha,
      critico: ataqueCritico,
      multiplicador,
      total,
    };
  
    setResultadoDano(resultado);
  
    if (onResultado) {
      onResultado({
        tipo: "Dano",
        nome: arma.nome?.trim() || "Dano sem nome",
        ...resultado,
      });
    }
  
    /*
     * O crítico vale somente para o dano imediatamente
     * posterior ao ataque crítico.
     */
    setResultadoAtaque(null);
    setErro("");
  }

  const estiloBotao = cor => ({
    padding: "5px 8px",
    borderRadius: 5,
    border: `1px solid ${cor}88`,
    background: `${cor}11`,
    color: cor,
    fontFamily: "'Cinzel',serif",
    fontSize: 8,
    letterSpacing: 1,
    cursor: "pointer",
    whiteSpace: "nowrap",
  });

  return (
    <div
      style={{
        padding: "6px 0 2px",
        borderTop: "1px solid #3a2a1044",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 5,
        }}
      >
        <span
          style={{
            fontFamily: "'Cinzel',serif",
            fontSize: 8,
            letterSpacing: 1,
            color: "#7a5020",
            marginRight: 2,
          }}
        >
          AÇÕES
        </span>

        <button
          onClick={rolarAtaque}
          style={estiloBotao("#e8a020")}
          title="Rolar 1d20 e somar o bônus do campo Teste"
        >
          ROLAR ATAQUE
        </button>

        <button
          onClick={rolarDano}
          style={estiloBotao("#e06060")}
          title="Rolar a expressão do campo Dano"
        >
          ROLAR DANO
        </button>
      </div>

      {erro && (
        <div
          style={{
            marginTop: 5,
            fontFamily: "'Cinzel',serif",
            fontSize: 8,
            color: "#e06060",
            lineHeight: 1.4,
          }}
        >
          {erro}
        </div>
      )}

      {resultadoAtaque && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 6,
            marginTop: 6,
            padding: "6px 8px",
            borderRadius: 5,
            background: "#e8a0200d",
            border: "1px solid #e8a02033",
          }}
        >
          <span
            style={{
              fontFamily: "'Cinzel',serif",
              fontSize: 8,
              letterSpacing: 1,
              color: "#7a5020",
            }}
          >
            ATAQUE
          </span>

          <strong
            style={{
              fontFamily:
                "'Cinzel Decorative','Cinzel',serif",
              fontSize: 18,
              color: "#e8a020",
            }}
          >
            {resultadoAtaque.total}
          </strong>

          <span
            style={{
              fontFamily: "'Cinzel',serif",
              fontSize: 9,
              color: "#c8a060",
            }}
          >
            {resultadoAtaque.natural}{" "}
            {fmtMod(resultadoAtaque.bonus)}
          </span>

          {resultadoAtaque.natural === 1 && (
            <span
              style={{
                fontFamily: "'Cinzel',serif",
                fontSize: 8,
                color: "#e06060",
                letterSpacing: 1,
              }}
            >
              FALHA NATURAL
            </span>
          )}

          {resultadoAtaque.critico && (
            <span
              style={{
                fontFamily: "'Cinzel',serif",
                fontSize: 8,
                color: "#7ec87e",
                letterSpacing: 1,
              }}
            >
              CRÍTICO ({resultadoAtaque.margemCritico}–20)
            </span>
          )}
        </div>
      )}

          {resultadoDano && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 6,
                marginTop: 6,
                padding: "6px 8px",
                borderRadius: 5,
                background: "#e060600d", // Fundo padrão para dano
                border: "1px solid #e0606033", // Borda padrão para dano
              }}
            >
              <span
                style={{
                  fontFamily: "'Cinzel',serif",
                  fontSize: 8,
                  letterSpacing: 1,
                  color: "#7a5020",
                }}
              >
                DANO
              </span>

              <strong
                style={{
                  fontFamily:
                    "'Cinzel Decorative','Cinzel',serif",
                  fontSize: 18,
                  color: "#e06060",
                }}
              >
                {resultadoDano.total}
              </strong>

              <span
                style={{
                  fontFamily: "'Cinzel',serif",
                  fontSize: 9,
                  color: "#c8a060",
                }}
              >
                {resultadoDano.quantidadeRolada}d
                {resultadoDano.faces}:{" "}
                {resultadoDano.valores.join(" + ")}
                {/* Adiciona os bônus fixos aqui */}
                {fmtMod(
                  (Number(resultadoDano.modificador) || 0) +
                  (Number(resultadoDano.bonusDanoFicha) || 0)
                )}
              </span>

              {resultadoDano.critico && (
                <span
                  style={{
                    fontFamily: "'Cinzel',serif",
                    fontSize: 8,
                    color: "#ff9090",
                    letterSpacing: 1,
                  }}
                >
                  CRÍTICO ×{resultadoDano.multiplicador}
                </span>
              )}
            </div>
          )}
    </div>
  );
}

function AtribBox({ nome, valor, onChange }) {
  const mod = calcMod(valor);
  return (
    <div style={s.atribBox}>
      <div style={s.atribIcone}>{ATRIB_ICONES[nome]}</div>
      <div style={s.atribNome}>{nome}</div>
      {/* Bônus em destaque */}
      <div style={{ ...s.atribMod, fontSize:26, fontWeight:900, fontFamily:"'Cinzel Decorative','Cinzel',serif", color:mod>=0?"#7ec87e":"#e06060", lineHeight:1.1 }}>
        {fmtMod(mod)}
      </div>
      {/* Valor base em menor destaque */}
      <div style={{ fontFamily:"'Cinzel',serif", fontSize:11, color:"#7a5020", lineHeight:1 }}>
        {valor}
      </div>
      <div style={s.atribBtns}>
        <button style={s.btnMini} onClick={() => onChange(Math.max(1,  valor-1))}>−</button>
        <button style={s.btnMini} onClick={() => onChange(Math.min(30, valor+1))}>+</button>
      </div>
    </div>
  );
}

function RolagemPericia({
  nome,
  total,
  indisponivel = false,
  falhaAutomatica = false,
  onResultado,
}) {
  const [resultado, setResultado] = useState(null);

  function rolar() {
    if (indisponivel || falhaAutomatica) {
      setResultado(null);
      return;
    }

    const natural =
      Math.floor(Math.random() * 20) + 1;

    const novoResultado = {
      natural,
      bonus: total,
      total: natural + total,
    };

    setResultado(novoResultado);

    if (onResultado) {
      onResultado({
        nome,
        ...novoResultado,
      });
    }
  }

  const bloqueada =
    indisponivel || falhaAutomatica;

  return (
    <div
      style={{
        marginTop: 3,
        marginBottom: 3,
        paddingLeft: 22,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 5,
          flexWrap: "wrap",
        }}
      >
        <button
          type="button"
          onClick={rolar}
          disabled={bloqueada}
          title={
            indisponivel
              ? "Esta perícia não pode ser testada agora."
              : falhaAutomatica
                ? "Esta perícia falha automaticamente."
                : `Rolar 1d20 + ${fmtMod(total)} em ${nome}`
          }
          style={{
            padding: "3px 7px",
            borderRadius: 4,
            border: `1px solid ${
              bloqueada
                ? "#3a2a10"
                : "#8b5e1a88"
            }`,
            background: bloqueada
              ? "transparent"
              : "#e8a02011",
            color: bloqueada
              ? "#3a2a10"
              : "#c8922a",
            fontFamily: "'Cinzel',serif",
            fontSize: 7,
            letterSpacing: 0.8,
            cursor: bloqueada
              ? "not-allowed"
              : "pointer",
            opacity: bloqueada ? 0.55 : 1,
          }}
        >
          🎲 ROLAR
        </button>

        {resultado && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              flexWrap: "wrap",
              fontFamily: "'Cinzel',serif",
              fontSize: 8,
              color: "#c8a060",
            }}
          >
            <span style={{ color: "#7a5020" }}>
              d20: {resultado.natural}
            </span>

            <span style={{ color: "#7a5020" }}>
              {fmtMod(resultado.bonus)}
            </span>

            <strong
              style={{
                fontFamily:
                  "'Cinzel Decorative','Cinzel',serif",
                fontSize: 16,
                color:
                  resultado.natural === 1
                    ? "#e06060"
                    : resultado.natural === 20
                      ? "#7ec87e"
                      : "#e8a020",
              }}
            >
              = {resultado.total}
            </strong>

            {resultado.natural === 20 && (
              <span
                style={{
                  color: "#7ec87e",
                  letterSpacing: 0.8,
                }}
              >
                20 NATURAL
              </span>
            )}

            {resultado.natural === 1 && (
              <span
                style={{
                  color: "#e06060",
                  letterSpacing: 0.8,
                }}
              >
                1 NATURAL
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function HistoricoRolagens({
  rolagens,
  onLimpar,
}) {
  const rolagensSeguras = Array.isArray(rolagens)
  ? rolagens.filter(
      rolagem =>
        rolagem &&
        typeof rolagem === "object"
    )
  : [];
  return (
    <div
      style={{
        marginBottom: 12,
        padding: "10px 12px",
        borderRadius: 8,
        border: "1px solid #8b5e1a66",
        background:
          "linear-gradient(135deg,#22120066,#180d0066)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 8,
          marginBottom: 8,
        }}
      >
        <span
          style={{
            fontFamily: "'Cinzel',serif",
            fontSize: 9,
            letterSpacing: 2,
            color: "#c8922a",
          }}
        >
          HISTÓRICO DA SESSÃO
        </span>

        {rolagensSeguras.length > 0 && (
          <button
            type="button"
            onClick={onLimpar}
            style={{
              padding: "3px 7px",
              borderRadius: 4,
              border: "1px solid #3a2a10",
              background: "transparent",
              color: "#7a5020",
              fontFamily: "'Cinzel',serif",
              fontSize: 7,
              letterSpacing: 1,
              cursor: "pointer",
            }}
          >
            LIMPAR
          </button>
        )}
      </div>

      {rolagensSeguras.length === 0 ? (
        <div
          style={{
            padding: "8px 0",
            textAlign: "center",
            fontFamily: "'Cinzel',serif",
            fontSize: 8,
            color: "#7a5020",
            fontStyle: "italic",
          }}
        >
          Nenhuma rolagem nesta sessão.
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 5,
          }}
        >
          {rolagensSeguras.map(rolagem => (
            <div
              key={rolagem.id}
              style={{
                display: "grid",
                gridTemplateColumns:
                  "1fr auto auto",
                alignItems: "center",
                gap: 8,
                padding: "6px 8px",
                borderRadius: 5,
                background: "#0d070088",
                border: "1px solid #3a2a10",
              }}
            >
              <div
                style={{
                  minWidth: 0,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                    fontFamily: "'Cinzel',serif",
                    fontSize: 9,
                    color: "#c8a060",
                  }}
                >
                  <span
                    style={{
                      color:
                        rolagem.tipo === "Dano"
                          ? "#e06060"
                          : rolagem.tipo === "Ataque"
                            ? "#e8a020"
                            : rolagem.tipo === "Iniciativa"
                              ? "#80b0e0"
                              : "#c8a060",
                      fontSize: 8,
                      letterSpacing: 0.5,
                    }}
                  >
                    {rolagem.tipo}
                  </span>

                  <span>·</span>

                  <span>{rolagem.nome}</span>
                </div>

                {rolagem.tipo === "Dano" ? (
  <div style={{ marginTop: 2, fontFamily: "'Cinzel',serif", fontSize: 7, color: "#7a5020", lineHeight: 1.4 }}>
    {rolagem.critico && (
      <span style={{ color: "#ff9090" }}>⚡ ×{rolagem.multiplicador} </span>
    )}
    {rolagem.quantidadeRolada}d{rolagem.faces}
    {Array.isArray(rolagem.valores) && ` · ${rolagem.valores.join(" + ")}`}
    {" "}
    {fmtMod((Number(rolagem.modificador) || 0) + (Number(rolagem.bonusDanoFicha) || 0))}
  </div>
) : (

                  <div
                    style={{
                      marginTop: 2,
                      fontFamily: "'Cinzel',serif",
                      fontSize: 7,
                      color: "#7a5020",
                    }}
                  >
                    d20: {rolagem.natural ?? "—"}{" "}
                    {fmtMod(Number(rolagem.bonus) || 0)}
                  </div>
                )}

                

              </div>

              <span
                style={{
                  fontFamily: "'Cinzel',serif",
                  fontSize: 8,
                  color: "#7a5020",
                  whiteSpace: "nowrap",
                }}
              >
                {rolagem.criadoEm}
              </span>

              <strong
              style={{
                minWidth: 32,
                textAlign: "center",
                fontFamily:
                  "'Cinzel Decorative','Cinzel',serif",
                fontSize: 17,
                color:
                  rolagem.tipo === "Dano"
                    ? "#e06060"
                    : rolagem.natural === 1
                      ? "#e06060"
                      : rolagem.natural === 20
                        ? "#7ec87e"
                        : "#e8a020",
              }}
            >
              {rolagem.total ?? "—"}
            </strong>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function lerMultiplicadorCritico(valor) {
  const texto = String(valor || "").trim();

  /*
   * Aceita formatos como:
   * 19/×2
   * 19/x2
   * 19-20/×3
   */
  const encontrado =
    texto.match(/[\/]\s*[×xX]\s*(\d+)/) ||
    texto.match(/[×xX]\s*(\d+)/) ||
    texto.match(/[\/]\s*(\d+)/);

  const multiplicador = encontrado
    ? parseInt(encontrado[1], 10)
    : 2;

  return Number.isFinite(multiplicador) && multiplicador >= 2
    ? multiplicador
    : 2;
}

function ControlesCombate({
  pv,
  pvt,
  pm,
  pmt,
  onChangePv,
  onChangePvt,
  onChangePm,
  onChangePmt,
}) {
  const [quantidade, setQuantidade] = useState(1);
  const [mensagem, setMensagem] = useState("");

  function numeroSeguro(valor) {
    const n = Number(valor);
    return Number.isFinite(n) ? n : 0;
  }

  function obterQuantidade() {
    const n = Math.floor(numeroSeguro(quantidade));

    if (n <= 0) return 1;

    return Math.min(999, n);
  }

  function limitePvNegativo(maximo) {
    const maxNumero = Math.max(0, numeroSeguro(maximo));

    return Math.min(
      -10,
      -Math.floor(maxNumero / 2)
    );
  }

  function aplicarDano() {
    const qtd = obterQuantidade();

    const pvAtual = numeroSeguro(pv?.valor);
    const maxPv = Math.max(0, numeroSeguro(pv?.max));

    const pvtAtual = Math.max(
      0,
      numeroSeguro(pvt?.valor)
    );

    /*
     * O dano é aplicado primeiro aos PV temporários.
     * Apenas o dano que sobrar chega aos PV normais.
     */
    const danoNosTemporarios = Math.min(
      pvtAtual,
      qtd
    );

    const danoRestante = qtd - danoNosTemporarios;

    const novoPvt =
      pvtAtual - danoNosTemporarios;

    const limiteNegativo = limitePvNegativo(maxPv);

    const novoPv = Math.max(
      limiteNegativo,
      pvAtual - danoRestante
    );

    const danoRealNosPv = Math.max(
      0,
      pvAtual - novoPv
    );

    const danoAplicado =
      danoNosTemporarios + danoRealNosPv;

    onChangePvt(novoPvt);
    onChangePv(novoPv);

    if (danoAplicado < qtd) {
      setMensagem(
        `Dano limitado a ${danoAplicado}. O limite de PV negativo foi atingido.`
      );
    } else if (danoNosTemporarios > 0 && danoRealNosPv > 0) {
      setMensagem(
        `Dano de ${qtd} aplicado (${danoNosTemporarios} nos PV temporários + ${danoRealNosPv} nos PV normais).`
      );
    } else if (danoNosTemporarios > 0) {
      setMensagem(
        `Dano de ${qtd} absorvido pelos PV temporários.`
      );
    } else {
      setMensagem(`Dano de ${qtd} aplicado aos PV.`);
    }
  }

  function curarPv() {
    const qtd = obterQuantidade();
    const maxPv = Math.max(0, numeroSeguro(pv?.max));
    const pvAtual = numeroSeguro(pv?.valor);

    if (maxPv <= 0) {
      setMensagem(
        "O PV máximo ainda não foi definido."
      );
      return;
    }

    const novoPv = Math.min(
      maxPv,
      pvAtual + qtd
    );

    const curaReal = Math.max(
      0,
      novoPv - pvAtual
    );

    onChangePv(novoPv);

    if (curaReal === 0) {
      setMensagem("Os PV já estão no máximo.");
    } else {
      setMensagem(`Você recuperou ${curaReal} PV.`);
    }
  }

  function gastarPm() {
    const qtd = obterQuantidade();

    const pmAtual = Math.max(
      0,
      numeroSeguro(pm?.valor)
    );

    const pmtAtual = Math.max(
      0,
      numeroSeguro(pmt?.valor)
    );

    /*
     * O gasto de PM consome primeiro os PM temporários.
     * Apenas o que sobrar é descontado dos PM normais.
     */
    const gastoNosTemporarios = Math.min(
      pmtAtual,
      qtd
    );

    const gastoRestante =
      qtd - gastoNosTemporarios;

    const novoPmt =
      pmtAtual - gastoNosTemporarios;

    const gastoRealNosPm = Math.min(
      gastoRestante,
      pmAtual
    );

    const novoPm = pmAtual - gastoRealNosPm;

    const gastoTotal =
      gastoNosTemporarios + gastoRealNosPm;

    onChangePmt(novoPmt);
    onChangePm(novoPm);

    if (gastoTotal === 0) {
      setMensagem(
        "Não há PM disponíveis para gastar."
      );
    } else if (
      gastoNosTemporarios > 0 &&
      gastoRealNosPm > 0
    ) {
      setMensagem(
        `Você gastou ${gastoTotal} PM (${gastoNosTemporarios} temporários + ${gastoRealNosPm} normais).`
      );
    } else if (gastoNosTemporarios > 0) {
      setMensagem(
        `Você gastou ${gastoTotal} PM temporários.`
      );
    } else {
      setMensagem(
        `Você gastou ${gastoTotal} PM.`
      );
    }
  }

  function recuperarPm() {
    const qtd = obterQuantidade();
    const maxPm = Math.max(0, numeroSeguro(pm?.max));
    const pmAtual = Math.max(
      0,
      numeroSeguro(pm?.valor)
    );

    if (maxPm <= 0) {
      setMensagem(
        "O PM máximo ainda não foi definido."
      );
      return;
    }

    const novoPm = Math.min(
      maxPm,
      pmAtual + qtd
    );

    const recuperacaoReal = Math.max(
      0,
      novoPm - pmAtual
    );

    onChangePm(novoPm);

    if (recuperacaoReal === 0) {
      setMensagem("Os PM já estão no máximo.");
    } else {
      setMensagem(
        `Você recuperou ${recuperacaoReal} PM.`
      );
    }
  }

  const estiloBotao = cor => ({
    minHeight: 36,
    padding: "6px 4px",
    borderRadius: 5,
    border: `1px solid ${cor}88`,
    background: `${cor}11`,
    color: cor,
    fontFamily: "'Cinzel',serif",
    fontSize: 8,
    letterSpacing: 1,
    cursor: "pointer",
  });

  return (
    <div
      style={{
        marginTop: 4,
        marginBottom: 12,
        padding: "10px 12px",
        borderRadius: 8,
        border: "1px solid #8b5e1a66",
        background:
          "linear-gradient(135deg,#22120066,#180d0066)",
      }}
    >
      <div
        style={{
          fontFamily: "'Cinzel',serif",
          fontSize: 9,
          letterSpacing: 2,
          color: "#c8922a",
          textAlign: "center",
          marginBottom: 8,
        }}
      >
        AÇÕES RÁPIDAS
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          marginBottom: 9,
        }}
      >
        <span
          style={{
            fontFamily: "'Cinzel',serif",
            fontSize: 8,
            letterSpacing: 1,
            color: "#7a5020",
          }}
        >
          QUANTIDADE
        </span>

        <input
          type="number"
          min="1"
          max="999"
          value={quantidade}
          onChange={e =>
            setQuantidade(
              e.target.value === ""
                ? ""
                : e.target.value
            )
          }
          onBlur={() => {
            if (
              quantidade === "" ||
              numeroSeguro(quantidade) <= 0
            ) {
              setQuantidade(1);
            }
          }}
          style={{
            width: 64,
            textAlign: "center",
            background: "#0d070088",
            border: "1px solid #8b5e1a55",
            borderRadius: 5,
            color: "#f0d8a0",
            fontFamily: "'Cinzel',serif",
            fontSize: 13,
            padding: "6px 4px",
            outline: "none",
            boxSizing: "border-box",
          }}
          onFocus={e =>
            e.target.style.borderColor = "#e8a020"
          }
        />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 6,
        }}
      >
        <button
          onClick={aplicarDano}
          style={estiloBotao("#e06060")}
        >
          APLICAR DANO
        </button>

        <button
          onClick={curarPv}
          style={estiloBotao("#7ec87e")}
        >
          CURAR PV
        </button>

        <button
          onClick={gastarPm}
          style={estiloBotao("#6090e0")}
        >
          GASTAR PM
        </button>

        <button
          onClick={recuperarPm}
          style={estiloBotao("#80b0e0")}
        >
          RECUPERAR PM
        </button>
      </div>

      <div
        style={{
          marginTop: 8,
          fontFamily: "'Cinzel',serif",
          fontSize: 8,
          lineHeight: 1.5,
          textAlign: "center",
          color: "#7a5020",
        }}
      >
        Dano e gasto de PM consomem os temporários primeiro.
      </div>

      {mensagem && (
        <div
          style={{
            marginTop: 8,
            paddingTop: 7,
            borderTop: "1px solid #3a2a10",
            fontFamily: "'Cinzel',serif",
            fontSize: 8,
            lineHeight: 1.5,
            textAlign: "center",
            color: "#c8922a",
          }}
        >
          {mensagem}
        </div>
      )}
    </div>
  );
}
function Barra({ label, icone, valor, max, gradA, gradB, onChange, allowNegative, showStatus, livre, maxAutomatico }) {

  const maxConvertido = Number(max);
  const maxNumero = Number.isFinite(maxConvertido)
    ? Math.max(0, maxConvertido)
    : 0;

  const valorConvertido = Number(valor);
  const valorNumero = Number.isFinite(valorConvertido)
    ? valorConvertido
    : 0;

  // Usado apenas para calcular a largura visual da barra.
  // Assim, nunca haverá divisão por zero.
  const maxSeguro = Math.max(1, maxNumero);

  const limiteNeg = allowNegative
    ? Math.min(-10, -Math.floor(maxNumero / 2))
    : 0;

  const morto = allowNegative && valorNumero <= limiteNeg;

  const inconsciente =
    allowNegative &&
    valorNumero < 0 &&
    !morto;

  const temMaximo = maxNumero > 0;

  const definirValor = v => {
    const novo = livre ? Math.max(0, v) : Math.max(limiteNeg, Math.min(maxNumero, v));
    onChange("valor", novo);
    if (livre && novo > maxNumero) onChange("max", novo);
  };
  
  const critico =
    temMaximo &&
    !inconsciente &&
    !morto &&
    valorNumero <= Math.floor(maxNumero * 0.25) &&
    valorNumero >= 0;

  const ferido =
    temMaximo &&
    !inconsciente &&
    !morto &&
    valorNumero <= Math.floor(maxNumero * 0.50) &&
    valorNumero > Math.floor(maxNumero * 0.25);

  let bA = gradA;
  let bB = gradB;
  let glow = "#e0202033";

  if (morto) {
    bA = "#1a1a2e";
    bB = "#0d0d1a";
    glow = "#6060c044";
  } else if (inconsciente) {
    bA = "#4a1a6a";
    bB = "#2a0d3a";
    glow = "#a060e044";
  } else if (critico) {
    bA = "#c02020";
    bB = "#601010";
    glow = "#e0202066";
  } else if (ferido) {
    bA = "#c87020";
    bB = "#6a3a10";
    glow = "#e8902044";
  }

  const pct = morto
    ? 100
    : valorNumero < 0 && limiteNeg < 0
      ? Math.max(
          0,
          Math.min(100, (valorNumero / limiteNeg) * 100)
        )
      : Math.max(
          0,
          Math.min(100, (valorNumero / maxSeguro) * 100)
        );

  const status = morto
    ? { texto: "💀 MORTO", cor: "#9060c0" }
    : inconsciente
      ? { texto: "😵 INCONSCIENTE", cor: "#a060e0" }
      : !temMaximo
        ? { texto: "✦ SEM MÁXIMO", cor: "#7a5020" }
        : critico
          ? { texto: "🩸 CRÍTICO", cor: "#e06060" }
          : ferido
            ? { texto: "⚠️ FERIDO", cor: "#e8a020" }
            : { texto: "✦ SAUDÁVEL", cor: "#7ec87e" };

  const corBorda = morto
    ? "#6030a0"
    : inconsciente
      ? "#8040c0"
      : "#8b5e1a";

  const corTexto = morto
    ? "#9060c0"
    : inconsciente
      ? "#c080ff"
      : "#f0d8a0";

  return (
    <div
      style={{
        ...s.barraWrap,
        border: `1px solid ${
          morto
            ? "#6030a0"
            : inconsciente
              ? "#8040c0"
              : "#8b5e1a33"
        }`,
        borderRadius: 10,
        padding: "10px 12px",
        background: morto
          ? "linear-gradient(135deg,#1a0d2a88,#0d070088)"
          : inconsciente
            ? "linear-gradient(135deg,#2a0d3a88,#1a0a2888)"
            : "transparent",
        transition: "all 0.4s ease",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 6,
        }}
      >
        <span
          style={{
            fontFamily: "'Cinzel',serif",
            fontSize: 11,
            letterSpacing: 2,
            color: "#c8922a",
          }}
        >
          {icone} {label}
        </span>

        {showStatus && (
          <span
            style={{
              fontFamily: "'Cinzel',serif",
              fontSize: 9,
              letterSpacing: 2,
              color: status.cor,
              textShadow: `0 0 8px ${status.cor}88`,
              animation:
                morto || critico
                  ? "pvPulse 1.5s ease-in-out infinite"
                  : "none",
            }}
          >
            {status.texto}
          </span>
        )}
      </div>

      <div
        style={{
          ...s.barraFundo,
          boxShadow: morto
            ? "0 0 10px #6030a066"
            : inconsciente
              ? "0 0 8px #8040c044"
              : "none",
          transition: "box-shadow 0.4s ease",
        }}
      >
        <div
          style={{
            ...s.barraFill,
            width: `${pct}%`,
            background: `linear-gradient(90deg,${bB},${bA})`,
            boxShadow: pct > 0 ? `0 0 6px ${glow}` : "none",
          }}
        />
        <div style={s.barraGlow} />
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: 8,
          gap: 6,
        }}
      >
        {allowNegative && (
          <span
            style={{
              fontFamily: "'Cinzel',serif",
              fontSize: 9,
              letterSpacing: 1,
              color: "#6030a0",
              whiteSpace: "nowrap",
            }}
          >
            💀 {limiteNeg}
          </span>
        )}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 5,
            margin: "0 auto",
          }}
        >
          <button
            style={s.btnBarra}
            onClick={() =>
              definirValor(valorNumero - 1)
            }
          >
            −
          </button>

          <input
            type="number"
            value={
              valor === ""
                ? ""
                : valor ?? 0
            }
            onChange={e => {
              const texto = e.target.value;

              // Permite apagar o conteúdo enquanto o usuário digita.
              if (texto === "") {
                onChange("valor", "");
                return;
              }

              const v = Number(texto);

              if (!Number.isFinite(v)) return;

              definirValor(v);

            }}
            onBlur={e => {
              e.target.style.borderColor = corBorda;

              // Se o campo ficou vazio, volta para zero ao sair dele.
              if (
                valor === "" ||
                valor === null ||
                valor === undefined
              ) {
                onChange("valor", 0);
              }
            }}
            style={{
              width: 56,
              textAlign: "center",
              background: "#0d070088",
              border: `1px solid ${corBorda}`,
              borderRadius: 5,
              color: corTexto,
              fontFamily: "'Cinzel Decorative','Cinzel',serif",
              fontSize: 16,
              fontWeight: 900,
              padding: "3px 4px",
              outline: "none",
              transition: "border-color 0.3s, color 0.3s",
            }}
            onFocus={e => {
              e.target.style.borderColor = "#e8a020";
            }}
          />

          <span
            style={{
              fontFamily: "'Cinzel',serif",
              fontSize: 12,
              color: "#7a5020",
            }}
          >
            / {maxNumero}
          </span>

          <button
            style={s.btnBarra}
            onClick={() =>
              definirValor(valorNumero + 1)
            }
          >
            +
          </button>
        </div>

      {!maxAutomatico && (

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          <button
            style={s.btnBarra}
            onClick={() =>
              onChange(
                "max",
                Math.max(0, maxNumero - 1)
              )
            }
          >
            −MÁX
          </button>

          <button
            style={s.btnBarra}
            onClick={() =>
              onChange("max", maxNumero + 1)
            }
          >
            +MÁX
          </button>
        </div>
        )}
      </div>
    </div>
  );
}

function RoladorDados({ onClose }) {
  const [quantidade, setQuantidade] = useState(1);
  const [faces, setFaces] = useState(20);
  const [modificador, setModificador] = useState(0);
  const [resultado, setResultado] = useState(null);
  const [historico, setHistorico] = useState([]);

  const tiposDeDado = [4, 6, 8, 10, 12, 20, 100];

  const textoModificador = valor => {
    if (valor > 0) return `+ ${valor}`;
    if (valor < 0) return `− ${Math.abs(valor)}`;
    return "";
  };

  function rolarDados() {
    const qtd = Math.min(
      20,
      Math.max(1, parseInt(quantidade, 10) || 1)
    );

    const lados = Math.max(
      2,
      parseInt(faces, 10) || 20
    );

    const mod = parseInt(modificador, 10) || 0;

    const valores = Array.from(
      { length: qtd },
      () => Math.floor(Math.random() * lados) + 1
    );

    const somaDados = valores.reduce(
      (soma, valor) => soma + valor,
      0
    );

    const novoResultado = {
      id: Date.now() + Math.random(),
      quantidade: qtd,
      lados,
      modificador: mod,
      valores,
      soma: somaDados,
      total: somaDados + mod,
    };

    setResultado(novoResultado);
    setHistorico(lista => [
      novoResultado,
      ...lista,
    ].slice(0, 8));

    // Mantém os campos corrigidos após a rolagem.
    setQuantidade(qtd);
    setFaces(lados);
    setModificador(mod);
  }

  const labelRolador = {
    display: "block",
    marginBottom: 4,
    fontFamily: "'Cinzel',serif",
    fontSize: 9,
    letterSpacing: 2,
    color: "#7a5020",
    textTransform: "uppercase",
  };

  const inputRolador = {
    background: "#0d070088",
    border: "1px solid #8b5e1a55",
    borderRadius: 5,
    color: "#f0d8a0",
    fontFamily: "'Cinzel',serif",
    fontSize: 14,
    padding: "7px 8px",
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
    textAlign: "center",
  };

  const botaoDado = ativo => ({
    flex: "1 1 20%",
    minWidth: 48,
    padding: "7px 4px",
    borderRadius: 6,
    border: `1px solid ${ativo ? "#c8922a" : "#3a2a10"}`,
    background: ativo ? "#c8922a22" : "transparent",
    color: ativo ? "#e8a020" : "#7a5020",
    fontFamily: "'Cinzel',serif",
    fontSize: 10,
    fontWeight: ativo ? 700 : 400,
    cursor: "pointer",
  });

  return (
    <Modal
      titulo="🎲 Rolador de Dados"
      onClose={onClose}
    >
      <div
        style={{
          fontFamily: "'Cinzel',serif",
          fontSize: 9,
          lineHeight: 1.6,
          color: "#7a5020",
          textAlign: "center",
          marginBottom: 14,
        }}
      >
        Escolha os dados, adicione um modificador e role.
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 10,
          marginBottom: 14,
        }}
      >
        <div>
          <label style={labelRolador}>
            Quantidade
          </label>

          <input
            type="number"
            min="1"
            max="20"
            value={quantidade}
            onChange={e =>
              setQuantidade(
                e.target.value === ""
                  ? ""
                  : e.target.value
              )
            }
            style={inputRolador}
            onFocus={e =>
              e.target.style.borderColor = "#e8a020"
            }
            onBlur={e =>
              e.target.style.borderColor = "#8b5e1a55"
            }
          />
        </div>

        <div>
          <label style={labelRolador}>
            Modificador
          </label>

          <input
            type="number"
            value={modificador}
            onChange={e =>
              setModificador(
                e.target.value === ""
                  ? ""
                  : e.target.value
              )
            }
            placeholder="0"
            style={inputRolador}
            onFocus={e =>
              e.target.style.borderColor = "#e8a020"
            }
            onBlur={e =>
              e.target.style.borderColor = "#8b5e1a55"
            }
          />
        </div>
      </div>

      <div style={{ marginBottom: 14 }}>
        <label style={labelRolador}>
          Tipo de dado
        </label>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 5,
          }}
        >
          {tiposDeDado.map(tipo => (
            <button
              key={tipo}
              onClick={() => setFaces(tipo)}
              style={botaoDado(faces === tipo)}
            >
              d{tipo}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={rolarDados}
        style={{
          width: "100%",
          padding: "11px 0",
          borderRadius: 6,
          border: "1px solid #c8922a",
          background:
            "linear-gradient(180deg,#5a3200,#3a1e00)",
          color: "#e8a020",
          fontFamily: "'Cinzel',serif",
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: 3,
          cursor: "pointer",
        }}
      >
        🎲 ROLAR DADOS
      </button>

      {resultado && (
        <div
          style={{
            marginTop: 16,
            padding: "14px 12px",
            borderRadius: 8,
            border: "1px solid #c8922a",
            background:
              "linear-gradient(135deg,#2a180088,#180d0088)",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontFamily: "'Cinzel',serif",
              fontSize: 9,
              letterSpacing: 2,
              color: "#c8922a",
              marginBottom: 5,
            }}
          >
            RESULTADO
          </div>

          <div
            style={{
              fontFamily:
                "'Cinzel Decorative','Cinzel',serif",
              fontSize: 38,
              fontWeight: 900,
              color: "#e8a020",
              lineHeight: 1.1,
              textShadow: "0 0 12px #e8a02066",
            }}
          >
            {resultado.total}
          </div>

          <div
            style={{
              marginTop: 8,
              fontFamily: "'Cinzel',serif",
              fontSize: 10,
              color: "#c8a060",
              lineHeight: 1.6,
            }}
          >
            {resultado.quantidade}d{resultado.lados}
            {resultado.modificador !== 0 &&
              ` ${textoModificador(resultado.modificador)}`}
            {" = "}
            {resultado.valores.join(" + ")}
            {resultado.modificador !== 0 &&
              ` ${textoModificador(resultado.modificador)}`}
          </div>

          <div
            style={{
              marginTop: 5,
              fontFamily: "'Cinzel',serif",
              fontSize: 9,
              color: "#7a5020",
            }}
          >
            Soma dos dados: {resultado.soma}
          </div>
        </div>
      )}

      {historico.length > 0 && (
        <div style={{ marginTop: 16 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 7,
            }}
          >
            <span
              style={{
                fontFamily: "'Cinzel',serif",
                fontSize: 9,
                letterSpacing: 2,
                color: "#7a5020",
              }}
            >
              ÚLTIMAS ROLAGENS
            </span>

            <button
              onClick={() => {
                setHistorico([]);
                setResultado(null);
              }}
              style={{
                padding: "3px 7px",
                borderRadius: 4,
                border: "1px solid #3a2a10",
                background: "transparent",
                color: "#7a5020",
                fontFamily: "'Cinzel',serif",
                fontSize: 8,
                letterSpacing: 1,
                cursor: "pointer",
              }}
            >
              LIMPAR
            </button>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 5,
            }}
          >
            {historico.map(rolagem => (
              <div
                key={rolagem.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "6px 9px",
                  borderRadius: 5,
                  background: "#0d070088",
                  border: "1px solid #3a2a10",
                }}
              >
                <span
                  style={{
                    fontFamily: "'Cinzel',serif",
                    fontSize: 10,
                    color: "#c8a060",
                  }}
                >
                  {rolagem.quantidade}d{rolagem.lados}
                  {rolagem.modificador !== 0 &&
                    ` ${rolagem.modificador > 0 ? "+" : ""}${rolagem.modificador}`}
                </span>

                <strong
                  style={{
                    fontFamily:
                      "'Cinzel Decorative','Cinzel',serif",
                    fontSize: 16,
                    color: "#e8a020",
                  }}
                >
                  {rolagem.total}
                </strong>
              </div>
            ))}
          </div>
        </div>
      )}
    </Modal>
  );
}

function TelaCarregando() {
  return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(160deg,#1c0e00 0%,#140a00 50%,#0d0700 100%)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", fontFamily:"'Cinzel',serif" }}>
      <style>{`@keyframes giraSelo{from{transform:rotate(0deg)}to{transform:rotate(360deg)}} @keyframes fadeIn{from{opacity:0}to{opacity:1}}`}</style>
      <div style={{ animation:"giraSelo 1.8s linear infinite", fontSize:48, marginBottom:24 }}>⚔</div>
      <div style={{ fontFamily:"'Cinzel Decorative','Cinzel',serif", fontSize:14, letterSpacing:4, color:"#e8a020", textShadow:"0 0 18px #e8a02066", animation:"fadeIn 0.6s ease" }}>CARREGANDO FICHA...</div>
    </div>
  );
}

function CartaoPerfil({ perfil, onEntrar, onDeletar }) {
  const [fichaPerfil, setFichaPerfil] = useState(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(`t20:ficha:${perfil}`);

      if (!raw) {
        setFichaPerfil(null);
        return;
      }

      const dados = JSON.parse(raw);

      if (
        dados &&
        typeof dados === "object" &&
        !Array.isArray(dados)
      ) {
        setFichaPerfil(dados);
      } else {
        setFichaPerfil(null);
      }
    } catch {
      setFichaPerfil(null);
    }
  }, [perfil]);

  const classes = Array.isArray(fichaPerfil?.classes)
    ? fichaPerfil.classes
        .filter(cl => cl?.nome)
        .map(cl => `${cl.nome} ${cl.nivel || 1}`)
        .join(" / ")
    : fichaPerfil?.classe
      ? `${fichaPerfil.classe} ${fichaPerfil.nivel || 1}`
      : "";

  const nivel = fichaPerfil?.nivel || 1;

  const nomePersonagem =
    fichaPerfil?.nome?.trim() || "Personagem sem nome";

  const descricaoPrincipal = [
    fichaPerfil?.raca,
    fichaPerfil?.origem,
  ]
    .filter(Boolean)
    .join(" · ");

  const pvAtual = fichaPerfil?.pv?.valor ?? 0;
  const pvMaximo = fichaPerfil?.pv?.max ?? 0;

  const pmAtual = fichaPerfil?.pm?.valor ?? 0;
  const pmMaximo = fichaPerfil?.pm?.max ?? 0;

  const possuiFicha = Boolean(
    fichaPerfil?.nome ||
    fichaPerfil?.raca ||
    fichaPerfil?.origem ||
    fichaPerfil?.classe ||
    fichaPerfil?.classes?.some(cl => cl?.nome)
  );

  return (
    <div
      className="cartao-perfil"
      onClick={() => onEntrar(perfil)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "10px 12px",
        marginBottom: 7,
        borderRadius: 8,
        background:
          "linear-gradient(135deg,#2a150088,#180d0088)",
        border: "1px solid #8b5e1a55",
        cursor: "pointer",
        transition:
          "border-color 0.2s, background 0.2s, transform 0.2s",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = "#c8922a";
        e.currentTarget.style.background =
          "linear-gradient(135deg,#3a2000aa,#1c0e00aa)";
        e.currentTarget.style.transform = "translateY(-1px)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = "#8b5e1a55";
        e.currentTarget.style.background =
          "linear-gradient(135deg,#2a150088,#180d0088)";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      {/* Avatar provisório */}
      <div
        style={{
          width: 48,
          height: 48,
          flexShrink: 0,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(135deg,#5a3200,#1c0e00)",
          border: "1px solid #c8922a",
          fontSize: 23,
          overflow: "hidden",
        }}
      >
        {fichaPerfil?.avatar?.imagem ? (
          <img
            src={fichaPerfil.avatar.imagem}
            alt={`Avatar de ${nomePersonagem}`}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        ) : (
          "⚔"
        )}
      </div>

      {/* Dados principais */}
      <div
        style={{
          flex: 1,
          minWidth: 0,
        }}
      >
        <div
          style={{
            fontFamily: "'Cinzel',serif",
            fontSize: 13,
            fontWeight: 700,
            color: "#e8a020",
            overflowWrap: "anywhere",
          }}
        >
          {nomePersonagem}
        </div>

        <div
          style={{
            marginTop: 3,
            fontFamily: "'IM Fell English',Georgia,serif",
            fontSize: 12,
            color: "#c8a060",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {descricaoPrincipal || "Raça e origem não definidas"}
        </div>

        <div
          style={{
            marginTop: 3,
            fontFamily: "'Cinzel',serif",
            fontSize: 8,
            letterSpacing: 0.7,
            color: "#7a5020",
            lineHeight: 1.5,
          }}
        >
          {classes || "Classe não definida"}
          {" · "}
          Nível {nivel}
        </div>

        {possuiFicha ? (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 10,
              marginTop: 4,
              fontFamily: "'Cinzel',serif",
              fontSize: 8,
              color: "#7a5020",
            }}
          >
            <span>
              🩸 PV {pvAtual}/{pvMaximo}
            </span>

            <span>
              🔮 PM {pmAtual}/{pmMaximo}
            </span>
          </div>
        ) : (
          <div
            style={{
              marginTop: 4,
              fontFamily: "'Cinzel',serif",
              fontSize: 8,
              color: "#7a5020",
              fontStyle: "italic",
            }}
          >
            Ficha ainda não preenchida
          </div>
        )}

        {/* Identificador do perfil usado no armazenamento */}
        <div
          style={{
            marginTop: 4,
            fontFamily: "'Cinzel',serif",
            fontSize: 7,
            color: "#4f3518",
          }}
        >
          Perfil: {perfil}
        </div>
      </div>

      {/* Botão de apagar */}
      <button
        onClick={e => onDeletar(perfil, e)}
        title={`Apagar perfil ${perfil}`}
        aria-label={`Apagar perfil ${perfil}`}
        style={{
          width: 28,
          height: 28,
          flexShrink: 0,
          borderRadius: 5,
          border: "1px solid #5a1a1a",
          background: "#2a0d0d88",
          color: "#e06060",
          cursor: "pointer",
          fontSize: 12,
        }}
      >
        ✕
      </button>
    </div>
  );
}

function AvatarFicha({ imagem, nome, onChange }) {
  const arquivoRef = useRef(null);
  const [processando, setProcessando] = useState(false);
  const [erro, setErro] = useState("");

  function selecionarArquivo(e) {
    const arquivo = e.target.files?.[0];

    if (!arquivo) return;

    setErro("");

    if (!arquivo.type.startsWith("image/")) {
      setErro("Selecione um arquivo de imagem.");
      e.target.value = "";
      return;
    }

    const limiteBytes = 8 * 1024 * 1024;

    if (arquivo.size > limiteBytes) {
      setErro("A imagem deve ter no máximo 8 MB.");
      e.target.value = "";
      return;
    }

    setProcessando(true);

    const leitor = new FileReader();

    leitor.onload = evento => {
      const imagemOriginal = new Image();

      imagemOriginal.onload = () => {
        const tamanhoMaximo = 256;

        const maiorDimensao = Math.max(
          imagemOriginal.width,
          imagemOriginal.height
        );

        const escala =
          maiorDimensao > tamanhoMaximo
            ? tamanhoMaximo / maiorDimensao
            : 1;

        const largura = Math.max(
          1,
          Math.round(imagemOriginal.width * escala)
        );

        const altura = Math.max(
          1,
          Math.round(imagemOriginal.height * escala)
        );

        const canvas = document.createElement("canvas");
        canvas.width = largura;
        canvas.height = altura;

        const contexto = canvas.getContext("2d");

        if (!contexto) {
          setErro("Não foi possível processar a imagem.");
          setProcessando(false);
          return;
        }

        contexto.drawImage(
          imagemOriginal,
          0,
          0,
          largura,
          altura
        );

        const imagemComprimida = canvas.toDataURL(
          "image/jpeg",
          0.82
        );

        onChange(imagemComprimida);
        setProcessando(false);
      };

      imagemOriginal.onerror = () => {
        setErro("Não foi possível abrir essa imagem.");
        setProcessando(false);
      };

      imagemOriginal.src = evento.target.result;
    };

    leitor.onerror = () => {
      setErro("Não foi possível ler o arquivo.");
      setProcessando(false);
    };

    leitor.readAsDataURL(arquivo);

    // Permite selecionar novamente o mesmo arquivo.
    e.target.value = "";
  }

  function removerImagem() {
    setErro("");
    onChange("");
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 7,
      }}
    >
      <div
        style={{
          width: 92,
          height: 92,
          borderRadius: "50%",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(135deg,#5a3200,#1c0e00)",
          border: "2px solid #c8922a",
          color: "#e8a020",
          fontSize: 38,
          boxShadow: "0 0 14px #c8922a44",
        }}
      >
        {imagem ? (
          <img
            src={imagem}
            alt={`Avatar de ${nome || "personagem"}`}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        ) : (
          "⚔"
        )}
      </div>

      <input
        ref={arquivoRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        onChange={selecionarArquivo}
        style={{ display: "none" }}
      />

      <button
        type="button"
        onClick={() => arquivoRef.current?.click()}
        disabled={processando}
        style={{
          padding: "5px 9px",
          borderRadius: 5,
          border: "1px solid #8b5e1a",
          background: "linear-gradient(180deg,#3a1e00,#1c0e00)",
          color: "#c8922a",
          fontFamily: "'Cinzel',serif",
          fontSize: 8,
          letterSpacing: 1,
          cursor: processando ? "wait" : "pointer",
          opacity: processando ? 0.6 : 1,
        }}
      >
        {processando ? "PROCESSANDO..." : "📷 ALTERAR FOTO"}
      </button>

      {imagem && !processando && (
        <button
          type="button"
          onClick={removerImagem}
          style={{
            padding: "3px 7px",
            borderRadius: 4,
            border: "1px solid #5a1a1a",
            background: "transparent",
            color: "#e06060",
            fontFamily: "'Cinzel',serif",
            fontSize: 8,
            letterSpacing: 1,
            cursor: "pointer",
          }}
        >
          REMOVER FOTO
        </button>
      )}

      {erro && (
        <div
          style={{
            maxWidth: 150,
            fontFamily: "'Cinzel',serif",
            fontSize: 8,
            lineHeight: 1.4,
            textAlign: "center",
            color: "#e06060",
          }}
        >
          {erro}
        </div>
      )}
    </div>
  );
}

function TelaPerfil({ onEntrar }) {
  
  const [nome, setNome] = useState("");
  const [erro, setErro] = useState("");
  const [mensagemBackup, setMensagemBackup] = useState("");
  const arquivoBackupRef = useRef(null);

  const [perfis, setPerfis] = useState(() => {
    try {
      const lista = JSON.parse(localStorage.getItem("t20:perfis") || "[]");
      return Array.isArray(lista) ? lista : [];
      
    } catch {
      return [];
    }
  });

  function criarPerfil() {
    const n = nome.trim();

    if (!n) {
      setErro("Digite um nome para o perfil.");
      return;
    }

    if (perfis.includes(n)) {
      setErro("Esse nome já existe. Selecione o perfil abaixo.");
      return;
    }

    const novos = [...perfis, n];

    localStorage.setItem("t20:perfis", JSON.stringify(novos));

    setPerfis(novos);
    setNome("");
    setErro("");
    setMensagemBackup("");

    onEntrar(n);
  }

  function deletarPerfil(p, e) {
    e.stopPropagation();

    if (!confirm(`Apagar perfil "${p}"?`)) return;

    localStorage.removeItem(`t20:ficha:${p}`);

    const novos = perfis.filter(x => x !== p);

    localStorage.setItem("t20:perfis", JSON.stringify(novos));

    setPerfis(novos);
    setMensagemBackup("");
  }

  function exportarBackup() {
    if (perfis.length === 0) {
      setMensagemBackup("Não há perfis para exportar.");
      return;
    }

    const fichas = {};

    perfis.forEach(perfil => {
      const raw = localStorage.getItem(`t20:ficha:${perfil}`);

      if (!raw) return;

      try {
        fichas[perfil] = JSON.parse(raw);
      } catch {
        // Se uma ficha estiver corrompida, ela não será incluída no backup.
      }
    });

    const backup = {
      tipo: "t20-ficha-backup",
      versao: 1,
      criadoEm: new Date().toISOString(),
      perfis,
      fichas,
    };

    const conteudo = JSON.stringify(backup, null, 2);
    const arquivo = new Blob([conteudo], {
      type: "application/json",
    });

    const url = URL.createObjectURL(arquivo);
    const link = document.createElement("a");

    link.href = url;
    link.download = `backup-t20-${new Date().toISOString().slice(0, 10)}.json`;

    document.body.appendChild(link);
    link.click();
    link.remove();

    setTimeout(() => URL.revokeObjectURL(url), 1000);

    setMensagemBackup(
      `Backup exportado com ${perfis.length} perfil${perfis.length === 1 ? "" : "is"}.`
    );
  }

  function importarBackup(e) {
    const campoArquivo = e.target;
    const arquivo = campoArquivo.files?.[0];

    if (!arquivo) return;

    const leitor = new FileReader();

    leitor.onload = evento => {
      try {
        const backup = JSON.parse(evento.target.result);

        const perfisImportados = Array.isArray(backup?.perfis)
          ? [
              ...new Set(
                backup.perfis
                  .filter(perfil => typeof perfil === "string")
                  .map(perfil => perfil.trim())
                  .filter(Boolean)
              ),
            ]
          : [];

        const fichasImportadas = backup?.fichas;

        const formatoValido =
          backup?.tipo === "t20-ficha-backup" &&
          backup?.versao === 1 &&
          perfisImportados.length > 0 &&
          fichasImportadas &&
          typeof fichasImportadas === "object" &&
          !Array.isArray(fichasImportadas);

        if (!formatoValido) {
          throw new Error("Arquivo de backup inválido.");
        }

        const confirmou = confirm(
          "Restaurar este backup?\n\n" +
          "Os perfis atuais deste navegador serão substituídos. " +
          "Essa ação não pode ser desfeita."
        );

        if (!confirmou) return;

        // Remove as fichas atualmente salvas.
        perfis.forEach(perfil => {
          localStorage.removeItem(`t20:ficha:${perfil}`);
        });

        // Salva a nova lista de perfis.
        localStorage.setItem(
          "t20:perfis",
          JSON.stringify(perfisImportados)
        );

        // Salva cada ficha que existir dentro do backup.
        perfisImportados.forEach(perfil => {
          const dadosFicha = fichasImportadas[perfil];

          if (
            dadosFicha &&
            typeof dadosFicha === "object" &&
            !Array.isArray(dadosFicha)
          ) {
            localStorage.setItem(
              `t20:ficha:${perfil}`,
              JSON.stringify(normalizarFicha(dadosFicha))
            );
          }
        });

        setPerfis(perfisImportados);
        setNome("");
        setErro("");

        setMensagemBackup(
          `Backup restaurado com ${perfisImportados.length} perfil${
            perfisImportados.length === 1 ? "" : "is"
          }.`
        );
      } catch {
        setMensagemBackup(
          "Não foi possível importar. Escolha um arquivo de backup do T20 criado por este aplicativo."
        );
      } finally {
        campoArquivo.value = "";
      }
    };

    leitor.onerror = () => {
      setMensagemBackup("Não foi possível ler o arquivo selecionado.");
      campoArquivo.value = "";
    };

    leitor.readAsText(arquivo);
  }

  return (
    <>
      <style>
        {`
          .gradePerfis {
            display: grid;
            grid-template-columns: 1fr;
            gap: 7px;
          }

          .gradePerfis > * {
            margin-bottom: 0 !important;
          }

          .acoesPerfil {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 8px;
          }

          @media (min-width: 700px) {
            .gradePerfis {
              grid-template-columns: repeat(2, minmax(0, 1fr));
            }

            .cartao-perfil {
              min-height: 118px;
            }

            .formNovoPerfil {
              display: grid;
              grid-template-columns: 1fr auto;
              gap: 8px;
              align-items: start;
            }

            .formNovoPerfil button {
              width: 190px;
            }
          }

          @media (max-width: 420px) {
            .acoesPerfil {
              grid-template-columns: 1fr;
            }
          }
        `}
      </style>
    <div
style={{
minHeight: "100vh",
background: "linear-gradient(160deg,#1c0e00 0%,#140a00 50%,#0d0700 100%)",
display: "flex",
flexDirection: "column",
alignItems: "center",
justifyContent: "center",
padding: 24,
fontFamily: "'Cinzel',serif",
}}
>
<div style={{ textAlign: "center",marginBottom: 28 }}>
<div
style={{
fontFamily: "'Cinzel Decorative','Cinzel',serif",
fontSize: 22,
fontWeight: 900,
letterSpacing: 4,
color: "#e8a020",
textShadow: "0 0 18px #e8a02066,0 2px 4px #000",
}}
>
⚔ TORMENTA 20 ⚔
</div>

<div
style={{
fontSize: 9,
letterSpacing: 5,
color: "#7a5020",
marginTop: 4,
}}
>
FICHA DE PERSONAGEM
</div>
</div>

<div
style={{
width: "100%",
maxWidth: 720,
background: "linear-gradient(135deg,#22120088,#180d0088)",
border: "1px solid #8b5e1a",
borderRadius: 10,
padding: "22px 20px",
boxShadow: "0 4px 24px #00000088",
boxSizing: "border-box",
}}
>
{perfis.length>0&&(
<>
<div
style={{
fontSize: 10,
letterSpacing: 3,
color: "#c8922a",
marginBottom: 10,
}}
>
PERFIS SALVOS
</div>

<div className="gradePerfis">
{perfis.map(perfil => (
<CartaoPerfil
key={perfil}
perfil={perfil}
onEntrar={onEntrar}
onDeletar={deletarPerfil} />
))}
</div>

<div
style={{
borderTop: "1px solid #3a2a10",
margin: "16px 0 14px",
}} />
</>
)}

<div
style={{
fontSize: 10,
letterSpacing: 3,
color: "#c8922a",
marginBottom: 10,
}}
>
{perfis.length===0? "CRIAR PERFIL":"NOVO PERFIL"}
</div>

<div className="formNovoPerfil">
<div>
<input
style={{
...sLogin.input,
marginBottom: 10,
}}
value={nome}
placeholder="Nome do personagem..."
onChange={e => {
setNome(e.target.value);
setErro("");
} }
onFocus={e => (e.target.style.borderColor="#e8a020")}
onBlur={e => (e.target.style.borderColor="#8b5e1a")}
onKeyDown={e => e.key==="Enter"&&criarPerfil()} />

{erro&&(
<div
style={{
fontSize: 11,
color: "#e06060",
marginBottom: 10,
}}
>
{erro}
</div>
)}
</div>

<button
onClick={criarPerfil}
style={sLogin.btnEntrar}
>
⚔ CRIAR E ENTRAR
</button>
</div>

<div
style={{
marginTop: 16,
paddingTop: 14,
borderTop: "1px solid #3a2a10",
}}
>
<div
style={{
fontSize: 9,
letterSpacing: 2,
color: "#c8922a",
marginBottom: 8,
textAlign: "center",
}}
>
BACKUP DOS PERSONAGENS
</div>

<div className="acoesPerfil">
<button
onClick={exportarBackup}
disabled={perfis.length===0}
style={{
padding: "8px 4px",
borderRadius: 6,
border: "1px solid #8b5e1a",
background: "linear-gradient(180deg,#2a1800,#1a0e00)",
color: "#c8922a",
fontFamily: "'Cinzel',serif",
fontSize: 10,
letterSpacing: 1,
cursor: perfis.length===0? "not-allowed":"pointer",
opacity: perfis.length===0? 0.45:1,
}}
>
⬆ EXPORTAR
</button>

<button
onClick={() => arquivoBackupRef.current?.click()}
style={{
padding: "8px 4px",
borderRadius: 6,
border: "1px solid #8b5e1a",
background: "linear-gradient(180deg,#2a1800,#1a0e00)",
color: "#c8922a",
fontFamily: "'Cinzel',serif",
fontSize: 10,
letterSpacing: 1,
cursor: "pointer",
}}
>
⬇ IMPORTAR
</button>
</div>

<input
ref={arquivoBackupRef}
type="file"
accept=".json,application/json"
onChange={importarBackup}
style={{ display: "none" }} />

{mensagemBackup&&(
<div
style={{
marginTop: 9,
fontFamily: "'Cinzel',serif",
fontSize: 9,
lineHeight: 1.5,
textAlign: "center",
color: mensagemBackup.startsWith("Backup")
? "#7ec87e"
: "#e06060",
}}
>
{mensagemBackup}
</div>
)}

<div
style={{
marginTop: 8,
fontFamily: "'Cinzel',serif",
fontSize: 8,
lineHeight: 1.5,
textAlign: "center",
color: "#7a5020",
}}
>
O backup contém todos os perfis salvos neste navegador.
</div>
</div>
</div>
</div></>
  );
}
// ═══════════════════════════════════════════════════
// PARTE 2/3 — Poderes, Condições, Magias
// ═══════════════════════════════════════════════════

// ─── CARD PODER ──────────────────────────────────────────────────────────────

function CardPoder({ poder, onUpdate, onRemove, onMover, podeSubir, podeDescer }) {
  const [expandido, setExpandido] = useState(false);
  const [editando,  setEditando]  = useState(poder.nome === "");
  const cat = CATEGORIAS_PODER.find(c => c.id === poder.categoria) || CATEGORIAS_PODER[4];

  const [erroNome, setErroNome] = useState("");

  if (editando) return (
    <div style={{ borderRadius:8, border:`1px solid ${cat.cor}88`, background:`linear-gradient(135deg,${cat.corBg}cc,#0d070088)`, padding:"12px 12px 10px", marginBottom:8 }}>
      <div style={{ display:"flex", gap:5, flexWrap:"wrap", marginBottom:10 }}>
        {CATEGORIAS_PODER.map(c => (
          <button key={c.id} onClick={() => onUpdate({...poder, categoria:c.id})}
            style={{ padding:"3px 9px", borderRadius:12, border:`1px solid ${poder.categoria===c.id?c.cor:"#3a2a10"}`, background:poder.categoria===c.id?`${c.cor}33`:"transparent", color:poder.categoria===c.id?c.cor:"#7a5020", fontFamily:"'Cinzel',serif", fontSize:8, letterSpacing:1, cursor:"pointer" }}>
            {c.icone} {c.label}
          </button>
        ))}
      </div>
      <input autoFocus value={poder.nome} placeholder="Nome do poder..."
        onChange={e => onUpdate({...poder, nome:e.target.value})}
        style={{ ...sCard.input, marginBottom:8, fontFamily:"'Cinzel',serif", fontSize:13, fontWeight:700, color:cat.cor }}
        onFocus={e => e.target.style.borderColor=cat.cor}
        onBlur={e =>  e.target.style.borderColor="#8b5e1a55"}
      />
      <textarea value={poder.descricao} placeholder="Descrição, efeito, custo de PM..." rows={3}
        onChange={e => onUpdate({...poder, descricao:e.target.value})}
        style={{ ...sCard.textarea, marginBottom:10 }}
        onFocus={e => e.target.style.borderColor=cat.cor}
        onBlur={e =>  e.target.style.borderColor="#8b5e1a55"}
      />
      {erroNome && (
  <div style={{ fontFamily:"'Cinzel',serif", fontSize:8, color:"#e06060", marginBottom:6 }}>{erroNome}</div>
)}
<div style={{ display:"flex", gap:6, justifyContent:"flex-end" }}>
  <button onClick={() => onRemove()} style={sCard.btnDanger}>✕ Remover</button>
  <button
    onClick={() => {
      if (!poder.nome.trim()) { setErroNome("Digite um nome para o poder."); return; }
      setErroNome("");
      setEditando(false);
    }}
    style={{ ...sCard.btnSalvar, borderColor:cat.cor, color:cat.cor }}
  >✦ Salvar</button>
</div>

    </div>
  );

  return (
    <div style={{ borderRadius:8, border:`1px solid ${expandido?cat.cor+"88":cat.cor+"33"}`, background:expandido?`linear-gradient(135deg,${cat.corBg}cc,#0d070088)`:`linear-gradient(135deg,${cat.corBg}66,#0d070044)`, marginBottom:8, overflow:"hidden", transition:"all 0.25s ease" }}>
            <div onClick={() => setExpandido(e => !e)} style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 12px", cursor:"pointer" }}>
        <span style={{ padding:"2px 8px", borderRadius:10, background:`${cat.cor}22`, border:`1px solid ${cat.cor}66`, color:cat.cor, fontFamily:"'Cinzel',serif", fontSize:8, letterSpacing:1, whiteSpace:"nowrap", flexShrink:0 }}>{cat.icone} {cat.label}</span>
        <span style={{ flex:1, fontFamily:"'Cinzel',serif", fontSize:12, fontWeight:700, color:"#f0d8a0", letterSpacing:0.5 }}>{poder.nome}</span>
        <div style={{ display:"flex", flexDirection:"column", gap:2, flexShrink:0 }}>
          <button onClick={e => { e.stopPropagation(); onMover(-1); }} disabled={!podeSubir} title="Mover para cima"
            style={{ height:12, width:20, borderRadius:3, border:`1px solid ${cat.cor}44`, background:"#0d070088", color:podeSubir?cat.cor:"#3a2a10", fontSize:9, lineHeight:1, cursor:podeSubir?"pointer":"not-allowed", opacity:podeSubir?1:0.4 }}>▲</button>
          <button onClick={e => { e.stopPropagation(); onMover(1); }} disabled={!podeDescer} title="Mover para baixo"
            style={{ height:12, width:20, borderRadius:3, border:`1px solid ${cat.cor}44`, background:"#0d070088", color:podeDescer?cat.cor:"#3a2a10", fontSize:9, lineHeight:1, cursor:podeDescer?"pointer":"not-allowed", opacity:podeDescer?1:0.4 }}>▼</button>
        </div>
        <span style={{ color:"#7a5020", fontSize:10, transform:expandido?"rotate(180deg)":"rotate(0deg)", transition:"transform 0.2s" }}>▼</span>
      </div>

      {expandido && (
        <div style={{ padding:"0 12px 12px", borderTop:`1px solid ${cat.cor}22` }}>
          {poder.descricao
            ? <p style={{ fontFamily:"'IM Fell English',Georgia,serif", fontSize:13, color:"#c8a060", lineHeight:1.7, margin:"10px 0 12px", whiteSpace:"pre-wrap" }}>{poder.descricao}</p>
            : <p style={{ fontFamily:"'Cinzel',serif", fontSize:10, color:"#3a2a10", margin:"10px 0 12px", fontStyle:"italic" }}>Sem descrição.</p>
          }
          <div style={{ display:"flex", gap:6, justifyContent:"flex-end" }}>
            <button onClick={() => onRemove()} style={sCard.btnDanger}>✕ Remover</button>
            <button onClick={() => setEditando(true)} style={{ ...sCard.btnSalvar, borderColor:cat.cor, color:cat.cor }}>✎ Editar</button>
          </div>
        </div>
      )}
    </div>
  );
}

function SecaoPoderes({ poderes, onAdd, onUpdate, onRemove, onMover }) {
  const [catAtiva, setCatAtiva] = useState(null);
  const filtrados  = catAtiva ? poderes.filter(p => p.categoria===catAtiva) : poderes;
  const contPorCat = CATEGORIAS_PODER.reduce((acc,c) => { acc[c.id]=poderes.filter(p=>p.categoria===c.id).length; return acc; }, {});

  return (
    <Secao icone="✨" titulo="Poderes & Habilidades">
      <div style={{ display:"flex", gap:5, flexWrap:"wrap", marginBottom:12 }}>
        <button onClick={() => setCatAtiva(null)} style={{ padding:"4px 10px", borderRadius:12, border:`1px solid ${catAtiva===null?"#c8922a":"#3a2a10"}`, background:catAtiva===null?"#c8922a22":"transparent", color:catAtiva===null?"#c8922a":"#7a5020", fontFamily:"'Cinzel',serif", fontSize:8, letterSpacing:1, cursor:"pointer" }}>📖 Todos ({poderes.length})</button>
        {CATEGORIAS_PODER.map(c => (
          <button key={c.id} onClick={() => setCatAtiva(catAtiva===c.id?null:c.id)}
            style={{ padding:"4px 10px", borderRadius:12, border:`1px solid ${catAtiva===c.id?c.cor:"#3a2a10"}`, background:catAtiva===c.id?`${c.cor}22`:"transparent", color:catAtiva===c.id?c.cor:"#7a5020", fontFamily:"'Cinzel',serif", fontSize:8, letterSpacing:1, cursor:"pointer" }}>
            {c.icone} {c.label} {contPorCat[c.id]>0&&`(${contPorCat[c.id]})`}
          </button>
        ))}
      </div>
      <DiamondDivider />
      <div style={{ marginTop:10 }}>
        {filtrados.length===0 && <div style={{ textAlign:"center", padding:"24px 0", fontFamily:"'Cinzel',serif", fontSize:10, letterSpacing:2, color:"#3a2a10" }}>Nenhum poder adicionado.</div>}
        {filtrados.map((p, idx) => <CardPoder key={p.id} poder={p} onUpdate={d => onUpdate(p.id,d)} onRemove={() => onRemove(p.id)} onMover={dir => onMover(p.id, dir)} podeSubir={!catAtiva && idx>0} podeDescer={!catAtiva && idx<filtrados.length-1} />)}
      </div>
      <div style={{ marginTop:10, display:"flex", gap:5, flexWrap:"wrap" }}>
        {CATEGORIAS_PODER.map(c => (
          <button key={c.id} onClick={() => onAdd(c.id)}
            style={{ flex:"1 1 auto", padding:"7px 6px", background:"linear-gradient(180deg,#2a1800,#1a0e00)", border:`1px dashed ${c.cor}66`, borderRadius:6, color:c.cor, fontFamily:"'Cinzel',serif", fontSize:8, letterSpacing:1, cursor:"pointer" }}
            onMouseEnter={e => e.currentTarget.style.borderColor=c.cor}
            onMouseLeave={e => e.currentTarget.style.borderColor=`${c.cor}66`}
          >+ {c.label}</button>
        ))}
      </div>
    </Secao>
  );
}

// ─── CONDIÇÕES ───────────────────────────────────────────────────────────────

function CardCondicao({ cond, rodadaAtual, onRemove, onChangeName, onChange, ocupadas = [] }) {

  const [mostrarInfo, setMostrarInfo] = useState(false);
  const dados = CONDICOES.find(c => c.nome === cond.nome);
  const rest = rodadasRestantes(cond, rodadaAtual);
  const expirada = rest !== null && rest <= 0;

  const setDuracao = (d) => onChange({
    ...cond,
    permanente: false,
    duracao: Math.max(1, d),
    // Mantém a rodada de início original. Só usa a atual se não houver uma.
    rodadaInicio: cond.rodadaInicio ?? rodadaAtual,
  });
  

  return (
    <>
      {mostrarInfo && dados && (
        <Modal titulo={`${dados.icone} ${dados.nome}`} onClose={() => setMostrarInfo(false)}>
          <div style={{ display:"inline-block", padding:"2px 10px", borderRadius:10, marginBottom:12, background:`${dados.cor}22`, border:`1px solid ${dados.cor}66`, fontFamily:"'Cinzel',serif", fontSize:9, letterSpacing:1, color:dados.cor }}>{dados.categoria}</div>
          <p style={{ fontFamily:"'IM Fell English',Georgia,serif", fontSize:14, color:"#c8a060", lineHeight:1.8, margin:0 }}>{dados.descricao}</p>
        </Modal>
      )}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 28px 28px", gap:5, alignItems:"center", marginBottom:6, opacity: expirada ? 0.55 : 1 }}>
        <div style={{ background:dados?`linear-gradient(135deg,${dados.cor}11,#0d070088)`:"#0d070088", border:`1px solid ${expirada ? "#5a1a1a" : (dados?dados.cor+"55":"#8b5e1a55")}`, borderRadius:6, padding:"0 4px", display:"flex", alignItems:"center", gap:6, minHeight:34 }}>
          {dados && <span style={{ fontSize:14, flexShrink:0 }}>{dados.icone}</span>}
          <select value={cond.nome} onChange={e => onChangeName(e.target.value)}
            style={{ flex:1, background:"transparent", border:"none", outline:"none", color:dados?"#f0d8a0":"#7a5020", fontFamily:dados?"'IM Fell English',Georgia,serif":"'Cinzel',serif", fontSize:dados?13:11, cursor:"pointer", padding:"6px 2px" }}>
            <option value="" style={{ background:"#1c0e00" }}>Selecione a condição...</option>
            {CONDICOES.map(c => {
  const usada = ocupadas.includes(c.nome) && c.nome !== cond.nome;
  return (
    <option key={c.nome} value={c.nome} disabled={usada} style={{ background:"#1c0e00", color: usada ? "#5a4020" : undefined }}>
      {c.icone} {c.nome}{usada ? " (ativa)" : ""}
    </option>
  );
})}

          </select>
        </div>
        <button onClick={() => dados && setMostrarInfo(true)} style={{ width:28, height:34, borderRadius:6, border:`1px solid ${dados?dados.cor+"55":"#3a2a10"}`, background:dados?`${dados.cor}11`:"transparent", color:dados?dados.cor:"#3a2a10", fontSize:13, cursor:dados?"pointer":"default", display:"flex", alignItems:"center", justifyContent:"center" }}>❓</button>
        <button onClick={onRemove} style={{ width:28, height:34, borderRadius:6, border:"1px solid #5a1a1a", background:"#2a0d0d88", color:"#e06060", fontSize:13, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>✕</button>
      </div>

      {/* Linha de duração */}
      <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:8, marginTop:-2, flexWrap:"wrap" }}>
        <button
          onClick={() => onChange({ ...cond, permanente: !cond.permanente, duracao: cond.permanente ? 1 : null, rodadaInicio: rodadaAtual })}
          style={{ padding:"3px 8px", borderRadius:8, border:`1px solid ${cond.permanente ? "#8b5e1a" : "#4a9fd4"}`, background: cond.permanente ? "#2a180066" : "#0d1a2466", color: cond.permanente ? "#c8922a" : "#4a9fd4", fontFamily:"'Cinzel',serif", fontSize:8, letterSpacing:1, cursor:"pointer" }}>
          {cond.permanente ? "♾️ PERMANENTE" : "⏳ TEMPORÁRIA"}
        </button>

        {!cond.permanente && (
          <>
            <button onClick={() => setDuracao((cond.duracao || 1) - 1)} style={durBtn}>−</button>
            <input type="number" min="1" value={cond.duracao || 1}
              onChange={e => setDuracao(parseInt(e.target.value) || 1)}
              style={{ width:36, textAlign:"center", background:"#0d070088", border:"1px solid #8b5e1a55", borderRadius:4, color:"#e8a020", fontFamily:"'Cinzel',serif", fontSize:11, padding:"3px", outline:"none" }} />
            <button onClick={() => setDuracao((cond.duracao || 1) + 1)} style={durBtn}>+</button>
            <span style={{ fontFamily:"'Cinzel',serif", fontSize:9, letterSpacing:1, marginLeft:2,
              color: expirada ? "#e06060" : (rest <= 1 ? "#e8922a" : "#7ec87e") }}>
              {expirada ? "⚠ EXPIRADA" : `${rest} rodada${rest > 1 ? "s" : ""} restante${rest > 1 ? "s" : ""}`}
            </span>
          </>
        )}
      </div>

      {dados && <div style={{ background:`${dados.cor}0d`, border:`1px solid ${dados.cor}33`, borderRadius:5, padding:"5px 10px", marginBottom:8, marginTop:-2, fontFamily:"'Cinzel',serif", fontSize:9, letterSpacing:0.5, color:dados.cor, lineHeight:1.5 }}>{dados.resumo}</div>}
    </>
  );
}

const durBtn = {
  width:24, height:24, borderRadius:4, border:"1px solid #8b5e1a",
  background:"linear-gradient(180deg,#3a1e00,#1c0e00)", color:"#c8922a",
  fontFamily:"'Cinzel',serif", fontSize:12, cursor:"pointer", lineHeight:1,
};


function SecaoCondicoes({ condicoes, onChange, rodadaAtual = 1 }) {
  const [mostrarTabela, setMostrarTabela] = useState(false);
  return (
    <>
      {mostrarTabela && (
        <Modal titulo="📋 Tabela de Condições" onClose={() => setMostrarTabela(false)}>
          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
            {CONDICOES.map(c => (
              <div key={c.nome} style={{ borderRadius:6, padding:"8px 10px", background:`${c.cor}0d`, border:`1px solid ${c.cor}33` }}>
                <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:3 }}>
                  <span style={{ fontSize:14 }}>{c.icone}</span>
                  <span style={{ fontFamily:"'Cinzel',serif", fontSize:11, fontWeight:700, color:c.cor, flex:1 }}>{c.nome}</span>
                  <span style={{ fontFamily:"'Cinzel',serif", fontSize:8, letterSpacing:1, color:"#7a5020", background:"#3a2a1044", padding:"1px 6px", borderRadius:8 }}>{c.categoria}</span>
                </div>
                <div style={{ fontFamily:"'Cinzel',serif", fontSize:9, color:"#c8a060", lineHeight:1.5 }}>{c.resumo}</div>
              </div>
            ))}
          </div>
        </Modal>
      )}
      <Secao icone="⚠️" titulo="Condições Ativas">
        <div style={{ display:"flex", justifyContent:"flex-end", marginBottom:10 }}>
          <button onClick={() => setMostrarTabela(true)} style={{ padding:"5px 12px", borderRadius:6, border:"1px solid #8b5e1a66", background:"linear-gradient(180deg,#2a1800,#1a0e00)", color:"#c8922a", fontFamily:"'Cinzel',serif", fontSize:9, letterSpacing:1, cursor:"pointer" }}>📋 TABELA DE CONDIÇÕES</button>
        </div>
        <DiamondDivider />
        <div style={{ marginTop:10 }}>
          {(condicoes||[]).length===0 && <div style={{ textAlign:"center", padding:"20px 0", fontFamily:"'Cinzel',serif", fontSize:10, letterSpacing:2, color:"#3a2a10" }}>Nenhuma condição ativa.</div>}
          {(condicoes||[]).map(c =>
            <CardCondicao
              ocupadas={(condicoes || []).map(x => x.nome).filter(Boolean)}
              key={c.id}
              cond={c}
              rodadaAtual={rodadaAtual}
              onRemove={() => onChange((condicoes||[]).filter(x=>x.id!==c.id))}
              onChangeName={n => onChange((condicoes||[]).map(x=>x.id===c.id?{...x,nome:n}:x))}
              onChange={upd => onChange((condicoes||[]).map(x=>x.id===c.id?upd:x))}
            />)}
        </div>
        {(() => {
          const lista = Array.isArray(condicoes) ? condicoes : [];
          const temVazia = lista.some(c => !c.nome || !c.nome.trim());
          return (
            <button
            onClick={() => { if (temVazia) return; onChange([...lista, condicaoAtiva(rodadaAtual)]); }}
              disabled={temVazia}
              title={temVazia ? "Selecione a condição pendente antes de adicionar outra" : ""}
              style={{
                marginTop:6, width:"100%", padding:"7px 0",
                background:"linear-gradient(180deg,#2a1800,#1a0e00)",
                border:"1px dashed #8b5e1a", borderRadius:5,
                color: temVazia ? "#3a2a10" : "#7a5020",
                fontFamily:"'Cinzel',serif", fontSize:9, letterSpacing:2,
                cursor: temVazia ? "not-allowed" : "pointer",
                opacity: temVazia ? 0.6 : 1,
              }}
            >
              {temVazia ? "SELECIONE A CONDIÇÃO PENDENTE" : "+ ADICIONAR CONDIÇÃO"}
            </button>
          );
        })()}

      </Secao>
    </>
  );
}

// ─── MODAL MAGIA ─────────────────────────────────────────────────────────────

function ModalMagia({ magia, onSave, onClose }) {
  const [form, setForm] = useState({...magia});
  const cor = ESCOLA_CORES[form.escola] || "#c8922a";
  const field = (k,v) => setForm(f => ({...f,[k]:v}));

  const [erroNome, setErroNome] = useState("");

  const labelSt = { fontFamily:"'Cinzel',serif", fontSize:9, letterSpacing:2, color:"#7a5020", textTransform:"uppercase", display:"block", marginBottom:4 };
  const inputSt = { background:"#0d070088", border:"1px solid #8b5e1a55", borderRadius:5, color:"#f0d8a0", fontFamily:"'IM Fell English',Georgia,serif", fontSize:13, padding:"7px 10px", outline:"none", width:"100%", boxSizing:"border-box", transition:"border-color 0.2s" };

  return (
    <div style={{ position:"fixed", inset:0, zIndex:200, background:"#00000099", display:"flex", alignItems:"center", justifyContent:"center", padding:16 }} onClick={onClose}>
      <div style={{ background:"linear-gradient(160deg,#2e1800,#1c0e00)", border:`1px solid ${cor}`, borderRadius:10, padding:"20px 18px", maxWidth:440, width:"100%", maxHeight:"88vh", overflowY:"auto", boxShadow:`0 8px 40px #000c, 0 0 20px ${cor}22`, position:"relative" }} onClick={e => e.stopPropagation()}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
          <div style={{ fontFamily:"'Cinzel',serif", fontSize:12, fontWeight:700, color:cor, letterSpacing:2 }}>{ESCOLA_ICONES[form.escola]} {magia.nome?"EDITAR MAGIA":"NOVA MAGIA"}</div>
          <button onClick={onClose} style={{ background:"transparent", border:"none", color:"#7a5020", fontSize:18, cursor:"pointer" }}>✕</button>
        </div>
        <div style={{ marginBottom:12 }}>
          <label style={labelSt}>Nome da Magia</label>
          <input autoFocus value={form.nome} placeholder="Ex: Bola de Fogo"
                        onChange={e => { field("nome",e.target.value); setErroNome(""); }}
            style={{ ...inputSt, fontFamily:"'Cinzel',serif", fontSize:14, fontWeight:700, color:cor }}
            onFocus={e => e.target.style.borderColor=cor} onBlur={e => e.target.style.borderColor="#8b5e1a55"} />
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:12 }}>
          <div>
            <label style={labelSt}>Tipo</label>
            <div style={{ display:"flex", gap:6 }}>
              {["Arcana","Divina"].map(t => (
                <button key={t} onClick={() => field("tipo",t)} style={{ flex:1, padding:"7px 4px", borderRadius:6, border:`1px solid ${form.tipo===t?cor:"#3a2a10"}`, background:form.tipo===t?`${cor}22`:"transparent", color:form.tipo===t?cor:"#7a5020", fontFamily:"'Cinzel',serif", fontSize:9, letterSpacing:1, cursor:"pointer" }}>
                  {t==="Arcana"?"🔮":"✨"} {t}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label style={labelSt}>Círculo</label>
            <div style={{ display:"flex", gap:4 }}>
              {CIRCULOS.map(c => (
                <button key={c} onClick={() => field("circulo",c)} style={{ flex:1, padding:"7px 2px", borderRadius:6, border:`1px solid ${form.circulo===c?cor:"#3a2a10"}`, background:form.circulo===c?`${cor}22`:"transparent", color:form.circulo===c?cor:"#7a5020", fontFamily:"'Cinzel',serif", fontSize:11, fontWeight:700, cursor:"pointer" }}>{c}°</button>
              ))}
            </div>
          </div>
        </div>
        <div style={{ marginBottom:12 }}>
          <label style={labelSt}>Escola</label>
          <div style={{ display:"flex", flexWrap:"wrap", gap:5 }}>
            {ESCOLAS_MAGIA.map(e => {
              const ecor=ESCOLA_CORES[e]; const ativo=form.escola===e;
              return <button key={e} onClick={() => field("escola",e)} style={{ padding:"4px 10px", borderRadius:12, border:`1px solid ${ativo?ecor:"#3a2a10"}`, background:ativo?`${ecor}22`:"transparent", color:ativo?ecor:"#7a5020", fontFamily:"'Cinzel',serif", fontSize:8, letterSpacing:1, cursor:"pointer" }}>{ESCOLA_ICONES[e]} {e}</button>;
            })}
          </div>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:12 }}>
          {[
            { k:"execucao",    label:"Execução",    ph:"Ação padrão"   },
            { k:"alcance",     label:"Alcance",     ph:"Curto (9m)"    },
            { k:"alvo",        label:"Alvo/Área",   ph:"1 criatura"    },
            { k:"duracao",     label:"Duração",     ph:"Instantânea"   },
            { k:"resistencia", label:"Resistência", ph:"Vontade anula" },
            { k:"custoPM",     label:"Custo (PM)",  ph:`Padrão: ${CUSTO_PM_CIRCULO[form.circulo] || 1}` },

          ].map(({ k,label,ph }) => (
            <div key={k}>
              <label style={labelSt}>{label}</label>
              <input value={form[k] ?? ""} placeholder={ph} onChange={e => field(k,e.target.value)} style={inputSt}
                onFocus={e => e.target.style.borderColor=cor} onBlur={e => e.target.style.borderColor="#8b5e1a55"} />
            </div>
          ))}
        </div>
        <div style={{ marginBottom:14 }}>
          <label style={labelSt}>Descrição / Efeito</label>
          <textarea value={form.descricao} placeholder="Descreva o efeito, custo em PM, condições especiais..." rows={4}
            onChange={e => field("descricao",e.target.value)}
            style={{ background:"#0d070088", border:"1px solid #8b5e1a55", borderRadius:5, color:"#c8a060", fontFamily:"'IM Fell English',Georgia,serif", fontSize:13, padding:"8px 10px", outline:"none", resize:"vertical", width:"100%", boxSizing:"border-box", lineHeight:1.6 }}
            onFocus={e => e.target.style.borderColor=cor} onBlur={e => e.target.style.borderColor="#8b5e1a55"} />
        </div>
        {erroNome && (
          <div style={{ fontFamily:"'Cinzel',serif", fontSize:9, color:"#e06060", marginBottom:8, textAlign:"right" }}>{erroNome}</div>
        )}
        <div style={{ display:"flex", gap:8, justifyContent:"flex-end" }}>
          <button onClick={onClose} style={{ padding:"8px 16px", borderRadius:6, border:"1px solid #3a2a10", background:"transparent", color:"#7a5020", fontFamily:"'Cinzel',serif", fontSize:9, letterSpacing:1, cursor:"pointer" }}>CANCELAR</button>
          
<button
  onClick={() => {
    if (!form.nome.trim()) { setErroNome("Digite um nome para a magia."); return; }
    onSave(form);
    onClose();
  }}
  style={{ padding:"8px 18px", borderRadius:6, border:`1px solid ${cor}`, background:`${cor}22`, color:cor, fontFamily:"'Cinzel',serif", fontSize:9, letterSpacing:1, cursor:"pointer" }}
>✦ SALVAR MAGIA</button>

        </div>
      </div>
    </div>
  );
}

// ─── CARD MAGIA ──────────────────────────────────────────────────────────────

function CardMagia({ magia, onEdit, onRemove, onTogglePreparada, onLancar, custo }) {
  const [expandido, setExpandido] = useState(false);
  const cor   = ESCOLA_CORES[magia.escola] || "#c8922a";
  const icone = ESCOLA_ICONES[magia.escola] || "✨";
  return (
    <div style={{ borderRadius:8, border:`1px solid ${expandido?cor+"88":cor+"33"}`, background:expandido?`linear-gradient(135deg,${cor}11,#0d070088)`:`linear-gradient(135deg,${cor}08,#0d070044)`, marginBottom:8, overflow:"hidden", transition:"all 0.25s ease" }}>
      <div style={{ display:"flex", alignItems:"center", gap:8, padding:"9px 10px" }}>
        <button onClick={e => { e.stopPropagation(); onTogglePreparada(); }} title={magia.preparada?"Preparada":"Não preparada"}
          style={{ width:22, height:22, borderRadius:4, flexShrink:0, border:`1px solid ${magia.preparada?cor:"#3a2a10"}`, background:magia.preparada?`${cor}33`:"transparent", color:magia.preparada?cor:"#3a2a10", fontSize:10, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>✦</button>
        <div onClick={() => setExpandido(e=>!e)} style={{ flex:1, cursor:"pointer", minWidth:0 }}>
          <div style={{ display:"flex", alignItems:"center", gap:6, flexWrap:"wrap" }}>
            <span style={{ fontFamily:"'Cinzel',serif", fontSize:12, fontWeight:700, color:"#f0d8a0" }}>{magia.nome}</span>
            <span style={{ padding:"1px 7px", borderRadius:10, flexShrink:0, background:`${cor}22`, border:`1px solid ${cor}55`, color:cor, fontFamily:"'Cinzel',serif", fontSize:8, letterSpacing:1 }}>{icone} {magia.escola}</span>
          </div>
          <div style={{ display:"flex", gap:8, marginTop:3, flexWrap:"wrap" }}>
            <span style={{ fontFamily:"'Cinzel',serif", fontSize:8, color:"#7a5020", letterSpacing:1 }}>{magia.tipo==="Divina"?"✨":"🔮"} {magia.tipo}</span>
            <span style={{ fontFamily:"'Cinzel',serif", fontSize:8, color:"#7a5020", letterSpacing:1 }}>{magia.circulo}° Círculo</span>
            <span style={{ fontFamily:"'Cinzel',serif", fontSize:8, color:"#80b0e0", letterSpacing:1 }}>💧 {custo} PM</span>

            {magia.execucao && <span style={{ fontFamily:"'Cinzel',serif", fontSize:8, color:"#7a5020", letterSpacing:1 }}>⏱ {magia.execucao}</span>}
          </div>
        </div>
        <button onClick={e => { e.stopPropagation(); onLancar(); }} title={`Lançar (${custo} PM)`}
          style={{ padding:"4px 8px", borderRadius:5, flexShrink:0, border:"1px solid #6090e088", background:"#6090e011", color:"#80b0e0", fontFamily:"'Cinzel',serif", fontSize:8, letterSpacing:1, cursor:"pointer" }}>
          🔮 LANÇAR
        </button>
        <span onClick={() => setExpandido(e=>!e)} style={{ color:"#7a5020", fontSize:10, flexShrink:0, cursor:"pointer", transform:expandido?"rotate(180deg)":"rotate(0deg)", transition:"transform 0.2s" }}>▼</span>
      </div>
      {expandido && (
        <div style={{ padding:"0 10px 12px", borderTop:`1px solid ${cor}22` }}>
          {(magia.alcance||magia.alvo||magia.duracao||magia.resistencia) && (
            <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:6, margin:"10px 0" }}>
              {[
                { label:"Alcance",     val:magia.alcance,     ic:"🎯" },
                { label:"Alvo/Área",   val:magia.alvo,        ic:"👤" },
                { label:"Duração",     val:magia.duracao,     ic:"⏳" },
                { label:"Resistência", val:magia.resistencia, ic:"🎲" },
              ].filter(x=>x.val).map(({ label,val,ic }) => (
                <div key={label} style={{ background:`${cor}0a`, border:`1px solid ${cor}22`, borderRadius:5, padding:"5px 8px" }}>
                  <div style={{ fontFamily:"'Cinzel',serif", fontSize:7, letterSpacing:1, color:"#7a5020", marginBottom:2 }}>{ic} {label.toUpperCase()}</div>
                  <div style={{ fontFamily:"'IM Fell English',Georgia,serif", fontSize:12, color:"#c8a060" }}>{val}</div>
                </div>
              ))}
            </div>
          )}
          {magia.descricao
            ? <p style={{ fontFamily:"'IM Fell English',Georgia,serif", fontSize:13, color:"#c8a060", lineHeight:1.7, margin:"8px 0 12px", whiteSpace:"pre-wrap" }}>{magia.descricao}</p>
            : <p style={{ fontFamily:"'Cinzel',serif", fontSize:10, color:"#3a2a10", margin:"8px 0 12px", fontStyle:"italic" }}>Sem descrição.</p>
          }
          <div style={{ display:"flex", gap:6, justifyContent:"flex-end" }}>
            <button onClick={onRemove} style={sCard.btnDanger}>✕ Remover</button>
            <button onClick={onEdit}   style={{ ...sCard.btnSalvar, borderColor:cor, color:cor }}>✎ Editar</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── ABA GRIMÓRIO ────────────────────────────────────────────────────────────

function AbaGrimorio({ magias, onChange, cdMagia, magiaConfig, onConfigChange, atributos, nivel, onLancar, pmDisponivel }) {
  const [msgLancar, setMsgLancar] = useState("");
  const [filtroTipo,   setFiltroTipo]   = useState("Todos");
  const [filtroCirc,   setFiltroCirc]   = useState(0);
  const [filtroEscola, setFiltroEscola] = useState("Todas");
  const [modalAberto,  setModalAberto]  = useState(false);
  const [magiaEdit,    setMagiaEdit]    = useState(null);

  const addMagia        = ()   => { setMagiaEdit(magiaVazia()); setModalAberto(true); };
  const editMagia = m => {
    setMagiaEdit({ ...m, circulo: Number(m.circulo) || 1 });
    setModalAberto(true);
  };
  const removeMagia = id => {
    const magia = magias.find(m => m.id === id);
    if (!confirmarRemocao("a magia", magia?.nome)) return;
    onChange(magias.filter(m => m.id !== id));
  };
  
  const saveMagia       = form => {
    const existe = magias.find(m=>m.id===form.id);
    if (existe) onChange(magias.map(m=>m.id===form.id?form:m));
    else        onChange([...magias, form]);
  };
  const togglePreparada = id   => onChange(magias.map(m=>m.id===id?{...m,preparada:!m.preparada}:m));

  const filtradas = magias.filter(m => {
    if (filtroTipo!=="Todos"   && m.tipo!==filtroTipo)     return false;
    if (filtroCirc!==0 && Number(m.circulo)!==filtroCirc) return false;
    if (filtroEscola!=="Todas" && m.escola!==filtroEscola) return false;
    return true;
  });

  const totalPrep = magias.filter(m=>m.preparada).length;

  const attr    = magiaConfig?.atributoChave || "INT";
  const modAttr = calcMod(atributos?.[attr] ?? 10);
  const bonus   = parseInt(magiaConfig?.bonusCD) || 0;

  return (
    <>
      {modalAberto && magiaEdit && (
        <ModalMagia magia={magiaEdit} onSave={saveMagia} onClose={() => { setModalAberto(false); setMagiaEdit(null); }} />
      )}

            {/* ── PAINEL CD DE RESISTÊNCIA ── */}
            <div style={{ background:"linear-gradient(135deg,#1e0d3588,#0d070088)", border:"1px solid #a06ad4", borderRadius:8, padding:"12px 14px", marginBottom:10, boxShadow:"0 0 16px #a06ad422" }}>
        <div style={{ display:"flex", alignItems:"center", gap:14 }}>
          {/* Círculo com CD */}
          <div style={{ width:64, height:64, borderRadius:"50%", flexShrink:0, background:"linear-gradient(135deg,#2e1545,#160a25)", border:"2px solid #a06ad4", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", boxShadow:"0 0 12px #a06ad444" }}>
            <div style={{ fontFamily:"'Cinzel',serif", fontSize:8, color:"#8060a0", letterSpacing:1 }}>CD</div>
            <div style={{ fontFamily:"'Cinzel Decorative','Cinzel',serif", fontSize:24, fontWeight:900, color:"#c080ff", lineHeight:1 }}>{cdMagia}</div>
          </div>

          <div style={{ flex:1 }}>
            <div style={{ fontFamily:"'Cinzel',serif", fontSize:9, letterSpacing:2, color:"#a06ad4", marginBottom:8 }}>CD DE RESISTÊNCIA</div>

            {/* Atributo-chave */}
            <div style={{ marginBottom:8 }}>
              <div style={{ fontFamily:"'Cinzel',serif", fontSize:8, letterSpacing:1, color:"#7a5020", marginBottom:4 }}>ATRIBUTO-CHAVE</div>
              <div style={{ display:"flex", gap:4 }}>
                {ATRIBUTOS.map(a => (
                  <button key={a} onClick={() => onConfigChange("atributoChave", a)}
                    style={{ flex:1, padding:"5px 2px", borderRadius:5, border:`1px solid ${attr===a?"#a06ad4":"#3a2a10"}`, background:attr===a?"#a06ad422":"transparent", color:attr===a?"#c080ff":"#7a5020", fontFamily:"'Cinzel',serif", fontSize:8, fontWeight:700, letterSpacing:0.5, cursor:"pointer" }}>{a}</button>
                ))}
              </div>
            </div>

            {/* Bônus extra */}
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <span style={{ fontFamily:"'Cinzel',serif", fontSize:8, letterSpacing:1, color:"#7a5020" }}>BÔNUS EXTRA</span>
              <input type="number" value={bonus === 0 ? "" : bonus} placeholder="0"
                onChange={e => onConfigChange("bonusCD", parseInt(e.target.value) || 0)}
                style={{ width:52, textAlign:"center", background:"#0d070088", border:"1px solid #8b5e1a55", borderRadius:4, color:"#c080ff", fontFamily:"'Cinzel',serif", fontSize:12, padding:"4px", outline:"none" }}
                onFocus={e => e.target.style.borderColor="#a06ad4"}
                onBlur={e => e.target.style.borderColor="#8b5e1a55"} />
            </div>
          </div>
        </div>

        {/* Fórmula */}
        <div style={{ marginTop:10, paddingTop:8, borderTop:"1px solid #a06ad433", fontFamily:"'Cinzel',serif", fontSize:8, letterSpacing:0.5, color:"#8060a0", textAlign:"center", lineHeight:1.5 }}>
          10 + ½ nível ({Math.floor(nivel/2)}) + mod {attr} ({fmtMod(modAttr)}){bonus !== 0 && ` + bônus (${fmtMod(bonus)})`} = <b style={{ color:"#c080ff" }}>{cdMagia}</b>
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:8, marginBottom:10 }}>
  {[
    { label:"Total",      val:magias.length,                              ic:"📖" },
    { label:"Preparadas", val:totalPrep,                                  ic:"✦"  },
    { label:"Arcanas",    val:magias.filter(m=>m.tipo==="Arcana").length, ic:"🔮" },
    { label:"Divinas",    val:magias.filter(m=>m.tipo==="Divina").length, ic:"✨" },
  ].map(({ label,val,ic }) => (
          <div key={label} style={{ background:"linear-gradient(160deg,#2a150088,#1a0d0088)", border:"1px solid #8b5e1a", borderRadius:8, padding:"8px 6px", textAlign:"center" }}>
            <div style={{ fontSize:16 }}>{ic}</div>
            <div style={{ fontFamily:"'Cinzel Decorative','Cinzel',serif", fontSize:20, fontWeight:900, color:"#f0d8a0", lineHeight:1.1 }}>{val}</div>
            <div style={{ fontFamily:"'Cinzel',serif", fontSize:8, letterSpacing:2, color:"#7a5020", textTransform:"uppercase" }}>{label}</div>
          </div>
        ))}
      </div>
      <div style={{ background:"linear-gradient(135deg,#22120088,#180d0088)", border:"1px solid #8b5e1a", borderRadius:8, padding:"10px 12px", marginBottom:10 }}>
        <div style={{ marginBottom:8 }}>
          <div style={{ fontFamily:"'Cinzel',serif", fontSize:8, letterSpacing:2, color:"#7a5020", marginBottom:5 }}>TIPO</div>
          <div style={{ display:"flex", gap:5 }}>
            {["Todos","Arcana","Divina"].map(t => (
              <button key={t} onClick={() => setFiltroTipo(t)} style={{ padding:"4px 12px", borderRadius:12, border:`1px solid ${filtroTipo===t?"#c8922a":"#3a2a10"}`, background:filtroTipo===t?"#c8922a22":"transparent", color:filtroTipo===t?"#c8922a":"#7a5020", fontFamily:"'Cinzel',serif", fontSize:8, letterSpacing:1, cursor:"pointer" }}>
                {t==="Arcana"?"🔮 ":t==="Divina"?"✨ ":"📖 "}{t}
              </button>
            ))}
          </div>
        </div>
        <div style={{ marginBottom:8 }}>
          <div style={{ fontFamily:"'Cinzel',serif", fontSize:8, letterSpacing:2, color:"#7a5020", marginBottom:5 }}>CÍRCULO</div>
          <div style={{ display:"flex", gap:5 }}>
            {[{v:0,l:"Todos"},...CIRCULOS.map(c=>({v:c,l:`${c}°`}))].map(({v,l}) => (
              <button key={v} onClick={() => setFiltroCirc(filtroCirc===v ? 0 : v)}
              style={{ padding:"4px 10px", borderRadius:12, border:`1px solid ${filtroCirc===v?"#e8a020":"#3a2a10"}`, background:filtroCirc===v?"#e8a02022":"transparent", color:filtroCirc===v?"#e8a020":"#7a5020", fontFamily:"'Cinzel',serif", fontSize:8, letterSpacing:1, cursor:"pointer" }}>{l}</button>
            ))}
          </div>
        </div>
        <div>
          <div style={{ fontFamily:"'Cinzel',serif", fontSize:8, letterSpacing:2, color:"#7a5020", marginBottom:5 }}>ESCOLA</div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:5 }}>
            <button onClick={() => setFiltroEscola("Todas")} style={{ padding:"3px 10px", borderRadius:12, border:`1px solid ${filtroEscola==="Todas"?"#c8922a":"#3a2a10"}`, background:filtroEscola==="Todas"?"#c8922a22":"transparent", color:filtroEscola==="Todas"?"#c8922a":"#7a5020", fontFamily:"'Cinzel',serif", fontSize:8, letterSpacing:1, cursor:"pointer" }}>📖 Todas</button>
            {ESCOLAS_MAGIA.map(e => {
              const ecor=ESCOLA_CORES[e]; const ativo=filtroEscola===e;
              return <button key={e} onClick={() => setFiltroEscola(ativo?"Todas":e)} style={{ padding:"3px 10px", borderRadius:12, border:`1px solid ${ativo?ecor:"#3a2a10"}`, background:ativo?`${ecor}22`:"transparent", color:ativo?ecor:"#7a5020", fontFamily:"'Cinzel',serif", fontSize:8, letterSpacing:1, cursor:"pointer" }}>{ESCOLA_ICONES[e]} {e}</button>;
            })}
          </div>
        </div>
      </div>
      <Secao icone="📖" titulo={`Grimório (${filtradas.length})`}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", gap:8, marginBottom:8, fontFamily:"'Cinzel',serif", fontSize:9, color:"#80b0e0" }}>
          <span>💧 PM disponíveis: <b>{pmDisponivel}</b></span>
          {msgLancar && <button onClick={() => setMsgLancar("")} style={{ background:"transparent", border:"none", color:"#7a5020", cursor:"pointer", fontSize:11 }}>✕</button>}
        </div>
        {msgLancar && (
          <div style={{ marginBottom:10, padding:"6px 10px", borderRadius:5, fontFamily:"'Cinzel',serif", fontSize:9, lineHeight:1.5, color: msgLancar.startsWith("✦") ? "#7ec87e" : "#e06060", border:`1px solid ${msgLancar.startsWith("✦") ? "#7ec87e55" : "#e0606055"}`, background:"#0d070088" }}>
            {msgLancar}
          </div>
        )}

      {filtradas.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "28px 0",
            fontFamily: "'Cinzel',serif",
            fontSize: 10,
            letterSpacing: 2,
            color: "#3a2a10",
          }}
        >
          {magias.length === 0
            ? "Nenhuma magia aprendida."
            : "Nenhuma magia com esses filtros."}
        </div>
      ) : (
        filtradas.map(magia => (
          <CardMagia
            key={magia.id}
            magia={magia}
            onEdit={() => editMagia(magia)}
            onRemove={() => removeMagia(magia.id)}
            onTogglePreparada={() =>
              togglePreparada(magia.id)
            }
            custo={custoMagia(magia)}
            onLancar={() => setMsgLancar(onLancar(magia))}
          />
        ))
      )}
        <button onClick={addMagia} style={{ marginTop:8, width:"100%", padding:"8px 0", background:"linear-gradient(180deg,#2a1800,#1a0e00)", border:"1px dashed #8b5e1a", borderRadius:5, color:"#7a5020", fontFamily:"'Cinzel',serif", fontSize:9, letterSpacing:2, cursor:"pointer" }}>✨ APRENDER NOVA MAGIA</button>
      </Secao>
    </>
  );
}
// ═══════════════════════════════════════════════════
// PARTE 3/3 — App Principal e Abas
// ═══════════════════════════════════════════════════

function confirmarRemocao(tipo, nome) {
  const nomeLimpo = String(nome || "").trim();
  return confirm(
    `Remover ${tipo}${nomeLimpo ? ` "${nomeLimpo}"` : ""}?\nEsta ação não pode ser desfeita.`
  );
}

function MenuAbasDesktop({
  abas,
  abaEsquerda,
  abaDireita,
  onSelecionarEsquerda,
  onSelecionarDireita,
  onTrocarPaineis,
}) {
  return (
    <aside className="menuAbasDesktop">
      <div className="menuAbasTitulo">
        PAINÉIS DA FICHA
      </div>

      <div className="menuPainelGrupo">
        <div className="menuPainelTitulo">
          PAINEL ESQUERDO
        </div>

        {abas.map(abaItem => (
          <button
            key={`esquerda-${abaItem.id}`}
            type="button"
            className={
              abaEsquerda === abaItem.id
                ? "menuAbaDesktop ativa"
                : "menuAbaDesktop"
            }
            onClick={() =>
              onSelecionarEsquerda(abaItem.id)
            }
          >
            <span className="menuAbaIcone">
              {abaItem.icon}
            </span>

            <span>{abaItem.label}</span>
          </button>
        ))}
      </div>

      <div className="menuPainelGrupo">
        <div className="menuPainelTitulo">
          PAINEL DIREITO
        </div>

        {abas.map(abaItem => (
          <button
            key={`direita-${abaItem.id}`}
            type="button"
            className={
              abaDireita === abaItem.id
                ? "menuAbaDesktop ativa"
                : "menuAbaDesktop"
            }
            onClick={() =>
              onSelecionarDireita(abaItem.id)
            }
          >
            <span className="menuAbaIcone">
              {abaItem.icon}
            </span>

            <span>{abaItem.label}</span>
          </button>
        ))}
      </div>

      <button
        type="button"
        className="botaoTrocarPaineis"
        onClick={onTrocarPaineis}
      >
        ⇄ TROCAR PAINÉIS
      </button>
    </aside>
  );
}

// Adicione este componente em um novo arquivo ModalCena.jsx
// ou no final do seu arquivo principal, antes do `export default function App() { ... }`

function ModalCena({ cena, onUpdateCena, onClose, initialCena }) { // NOVA PROP
  const field = (k, v) => onUpdateCena({ ...cena, [k]: v });

  const rodada = Math.max(1, parseInt(cena.rodada) || 1);

  const labelSt = {
    fontFamily: "'Cinzel',serif",
    fontSize: 9,
    letterSpacing: 2,
    color: "#7a5020",
    textTransform: "uppercase",
    display: "block",
    marginBottom: 4,
  };
  const inputSt = {
    background: "#0d070088",
    border: "1px solid #8b5e1a55",
    borderRadius: 5,
    color: "#f0d8a0",
    fontFamily: "'IM Fell English',Georgia,serif",
    fontSize: 13,
    padding: "7px 10px",
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
    transition: "border-color 0.2s",
  };
  const btnSt = {
    padding: "5px 10px",
    borderRadius: 5,
    border: "1px solid #8b5e1a",
    background: "linear-gradient(180deg,#3a1e00,#1c0e00)",
    color: "#c8922a",
    fontFamily: "'Cinzel',serif",
    fontSize: 9,
    letterSpacing: 1,
    cursor: "pointer",
  };
  const btnDangerSt = {
    padding: "5px 10px",
    borderRadius: 5,
    border: "1px solid #5a1a1a",
    background: "#2a0d0d88",
    color: "#e06060",
    fontFamily: "'Cinzel',serif",
    fontSize: 9,
    letterSpacing: 1,
    cursor: "pointer",
  };

  const modInputSt = {
    width: 52,
    textAlign: "center",
    background: "#0d070088",
    border: "1px solid #8b5e1a55",
    borderRadius: 4,
    color: "#e8a020",
    fontFamily: "'Cinzel',serif",
    fontSize: 12,
    padding: "4px",
    outline: "none",
  };

  return (
    <Modal titulo="⚙️ Configurações da Cena" onClose={onClose}>
      <div
        style={{
          fontFamily: "'Cinzel',serif",
          fontSize: 9,
          lineHeight: 1.6,
          color: "#7a5020",
          textAlign: "center",
          marginBottom: 14,
        }}
      >
        Gerencie o estado atual do combate ou desafio.
      </div>

      {/* Ativar/Desativar Cena */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 14,
          padding: "10px 12px",
          borderRadius: 8,
          border: `1px solid ${cena.ativa ? "#7ec87e" : "#8b5e1a"}`,
          background: cena.ativa
            ? "linear-gradient(135deg,#1a3a2a88,#0d070088)"
            : "linear-gradient(135deg,#22120066,#180d0066)",
        }}
      >
        <span
          style={{
            fontFamily: "'Cinzel',serif",
            fontSize: 11,
            letterSpacing: 1,
            color: cena.ativa ? "#7ec87e" : "#c8922a",
          }}
        >
          CENA {cena.ativa ? "ATIVA" : "INATIVA"}
        </span>
        <button
          onClick={() => field("ativa", !cena.ativa)}
          style={{
            ...btnSt,
            borderColor: cena.ativa ? "#e06060" : "#7ec87e",
            background: cena.ativa
              ? "linear-gradient(180deg,#5a1a1a,#3a0d0d)"
              : "linear-gradient(180deg,#2a3a1a,#1a2a0d)",
            color: cena.ativa ? "#e06060" : "#7ec87e",
          }}
        >
          {cena.ativa ? "DESATIVAR" : "ATIVAR"}
        </button>
      </div>

      {cena.ativa && (
        <>
          {/* Nome da Cena */}
          <div style={{ marginBottom: 12 }}>
            <label style={labelSt}>Nome da Cena</label>
            <input
              value={cena.nome || ""}
              placeholder="Ex: Combate contra o Dragão"
              onChange={e => field("nome", e.target.value)}
              style={{ ...inputSt }}
              onFocus={e => (e.target.style.borderColor = "#e8a020")}
              onBlur={e => (e.target.style.borderColor = "#8b5e1a55")}
            />
          </div>

          {/* Contador de Rodada */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 12,
              padding: "8px 12px",
              borderRadius: 8,
              border: "1px solid #8b5e1a",
              background: "linear-gradient(135deg,#22120066,#180d0066)",
            }}
          >
            <span style={labelSt}>Rodada Atual</span>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <button
                onClick={() => field("rodada", Math.max(1, rodada - 1))}
                style={btnSt}
              >
                −
              </button>
              <input
                type="number"
                min="1"
                value={rodada}
                onChange={e =>
                  field("rodada", Math.max(1, parseInt(e.target.value) || 1))
                }
                style={{ ...modInputSt, width: 40 }}
                onFocus={e => (e.target.style.borderColor = "#e8a020")}
                onBlur={e => (e.target.style.borderColor = "#8b5e1a55")}
              />
              <button
                onClick={() => field("rodada", rodada + 1)}
                style={btnSt}
              >
                +
              </button>
            </div>
          </div>

          {/* Modificadores Temporários */}
          <div
            style={{
              marginBottom: 12,
              padding: "10px 12px",
              borderRadius: 8,
              border: "1px solid #8b5e1a",
              background: "linear-gradient(135deg,#22120066,#180d0066)",
            }}
          >
            <div
              style={{
                fontFamily: "'Cinzel',serif",
                fontSize: 9,
                letterSpacing: 2,
                color: "#c8922a",
                textAlign: "center",
                marginBottom: 10,
              }}
            >
              MODIFICADORES TEMPORÁRIOS
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 10,
                marginBottom: 10,
              }}
            >
              {[
                { key: "ataque", label: "Ataque", icon: "⚔️" },
                { key: "dano", label: "Dano", icon: "💥" },
                { key: "defesa", label: "Defesa", icon: "🛡️" },
                { key: "iniciativa", label: "Iniciativa", icon: "⚡" },
              ].map(({ key, label, icon }) => (
                <div
                  key={key}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 8,
                  }}
                >
                  <span style={{ ...labelSt, marginBottom: 0 }}>
                    {icon} {label}
                  </span>
                  <input
                    type="number"
                    value={cena.modificadores?.[key] || ""}
                    placeholder="0"
                    onChange={e =>
                      field("modificadores", {
                        ...(cena.modificadores || {}),
                        [key]: parseInt(e.target.value) || 0,
                      })
                    }
                    style={modInputSt}
                    onFocus={e => (e.target.style.borderColor = "#e8a020")}
                    onBlur={e => (e.target.style.borderColor = "#8b5e1a55")}
                  />
                </div>
              ))}
            </div>

            {/* Modificadores de Perícia (simplificado por enquanto) */}
            <div style={{ marginBottom: 10 }}>
              <label style={labelSt}>Mod. Perícias (Geral)</label>
              <input
                type="number"
                value={cena.modificadores?.pericias?.geral || ""}
                placeholder="0"
                onChange={e =>
                  field("modificadores", {
                    ...(cena.modificadores || {}),
                    pericias: {
                      ...(cena.modificadores?.pericias || {}),
                      geral: parseInt(e.target.value) || 0,
                    },
                  })
                }
                style={inputSt}
                onFocus={e => (e.target.style.borderColor = "#e8a020")}
                onBlur={e => (e.target.style.borderColor = "#8b5e1a55")}
              />
            </div>

            {/* Regras segmentadas de perícia */}
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 6,
                }}
              >
                <label style={{ ...labelSt, marginBottom: 0 }}>
                  Regras específicas
                </label>
                <button
                  type="button"
                  onClick={() =>
                    field("modificadores", {
                      ...(cena.modificadores || {}),
                      pericias: {
                        ...(cena.modificadores?.pericias || {}),
                        regras: [
                          ...(Array.isArray(
                            cena.modificadores?.pericias?.regras
                          )
                            ? cena.modificadores.pericias.regras
                            : []),
                          regraPericiaVazia(),
                        ],
                      },
                    })
                  }
                  style={{ ...btnSt, fontSize: 8, padding: "3px 8px" }}
                >
                  + REGRA
                </button>
              </div>

              {(Array.isArray(cena.modificadores?.pericias?.regras)
                ? cena.modificadores.pericias.regras
                : []
              ).map(regra => {
                const atualizarRegra = (campos) =>
                  field("modificadores", {
                    ...(cena.modificadores || {}),
                    pericias: {
                      ...(cena.modificadores?.pericias || {}),
                      regras: cena.modificadores.pericias.regras.map(r =>
                        r.id === regra.id ? { ...r, ...campos } : r
                      ),
                    },
                  });


                const removerRegra = () =>
                  field("modificadores", {
                    ...(cena.modificadores || {}),
                    pericias: {
                      ...(cena.modificadores?.pericias || {}),
                      regras: cena.modificadores.pericias.regras.filter(
                        r => r.id !== regra.id
                      ),
                    },
                  });

                const precisaAlvo =
                  regra.escopo === "atributo" ||
                  regra.escopo === "pericia";

                const selectSt = {
                  ...inputSt,
                  fontFamily: "'Cinzel',serif",
                  fontSize: 10,
                  padding: "5px 4px",
                  cursor: "pointer",
                };

                return (
                  <div
                    key={regra.id}
                    style={{
                      display: "grid",
                      gridTemplateColumns: precisaAlvo
                        ? "1fr 1fr 46px 26px"
                        : "1fr 46px 26px",
                      gap: 4,
                      marginBottom: 5,
                      alignItems: "center",
                    }}
                  >
                    <select
                      value={regra.escopo}
                      onChange={e => {
                        const novoEscopo = e.target.value;
                        const limpaAlvo = novoEscopo !== "atributo" && novoEscopo !== "pericia";
                        atualizarRegra({
                          escopo: novoEscopo,
                          ...(limpaAlvo ? { alvo: "" } : {}),
                        });
                      }}

                      style={selectSt}
                    >
                      <option value="todas" style={{ background: "#1c0e00" }}>
                        Todas
                      </option>
                      <option
                        value="resistencia"
                        style={{ background: "#1c0e00" }}
                      >
                        Resistências
                      </option>
                      <option
                        value="atributo"
                        style={{ background: "#1c0e00" }}
                      >
                        Por atributo
                      </option>
                      <option
                        value="pericia"
                        style={{ background: "#1c0e00" }}
                      >
                        Perícia
                      </option>
                    </select>

                    {precisaAlvo && (
                      <select
                        value={regra.alvo || ""}
                        onChange={e =>
                          atualizarRegra({ alvo: e.target.value })
                        }
                        style={selectSt}
                      >
                        <option value="" style={{ background: "#1c0e00" }}>
                          —
                        </option>
                        {(regra.escopo === "atributo"
                          ? ATRIBUTOS
                          : PERICIAS
                        ).map(op => (
                          <option
                            key={op}
                            value={op}
                            style={{ background: "#1c0e00" }}
                          >
                            {op}
                          </option>
                        ))}
                      </select>
                    )}

                    <input
                      type="number"
                      value={regra.valor === 0 ? "" : regra.valor}
                      placeholder="0"
                      onChange={e => atualizarRegra({ valor: parseInt(e.target.value) || 0 })}
                      style={modInputSt}
                      onFocus={e =>
                        (e.target.style.borderColor = "#e8a020")
                      }
                      onBlur={e =>
                        (e.target.style.borderColor = "#8b5e1a55")
                      }
                    />

                    <button
                      type="button"
                      onClick={removerRegra}
                      style={{
                        ...btnDangerSt,
                        padding: "5px 0",
                        textAlign: "center",
                      }}
                    >
                      ✕
                    </button>
                  </div>
                );
              })}
            </div>


          </div>

          {/* Observações da Cena */}
          <div style={{ marginBottom: 14 }}>
            <label style={labelSt}>Observações da Cena</label>
            <textarea
              value={cena.observacoes || ""}
              placeholder="Anotações importantes sobre a cena atual..."
              rows={3}
              onChange={e => field("observacoes", e.target.value)}
              style={{ ...inputSt, resize: "vertical" }}
              onFocus={e => (e.target.style.borderColor = "#e8a020")}
              onBlur={e => (e.target.style.borderColor = "#8b5e1a55")}
            />
          </div>

          {/* Botão de Limpar Cena */}
          <div style={{ textAlign: "center" }}>
            <button
              onClick={() => {
                if (confirm("Tem certeza que deseja limpar todas as configurações da cena?")) {
                  onUpdateCena(structuredClone(initialCena), { preservarDuracoes: true });
                }
              }}
              
              style={btnDangerSt}
            >
              LIMPAR CENA
            </button>
          </div>
        </>
      )}
    </Modal>
  );
}

function ControleRodada({ cena, onUpdateCena }) {
  const ativa = cena?.ativa === true;
  const rodada = Math.max(1, parseInt(cena?.rodada) || 1);
  const mudar = nova => onUpdateCena({ ...cena, rodada: Math.max(1, nova) });
  const btn = cor => ({
    padding: "6px 10px", borderRadius: 5, border: `1px solid ${cor}88`,
    background: `${cor}11`, color: cor, fontFamily: "'Cinzel',serif",
    fontSize: 9, letterSpacing: 1, cursor: "pointer",
  });

  return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:8, flexWrap:"wrap", marginBottom:12, padding:"10px 12px", borderRadius:8, border:`1px solid ${ativa ? "#7ec87e66" : "#8b5e1a66"}`, background:"linear-gradient(135deg,#22120066,#180d0066)" }}>
      <div>
        <div style={{ fontFamily:"'Cinzel',serif", fontSize:9, letterSpacing:2, color: ativa ? "#7ec87e" : "#7a5020" }}>
          {ativa ? (cena?.nome?.trim() || "CENA ATIVA") : "CENA INATIVA"}
        </div>
        {ativa && (
          <div style={{ fontFamily:"'Cinzel Decorative','Cinzel',serif", fontSize:20, fontWeight:900, color:"#e8a020" }}>
            Rodada {rodada}
          </div>
        )}
      </div>

      {ativa ? (
        <div style={{ display:"flex", gap:6 }}>
          <button onClick={() => mudar(rodada - 1)} disabled={rodada <= 1} style={{ ...btn("#c8922a"), opacity: rodada <= 1 ? 0.4 : 1 }}>−</button>
          <button onClick={() => mudar(rodada + 1)} style={btn("#7ec87e")}>PRÓXIMA RODADA ▶</button>
        </div>
      ) : (
        <button onClick={() => onUpdateCena({ ...cena, ativa: true })} style={btn("#7ec87e")}>▶ INICIAR CENA</button>
      )}
    </div>
  );
}

function normalizarFicha(dados) {
  if (!dados || typeof dados !== "object" || Array.isArray(dados)) {
    return criarFichaInicial();
  }
  const fichaBase = criarFichaInicial();
  const obj = v => (v && typeof v === "object" && !Array.isArray(v) ? v : {});
  const lista = v => (Array.isArray(v) ? v : []);

  const periciasCompletas = { ...fichaBase.pericias };
  Object.keys(obj(dados.pericias)).forEach(k => {
    if (periciasCompletas[k]) {
      periciasCompletas[k] = { ...periciasCompletas[k], ...obj(dados.pericias[k]) };
    }
  });

  let classesMigradas;
  if (Array.isArray(dados.classes) && dados.classes.length > 0) {
    classesMigradas = dados.classes;
  } else {
    classesMigradas = [{
      id: Date.now() + Math.random(),
      nome: dados.classe || "",
      nivel: dados.nivel || 1,
      pvInicial: dados.evolucao?.pvInicial || 0,
      pvNivel:   dados.evolucao?.pvPorNivel || 0,
      pmInicial: dados.evolucao?.pmInicial || 0,
      pmNivel:   dados.evolucao?.pmPorNivel || 0,
    }];
  }

  return {
    ...fichaBase,
    ...dados,
    atributos:  { ...fichaBase.atributos,  ...obj(dados.atributos) },
    pv:         { ...fichaBase.pv,         ...obj(dados.pv) },
    pvt:        { ...fichaBase.pvt,        ...obj(dados.pvt) },
    pm:         { ...fichaBase.pm,         ...obj(dados.pm) },
    pmt:        { ...fichaBase.pmt,        ...obj(dados.pmt) },
    defesaComp: { ...fichaBase.defesaComp, ...obj(dados.defesaComp) },
    evolucao:   { ...fichaBase.evolucao,   ...obj(dados.evolucao) },
    avatar: { imagem: dados.avatar?.imagem || "" },
    carga: {
      fontesExtras: lista(dados.carga?.fontesExtras)
        .filter(fonte => fonte && typeof fonte === "object")
        .map(fonte => ({
          id: fonte.id ?? Date.now() + Math.random(),
          nome: String(fonte.nome || ""),
          valor: Math.max(0, Number(fonte.valor) || 0),
        })),
    },
    cena: {
      ...fichaBase.cena,
      ...obj(dados.cena),
      modificadores: {
        ...fichaBase.cena.modificadores,
        ...obj(dados.cena?.modificadores),
        pericias: {
          geral: Number(dados.cena?.modificadores?.pericias?.geral) || 0,
          regras: sanearRegrasPericia(dados.cena?.modificadores?.pericias?.regras),
        },
      },
      efeitos: lista(dados.cena?.efeitos),
    },
    classes:   classesMigradas,
    pericias:  periciasCompletas,
    armas:     lista(dados.armas),
    armaduras: lista(dados.armaduras),
    itens:     lista(dados.itens),
    poderes:   lista(dados.poderes),
    condicoes: lista(dados.condicoes),
    magias:    lista(dados.magias),
    magiaConfig: { ...fichaBase.magiaConfig, ...obj(dados.magiaConfig || dados.magia) },
    usaMagia:  typeof dados.usaMagia === "boolean" ? dados.usaMagia : false,
  };
}

export default function App() {
  const [usuario,      setUsuario]      = useState(null);
  const [carregando,   setCarregando]   = useState(false);
  const [aba, setAba] = useState(0);

  // Abas que serão usadas futuramente no modo desktop.
  const [abaEsquerda, setAbaEsquerda] = useState(1); // Combate
  const [abaDireita, setAbaDireita] = useState(3);  // Poderes

  function selecionarAbaEsquerda(id) {
    if (id === abaDireita) setAbaDireita(abaEsquerda);
    setAbaEsquerda(id);
  }
  
  function selecionarAbaDireita(id) {
    if (id === abaEsquerda) setAbaEsquerda(abaDireita);
    setAbaDireita(id);
  }

  const [modoDesktop, setModoDesktop] = useState(() =>
    typeof window !== "undefined"
      ? window.innerWidth >= 1024
      : false
  );

  useEffect(() => {
    function atualizarModo() {
      setModoDesktop(window.innerWidth >= 1024);
    }
  
    window.addEventListener("resize", atualizarModo);
  
    return () => {
      window.removeEventListener("resize", atualizarModo);
    };
  }, []);

  const [ficha, setFicha] = useState(() => criarFichaInicial());
  const [msgSalvo,     setMsgSalvo]     = useState("");
  const [salvoRecente, setSalvoRecente] = useState(false);
  const [resultadoIniciativa, setResultadoIniciativa] = useState(null);
  const [roladorAberto, setRoladorAberto] = useState(false);
  const [historicoAberto, setHistoricoAberto] = useState(false);
  const [historicoRolagens, setHistoricoRolagens] = useState([]);
  const [modalCenaAberto, setModalCenaAberto] = useState(false); // NOVO ESTADO
  const perfilCarregado = useRef(null);

  const ABAS = ficha.usaMagia ? [...ABAS_BASE, ABA_MAGIAS] : ABAS_BASE;

  function entrarPerfil(perfil) {
    setAba(0);
    setAbaEsquerda(1);
    setAbaDireita(3);
    perfilCarregado.current = null;
    setResultadoIniciativa(null);
    setCarregando(true);
    setTimeout(() => {
      try {
        const raw = localStorage.getItem(`t20:ficha:${perfil}`);
        setFicha(raw ? normalizarFicha(JSON.parse(raw)) : criarFichaInicial());
      } catch {
        setFicha(criarFichaInicial());
      }
      setUsuario(perfil);
      setSalvoRecente(true);
      setCarregando(false);
    }, 1200);
  }
  

  // ── AUTOSAVE (com guard: ignora a 1ª execução após carregar o perfil) ──
  useEffect(() => {
    if (!usuario) return;
    if (perfilCarregado.current !== usuario) {
      perfilCarregado.current = usuario;
      return;
    }
    setSalvoRecente(false);
    const t = setTimeout(() => {
      try {
        localStorage.setItem(
          `t20:ficha:${usuario}`,
          JSON.stringify((() => {
            const d = calcularDerivados(ficha);
            return {
              ...ficha,
              nivel: d.nivel,
              pv: { ...ficha.pv, max: d.pvMax },
              pm: { ...ficha.pm, max: d.pmMax },
              _meta: { versao: VERSAO_DADOS_FICHA, atualizadoEm: new Date().toISOString() },
            };
          })())
        );
        setMsgSalvo("✦ Salvo"); setSalvoRecente(true);
        setTimeout(() => setMsgSalvo(""), 2000);
      } catch (erro) {
        const cheio = erro?.name === "QuotaExceededError" || erro?.code === 22;
        setMsgSalvo(cheio ? "⚠ Memória cheia: remova fotos ou exporte fichas" : "⚠ Erro ao salvar");
      }

    }, 2000);
    return () => clearTimeout(t);
  }, [ficha, usuario]);

  function toggleUsaMagia() {
    setFicha(f => ({ ...f, usaMagia: !f.usaMagia }));
  }

  useEffect(() => {
    if (ficha.usaMagia) return;
    if (aba === 5) setAba(0);
    if (abaEsquerda === 5) setAbaEsquerda(abaDireita === 1 ? 0 : 1);
    if (abaDireita === 5) setAbaDireita(abaEsquerda === 3 ? 0 : 3);
  }, [ficha.usaMagia, aba, abaEsquerda, abaDireita]);
  
  function trocarPaineis() {
    setAbaEsquerda(abaDireita);
    setAbaDireita(abaEsquerda);
  }

  function importarFichaAtual(evento) {
    const arquivo = evento.target.files?.[0];
    evento.target.value = ""; // permite reimportar o mesmo arquivo
    if (!arquivo) return;

    const leitor = new FileReader();

    leitor.onload = e => {
      try {
        const dados = JSON.parse(e.target.result);

        const fichaImportada =
          dados?.ficha && typeof dados.ficha === "object"
            ? dados.ficha
            : dados; // aceita arquivo "cru" também

        if (!fichaImportada || typeof fichaImportada !== "object") {
          throw new Error("formato inválido");
        }

        if (
          !confirm(
            "Isto vai SUBSTITUIR a ficha atual do perfil aberto. Continuar?"
          )
        ) {
          return;
        }

        setFicha(normalizarFicha(fichaImportada));

        setResultadoIniciativa(null);

        setMsgSalvo("✦ Ficha importada");
        setTimeout(() => setMsgSalvo(""), 2000);
      } catch {
        setMsgSalvo("⚠ Arquivo inválido");
        setTimeout(() => setMsgSalvo(""), 2000);
      }
    };

    leitor.readAsText(arquivo);
  }

  function exportarFichaAtual() {
    try {
      const backup = {
        tipo: "t20-ficha-individual",
        versao: VERSAO_DADOS_FICHA,
        criadoEm: new Date().toISOString(),
        perfil: usuario,
        ficha,
      };

      const conteudo = JSON.stringify(backup, null, 2);
      const arquivo = new Blob([conteudo], {
        type: "application/json",
      });

      const url = URL.createObjectURL(arquivo);
      const link = document.createElement("a");

      const nomeArquivo =
        (ficha.nome?.trim() || usuario || "ficha")
          .replace(/[^a-z0-9]/gi, "-")
          .toLowerCase();

      link.href = url;
      link.download = `ficha-${nomeArquivo}.json`;

      document.body.appendChild(link);
      link.click();
      link.remove();

      setTimeout(() => URL.revokeObjectURL(url), 1000);

      setMsgSalvo("✦ Ficha exportada");
      setTimeout(() => setMsgSalvo(""), 2000);
    } catch {
      setMsgSalvo("⚠ Erro ao exportar");
      setTimeout(() => setMsgSalvo(""), 2000);
    }
  }

  function sairConta() {
    if (!salvoRecente && !confirm("Sair? Alterações não salvas podem ser perdidas.")) return;
    perfilCarregado.current = null;
    setUsuario(null);
    setFicha(criarFichaInicial());
    setSalvoRecente(false);
    setResultadoIniciativa(null);
    setHistoricoRolagens([]);
    setAba(0);
    setAbaEsquerda(1);
    setAbaDireita(3);
  }

  if (carregando) return <TelaCarregando />;
  if (!usuario)   return <TelaPerfil onEntrar={entrarPerfil} />;

  const classesLista = ficha.classes && ficha.classes.length > 0 ? ficha.classes : [classeVazia()];
  const der = calcularDerivados(ficha);
  const nivelTotal = der.nivel;

  const limitarValor = (barra, max) =>
    barra.valor === "" ? "" : Math.min(Number(barra.valor) || 0, max);
  const pvView = { ...ficha.pv, max: der.pvMax, valor: limitarValor(ficha.pv, der.pvMax) };
  const pmView = { ...ficha.pm, max: der.pmMax, valor: limitarValor(ficha.pm, der.pmMax) };

  const cdMagia = (() => {
    const attr = ficha.magiaConfig?.atributoChave || "INT";
    const modAttr = calcMod(ficha.atributos?.[attr] ?? 10);
    const bonus = parseInt(ficha.magiaConfig?.bonusCD) || 0;
    return 10 + Math.floor(nivelTotal / 2) + modAttr + bonus;
  })();
  const modConGlobal = calcMod(ficha.atributos?.CON ?? 10);
  
  // Só as condições que AINDA valem (permanentes ou com rodadas restantes).
  // As expiradas continuam na lista visual, mas não aplicam mais efeitos.
  const condicoesEfetivas = (ficha.condicoes || []).filter(c => {
    const rest = rodadasRestantes(c, ficha.cena?.rodada || 1);
    return rest === null || rest > 0; // null = permanente
  });

  // ── Modificadores de cena (só valem com a cena ativa) ──
  const cenaAtiva = ficha.cena?.ativa === true;
  const modCena = campo =>
    cenaAtiva
      ? Number(ficha.cena?.modificadores?.[campo]) || 0
      : 0;
  
  // Mapa: nome da perícia -> atributo-base (para escopo "atributo")
  // e conjunto de resistências (para escopo "resistencia").
  const RESISTENCIAS = ["Fortitude", "Reflexos", "Vontade"];

  /*
   * Retorna o modificador de cena aplicável a UMA perícia,
   * somando o "geral" (exceto Iniciativa) + todas as regras
   * cujo escopo/alvo casem com a perícia.
   *
   * @param {string} nome  - nome da perícia (ex.: "Atletismo")
   * @param {string} atrib - atributo-base (ex.: "FOR", "DES"...)
   */
  const calcModCenaPericia = (nome, atrib) => {
    if (!cenaAtiva) return 0;

    const mp = ficha.cena?.modificadores?.pericias || {};
    let total = 0;

    // 1) "geral" clássico — imune apenas para Iniciativa.
    if (nome !== "Iniciativa") {
      total += Number(mp.geral) || 0;
    }

    // 2) regras segmentadas.
    const regras = Array.isArray(mp.regras) ? mp.regras : [];
    for (const r of regras) {
      const valor = Number(r?.valor) || 0;
      if (!valor) continue;

      switch (r?.escopo) {
        case "todas":
          // "todas" NÃO atinge Iniciativa (mesma regra do geral).
          if (nome !== "Iniciativa") total += valor;
          break;
        case "resistencia":
          if (RESISTENCIAS.includes(nome)) total += valor;
          break;
        case "atributo":
          if (r?.alvo && atrib === r.alvo) total += valor;
          break;
        case "pericia":
          if (r?.alvo && nome === r.alvo) total += valor;
          break;
        default:
          break;
      }
    }

    return total;
  };

  
  const { pvCalculado, pmCalculado } = der;

  const set = (k, v) => setFicha(f => ({ ...f, [k]: v }));
  const setAtrib       = (k, v)      => setFicha(f => ({ ...f, atributos: { ...f.atributos, [k]: v } }));
  const setBarra       = (t, c, v)   => setFicha(f => ({ ...f, [t]: { ...f[t], [c]: v } }));
  const setArma        = (id, c, v)  => setFicha(f => ({ ...f, armas: f.armas.map(a => a.id===id ? { ...a, [c]: v } : a) }));
  const addArma        = ()          => setFicha(f => ({ ...f, armas: [...(f.armas||[]), armaVazia()] }));
  const removeArma = id => {
    const arma = (ficha.armas || []).find(a => a.id === id);
    if (!confirmarRemocao("a arma", arma?.nome)) return;
    setFicha(f => ({ ...f, armas: f.armas.filter(a => a.id !== id) }));
  };
  const moverArma = (id, direcao) =>
  setFicha(f => {
    const lista = [...(f.armas || [])];
    const i = lista.findIndex(a => a.id === id);
    const j = i + direcao;
    if (i < 0 || j < 0 || j >= lista.length) return f;
    [lista[i], lista[j]] = [lista[j], lista[i]];
    return { ...f, armas: lista };
  });
  const setItem        = (id, c, v)  => setFicha(f => ({ ...f, itens: f.itens.map(i => i.id===id ? { ...i, [c]: v } : i) }));
  const addItem        = ()          => setFicha(f => ({ ...f, itens: [...(f.itens||[]), itemVazio()] }));

  const setFonteCarga = (id, campo, valor) =>
    setFicha(f => ({
      ...f,
      carga: {
        ...(f.carga || {}),
        fontesExtras: (f.carga?.fontesExtras || []).map(
          fonte =>
            fonte.id === id
              ? {
                  ...fonte,
                  [campo]:
                    campo === "valor"
                      ? valor === ""
                        ? 0
                        : Math.max(
                            0,
                            Number(valor) || 0
                          )
                      : valor,
                }
              : fonte
        ),
      },
    }));
  
  const addFonteCarga = () =>
    setFicha(f => ({
      ...f,
      carga: {
        ...(f.carga || {}),
        fontesExtras: [
          ...(f.carga?.fontesExtras || []),
          fonteCargaVazia(),
        ],
      },
    }));
  
  const removeFonteCarga = id => {
    const fonte = (ficha.carga?.fontesExtras || []).find(x => x.id === id);
    if (!confirmarRemocao("a fonte de carga", fonte?.nome)) return;
    setFicha(f => ({
      ...f,
      carga: { ...(f.carga || {}), fontesExtras: (f.carga?.fontesExtras || []).filter(x => x.id !== id) },
    }));
  };

  
  const removeItem = id => {
    const item = (ficha.itens || []).find(i => i.id === id);
    if (!confirmarRemocao("o item", item?.descricao)) return;
    setFicha(f => ({ ...f, itens: f.itens.filter(i => i.id !== id) }));
  };

  const moverItem = (id, direcao) =>
  setFicha(f => {
    const lista = [...(f.itens || [])];
    const i = lista.findIndex(item => item.id === id);
    const j = i + direcao; // -1 = sobe, +1 = desce
    if (i < 0 || j < 0 || j >= lista.length) return f;
    [lista[i], lista[j]] = [lista[j], lista[i]];
    return { ...f, itens: lista };
  });

  const setArmadura    = (id, c, v)  => setFicha(f => ({ ...f, armaduras: f.armaduras.map(a => a.id===id ? { ...a, [c]: v } : a) }));
  const addArmadura    = ()          => setFicha(f => ({ ...f, armaduras: [...(f.armaduras||[]), armaduraVazia()] }));
  const removeArmadura = id => {
    const arm = (ficha.armaduras || []).find(a => a.id === id);
    if (!confirmarRemocao("o equipamento", arm?.nome)) return;
    setFicha(f => ({ ...f, armaduras: f.armaduras.filter(a => a.id !== id) }));
  };
  
  const setDefComp     = (campo,val) => setFicha(f => ({ ...f, defesaComp: { ...(f.defesaComp||{}), [campo]: parseInt(val)||0 } }));
  const togglePericia  = k           => setFicha(f => ({ ...f, pericias: { ...f.pericias, [k]: { ...f.pericias[k], treinado: !f.pericias[k].treinado } } }));
  const setPericiaBon  = (k, v)      => setFicha(f => ({ ...f, pericias: { ...f.pericias, [k]: { ...f.pericias[k], outros: parseInt(v)||0 } } }));
  const addPoder       = cat         => setFicha(f => ({ ...f, poderes: [...(f.poderes||[]), poderVazio(cat)] }));
  const updatePoder    = (id, dados) => setFicha(f => ({ ...f, poderes: f.poderes.map(p => p.id===id ? dados : p) }));
  const removePoder = id => {
    const poder = (ficha.poderes || []).find(p => p.id === id);
    if (!confirmarRemocao("o poder", poder?.nome)) return;
    setFicha(f => ({ ...f, poderes: f.poderes.filter(p => p.id !== id) }));
  };
  
  const moverPoder = (id, direcao) =>
  setFicha(f => {
    const lista = [...(f.poderes || [])];
    const i = lista.findIndex(p => p.id === id);
    const j = i + direcao;
    if (i < 0 || j < 0 || j >= lista.length) return f;
    [lista[i], lista[j]] = [lista[j], lista[i]];
    return { ...f, poderes: lista };
  });
  const setCondicoes = lista => {
    setResultadoIniciativa(null);

    setFicha(f => ({
      ...f,
      condicoes: lista,
    }));
  };
  // grimório (array) — usado pela AbaGrimorio
  const setMagias = lista => setFicha(f => ({ ...f, magias: lista }));
  function lancarMagia(magia) {
    const alquebrado = condicoesEfetivas.some(c => c.nome === "Alquebrado");
    const custo = custoMagia(magia) + (alquebrado ? 1 : 0);
    const pmAtual = Math.max(0, Number(pmView.valor) || 0);
    const pmtAtual = Math.max(0, Number(ficha.pmt?.valor) || 0);
    const nome = magia.nome || "Magia";

    if (pmAtual + pmtAtual < custo) {
      return `PM insuficientes: ${nome} custa ${custo} PM (você tem ${pmAtual + pmtAtual}).`;
    }

    const usaTemp = Math.min(pmtAtual, custo);
    const usaNormal = custo - usaTemp;
    setBarra("pmt", "valor", pmtAtual - usaTemp);
    setBarra("pm", "valor", pmAtual - usaNormal);

    return `✦ ${nome} lançada: −${custo} PM` +
      (usaTemp > 0 ? ` (${usaTemp} temporários)` : "") +
      (alquebrado ? " · Alquebrado +1" : "") + ".";
  }
  // config de CD (objeto) — usado onde você exibir/editar a CD
  const setMagiaConfig = (campo, valor) =>
  setFicha(f => ({ ...f, magiaConfig: { ...f.magiaConfig, [campo]: valor } }));
  const setEvolucao    = (campo, valor) => setFicha(f => ({ ...f, evolucao: { ...(f.evolucao||{}), [campo]: valor } }));
  const setClasse    = (id, c, v) => setFicha(f => ({ ...f, classes: f.classes.map(cl => cl.id===id ? { ...cl, [c]: v } : cl) }));
  const addClasse    = ()         => setFicha(f => ({ ...f, classes: [...(f.classes||[]), classeVazia()] }));
  const removeClasse = id         => setFicha(f => ({ ...f, classes: (f.classes||[]).length > 1 ? f.classes.filter(cl => cl.id!==id) : f.classes }));
  const updateCena = (novaCena, { preservarDuracoes = false } = {}) =>
  setFicha(f => {
    const delta = (novaCena?.rodada ?? 1) - (f.cena?.rodada ?? 1);

    const condicoes =
      preservarDuracoes && delta !== 0
        ? (f.condicoes || []).map(c =>
            c.permanente || c.duracao == null
              ? c
              : { ...c, rodadaInicio: (c.rodadaInicio ?? 1) + delta }
          )
        : f.condicoes;

    return { ...f, cena: novaCena, condicoes };
  });
 // NOVA FUNÇÃO

  const modFor      = calcMod(ficha.atributos["FOR"]);
  const modDes      = calcMod(ficha.atributos["DES"]);
  const limCargaBase =
    modFor >= 0
      ? 10 + 2 * modFor
      : 10 + modFor;

  const extrasFontes =
    (ficha.carga?.fontesExtras || []).reduce(
      (total, fonte) =>
        total +
        Math.max(
          0,
          Number(fonte.valor) || 0
        ),
      0
    );
    
  const limCarga =
    limCargaBase + extrasFontes;

  const cargaMax =
    limCarga * 2;

  const totalEspaco =
    (ficha.itens || []).reduce(
      (acc, i) =>
        acc + (parseFloat(i.espaco) || 0),
      0
    );
  const cargaMaxSegura =
    Math.max(1, cargaMax);
  
  const pctCarga =
    Math.min(
      100,
      (totalEspaco / cargaMaxSegura) * 100
    );
  const corCarga    = totalEspaco > cargaMax ? "#e06060" : totalEspaco > limCarga ? "#e8a020" : "#7ec87e";

  const sobrecarregado =
    totalEspaco > limCarga ||
    condicoesEfetivas.some(c => c.nome === "Sobrecarregado");

  const penAtaqueCondicoes = (() => {
    const nomes = condicoesEfetivas.map(c => c.nome);
    let total = 0;
    const detalhes = [];
    [["Agarrado", -2], ["Enredado", -2], ["Ofuscado", -2]].forEach(([n, v]) => {
      if (nomes.includes(n)) { total += v; detalhes.push(`${n} ${v}`); }
    });
    return { total, detalhes };
  })();

  const calcPericia = nome => {
    const PERICIAS_PEN_ARMADURA = [
      "Acrobacia",
      "Furtividade",
      "Ladinagem",
    ];

    const dadosPericia = ficha.pericias?.[nome] || {};

    const atributo =
      dadosPericia.atrib ||
      PERICIAS_ATRIB_PADRAO[nome] ||
      "DES";

    const valorAtributo =
      ficha.atributos?.[atributo] ?? 10;

    const mod = calcMod(valorAtributo);

    const trein =
      dadosPericia.treinado
        ? bonusTreinamento(nivelTotal)
        : 0;
    
    const penArmad = PERICIAS_PEN_ARMADURA.includes(nome)
      ? (der.penArmadura) + (sobrecarregado ? -5 : 0)
      : 0;

    const outros =
      parseInt(dadosPericia.outros) || 0;

    /*
     * Modificador de cena aplicável a esta perícia.
     * O helper soma o "geral" + as regras segmentadas
     * (todas, resistência, atributo, perícia específica).
     * Iniciativa é imune ao "geral" e ao escopo "todas".
     */
    const modCena = calcModCenaPericia(nome, atributo);

    return (
      Math.floor(nivelTotal / 2) +
      mod +
      trein +
      outros +
      penArmad +
      modCena
    );
  };

  
  const iniciativaBase =
    calcPericia("Iniciativa");
  
  const efeitosIniciativa = calcularEfeitosPericiaCondicoes(
    condicoesEfetivas,
    "Iniciativa",
    "DES"
  );

  const iniciativaTotal =
  iniciativaBase + efeitosIniciativa.modificador + modCena("iniciativa");
  
    function rolarIniciativa() {
      const natural =
        Math.floor(Math.random() * 20) + 1;
    
      const total =
        natural + iniciativaTotal;
    
      const resultado = {
        natural,
        bonus: iniciativaTotal,
        total,
      };
    
      setResultadoIniciativa(resultado);
    
      registrarRolagem({
        tipo: "Iniciativa",
        nome: "Iniciativa",
        ...resultado,
      });
    }

    function registrarRolagem({
      tipo,
      nome,
      total,
      ...dadosExtras
    }) {
      const novaRolagem = {
        id: Date.now() + Math.random(),
        tipo: tipo || "Rolagem",
        nome: nome || "Sem nome",
        total: Number.isFinite(Number(total))
          ? Number(total)
          : 0,
        ...dadosExtras,
        criadoEm: new Date().toLocaleTimeString(
          "pt-BR",
          {
            hour: "2-digit",
            minute: "2-digit",
          }
        ),
      };
    
      setHistoricoRolagens(lista => [
        novaRolagem,
        ...lista,
      ].slice(0, 20));
    }
  
  function registrarRolagemArma(resultado) {
    registrarRolagem(resultado);
  }

  function registrarRolagemPericia(resultado) {
    registrarRolagem({
      tipo: "Perícia",
      ...resultado,
    });
  }
  
  function limparHistoricoRolagens() {
    setHistoricoRolagens([]);
  }



// setter do deslocamento base
const setDeslocamento = (v) =>
  setFicha(f => ({ ...f, deslocamento: v === "" ? "" : Math.max(0, parseInt(v) || 0) }));

// cálculo do deslocamento final com penalidades de condições/carga
const deslocamentoFinal = (() => {
  const base = parseInt(ficha.deslocamento) || 0;
  let valor = base;
  const motivos = [];
  const nomes = condicoesEfetivas.map(c => c.nome);
  const tem = n => nomes.includes(n);

  if (tem("Imóvel") || tem("Paralisado") || tem("Inconsciente") ||
      tem("Petrificado") || tem("Indefeso") || tem("Agarrado")) {
    return { base, valor: 0, motivos: ["imobilizado"] };
  }

  if (tem("Caído")) {
    return { base, valor: 1.5, motivos: ["caído"] };
  }

  if (tem("Lento") || tem("Cego") || tem("Exausto") || tem("Enredado")) {
    valor = Math.floor(valor / 2);
    motivos.push("lento");
  }

  if (tem("Sobrecarregado") || totalEspaco > limCarga) {
    valor = Math.max(0, valor - 3);
    motivos.push("sobrecarregado −3m");
  }

  return { base, valor, motivos };
})();

  
const dc = ficha.defesaComp || {};

const defesaBase =
  10 +
  modDes +
  (der.bonArmadura) +
  (der.bonEscudo) +
  (parseInt(dc.outros) || 0) +
  modCena("defesa");


const efeitosDefesa =
  calcularDefesaCondicoes(condicoesEfetivas);

const defTotal =
  defesaBase + efeitosDefesa.modificadorBase;

const defCorpoACorpo =
  defesaBase +
  efeitosDefesa.modificadorCorpoACorpo;

const defDistancia =
  defesaBase +
  efeitosDefesa.modificadorDistancia;

  const btnTopo = {
    width: 30,
    height: 28,
    boxSizing: "border-box",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 0,
    background: "transparent",
    border: "1px solid #8b5e1a55",
    borderRadius: 4,
    color: "#c8922a",
    fontFamily: "'Cinzel',serif",
    fontSize: 14,
    lineHeight: 1,
    cursor: "pointer",
  };

  const inputDef = {
    background:"#0d070088", border:"1px solid #8b5e1a55", borderRadius:4,
    color:"#f0d8a0", fontFamily:"'Cinzel',serif", fontSize:13,
    textAlign:"center", padding:"5px 4px", outline:"none",
    width:"100%", boxSizing:"border-box",
  };

function renderizarAba(id) {
  switch (id) {
    case 0: //Herói//
      return (
        <>
          <Secao icone="📋" titulo="Identificação">
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginBottom: 14,
                }}
              >
                <AvatarFicha
                  imagem={ficha.avatar?.imagem || ""}
                  nome={ficha.nome}
                  onChange={imagem =>
                    setFicha(f => ({
                      ...f,
                      avatar: {
                        ...(f.avatar || {}),
                        imagem,
                      },
                    }))
                  }
                />
              </div>
              <div style={{ marginBottom:10 }}>
                <span style={s.label}>Nome do Personagem</span>
                <input style={s.input} value={ficha.nome} placeholder="Digite o nome..."
                  onChange={e => set("nome", e.target.value)}
                  onFocus={e => e.target.style.borderColor="#e8a020"}
                  onBlur={e =>  e.target.style.borderColor="#8b5e1a"} />
              </div>
              <div style={{ ...s.grid2, marginBottom:10 }}>
                <div>
                  <span style={s.label}>Raça</span>
                  <input style={s.input} value={ficha.raca} placeholder="Ex: Meio-Orc"
                    onChange={e => set("raca", e.target.value)}
                    onFocus={e => e.target.style.borderColor="#e8a020"}
                    onBlur={e =>  e.target.style.borderColor="#8b5e1a"} />
                </div>
                <div>
                  <span style={s.label}>Origem</span>
                  <input style={s.input} value={ficha.origem} placeholder="Soldado"
                    onChange={e => set("origem", e.target.value)}
                    onFocus={e => e.target.style.borderColor="#e8a020"}
                    onBlur={e =>  e.target.style.borderColor="#8b5e1a"} />
                </div>
              </div>
              <div style={{ marginBottom:10 }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
                  <span style={s.label}>Classe(s)</span>
                </div>

                {classesLista.map((cl, idx) => (
                  <div key={cl.id} style={{ display:"grid", gridTemplateColumns:"1fr 62px 26px", gap:6, marginBottom:6, alignItems:"center" }}>
                    <input style={s.input} value={cl.nome} placeholder={idx===0 ? "Ex: Guerreiro" : "Classe secundária"}
                      onChange={e => setClasse(cl.id, "nome", e.target.value)}
                      onFocus={e => e.target.style.borderColor="#e8a020"}
                      onBlur={e =>  e.target.style.borderColor="#8b5e1a"} />
                    <input style={{ ...s.input, textAlign:"center" }} type="number" min={1} value={cl.nivel === "" ? "" : cl.nivel}
                      placeholder="Nv"
                      onChange={e => setClasse(cl.id, "nivel", e.target.value === "" ? "" : Math.max(1, parseInt(e.target.value)||1))}
                      onFocus={e => { e.target.style.borderColor="#e8a020"; e.target.select(); }}
                      onBlur={e =>  { e.target.style.borderColor="#8b5e1a"; setClasse(cl.id, "nivel", Math.max(1, parseInt(e.target.value)||1)); }} />
                    {classesLista.length > 1
                      ? <button onClick={() => removeClasse(cl.id)} style={{ width:26, height:36, borderRadius:4, border:"1px solid #5a1a1a", background:"#2a0d0d88", color:"#e06060", fontSize:13, cursor:"pointer" }}>✕</button>
                      : <span />}
                  </div>
                ))}

                <button onClick={addClasse} style={{ width:"100%", padding:"6px 0", background:"linear-gradient(180deg,#2a1800,#1a0e00)", border:"1px dashed #8b5e1a", borderRadius:5, color:"#7a5020", fontFamily:"'Cinzel',serif", fontSize:9, letterSpacing:2, cursor:"pointer" }}>+ ADICIONAR CLASSE (MULTICLASSE)</button>

                <div style={{ textAlign:"center", marginTop:6, fontFamily:"'Cinzel',serif", fontSize:10, letterSpacing:1, color:"#c8922a" }}>
                  Nível Total do Personagem: <b style={{ color:"#e8a020", fontSize:13 }}>{nivelTotal}</b>
                </div>
              </div>              
              <div style={s.grid2}>                  
                <div>
                  <span style={s.label}>Divindade</span>
                  <input style={s.input} value={ficha.divindade} placeholder="Arsenal"
                    onChange={e => set("divindade", e.target.value)}
                    onFocus={e => e.target.style.borderColor="#e8a020"}
                    onBlur={e =>  e.target.style.borderColor="#8b5e1a"} />
                </div>
                <div onClick={toggleUsaMagia} style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:7, padding:"5px 9px", borderRadius:6, border:`1px solid ${ficha.usaMagia?"#a06ad4":"#3a2a10"}`, background:ficha.usaMagia?"#a06ad411":"transparent", cursor:"pointer", width:"100%", boxSizing:"border-box", alignSelf:"end", height:31 }}>
                <div style={{ width:15, height:15, borderRadius:4, border:`1px solid ${ficha.usaMagia?"#a06ad4":"#3a2a10"}`, background:ficha.usaMagia?"#a06ad4":"transparent", display:"flex", alignItems:"center", justifyContent:"center", fontSize:9, color:"#fff" }}>{ficha.usaMagia?"✦":""}</div>
                <span style={{ fontFamily:"'Cinzel',serif", fontSize:9, letterSpacing:1, color:ficha.usaMagia?"#a06ad4":"#7a5020" }}>USA MAGIA?</span>
                </div>
              </div>
            </Secao>

            <DiamondDivider />

            <Secao icone="💪" titulo="Atributos">
              <div style={s.atribGrid}>
                {ATRIBUTOS.map(a => (
                  <AtribBox key={a} nome={a} valor={ficha.atributos[a]} onChange={v => setAtrib(a, v)} />
                ))}
              </div>
            </Secao>

            <DiamondDivider />

            <Secao icone="📈" titulo="Evolução de PV & PM">
              <div style={{ fontFamily:"'Cinzel',serif", fontSize:9, letterSpacing:1, color:"#7a5020", marginBottom:12, lineHeight:1.5 }}>
                Preencha os valores de <b style={{color:"#c8922a"}}>cada classe</b>. A CON ({modConGlobal>=0?"+":""}{modConGlobal}) é somada automaticamente ao PV inicial e por nível.
              </div>

              {classesLista.map((cl, idx) => (
                <div key={cl.id} style={{ marginBottom:14, padding:"10px 12px", border:"1px solid #8b5e1a55", borderRadius:8, background:"#22120066" }}>
                  <div style={{ fontFamily:"'Cinzel',serif", fontSize:11, letterSpacing:1, color:"#e8a020", marginBottom:10 }}>
                    ⚔ {cl.nome || `Classe ${idx+1}`} <span style={{ color:"#7a5020", fontSize:9 }}>(Nv {cl.nivel})</span>
                    {idx===0 && <span style={{ color:"#7a5020", fontSize:8, marginLeft:6 }}>· classe inicial</span>}
                  </div>

                  {idx === 0 && (
                    <div style={{ ...s.grid2, marginBottom:8 }}>
                      <div>
                        <span style={s.label}>PV Inicial (1º Nv)</span>
                        <input style={s.input} type="number" value={cl.pvInicial === 0 ? "" : cl.pvInicial} placeholder="0"
                          onChange={e => setClasse(cl.id, "pvInicial", parseInt(e.target.value)||0)}
                          onFocus={e => e.target.style.borderColor="#e8a020"}
                          onBlur={e =>  e.target.style.borderColor="#8b5e1a"} />
                      </div>
                      <div>
                        <span style={s.label}>PM Inicial (1º Nv)</span>
                        <input style={s.input} type="number" value={cl.pmInicial === 0 ? "" : cl.pmInicial} placeholder="0"
                          onChange={e => setClasse(cl.id, "pmInicial", parseInt(e.target.value)||0)}
                          onFocus={e => e.target.style.borderColor="#e8a020"}
                          onBlur={e =>  e.target.style.borderColor="#8b5e1a"} />
                      </div>
                    </div>
                  )}

                  <div style={s.grid2}>
                    <div>
                      <span style={s.label}>PV por Nível</span>
                      <input style={s.input} type="number" value={cl.pvNivel === 0 ? "" : cl.pvNivel} placeholder="0"
                        onChange={e => setClasse(cl.id, "pvNivel", parseInt(e.target.value)||0)}
                        onFocus={e => e.target.style.borderColor="#e8a020"}
                        onBlur={e =>  e.target.style.borderColor="#8b5e1a"} />
                    </div>
                    <div>
                      <span style={s.label}>PM por Nível</span>
                      <input style={s.input} type="number" value={cl.pmNivel === 0 ? "" : cl.pmNivel} placeholder="0"
                        onChange={e => setClasse(cl.id, "pmNivel", parseInt(e.target.value)||0)}
                        onFocus={e => e.target.style.borderColor="#e8a020"}
                        onBlur={e =>  e.target.style.borderColor="#8b5e1a"} />
                    </div>
                  </div>
                </div>
              ))}

              <DiamondDivider />

              <div style={{ ...s.grid2, marginBottom:12 }}>
                <div>
                  <span style={s.label}>Bônus adicional PV</span>
                  <input style={s.input} type="number" value={ficha.evolucao?.bonusPV || ""} placeholder="0"
                    onChange={e => setEvolucao("bonusPV", parseInt(e.target.value)||0)}
                    onFocus={e => e.target.style.borderColor="#e8a020"}
                    onBlur={e =>  e.target.style.borderColor="#8b5e1a"} />
                </div>
                <div>
                  <span style={s.label}>Bônus adicional PM</span>
                  <input style={s.input} type="number" value={ficha.evolucao?.bonusPM || ""} placeholder="0"
                    onChange={e => setEvolucao("bonusPM", parseInt(e.target.value)||0)}
                    onFocus={e => e.target.style.borderColor="#e8a020"}
                    onBlur={e =>  e.target.style.borderColor="#8b5e1a"} />
                </div>
              </div>

              <div style={{ marginBottom:12 }}>
                <span style={s.label}>Observações</span>
                <textarea style={s.textarea} rows={3} value={ficha.evolucao?.observacoes || ""} placeholder="Anotações sobre a evolução de PV/PM..."
                  onChange={e => setEvolucao("observacoes", e.target.value)}
                  onFocus={e => e.target.style.borderColor="#e8a020"}
                  onBlur={e =>  e.target.style.borderColor="#8b5e1a"} />
              </div>

              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, padding:"12px", border:"1px solid #c8922a", borderRadius:8, background:"#e8a02011" }}>
                <div style={{ textAlign:"center" }}>
                  <span style={{ ...s.label, display:"block", marginBottom:4 }}>PV Total (Nv. {nivelTotal})</span>
                  <span style={{ fontFamily:"'Cinzel Decorative','Cinzel',serif", fontSize:24, color:"#e8a020", fontWeight:900 }}>{pvCalculado}</span>
                </div>
                <div style={{ textAlign:"center" }}>
                  <span style={{ ...s.label, display:"block", marginBottom:4 }}>PM Total (Nv. {nivelTotal})</span>
                  <span style={{ fontFamily:"'Cinzel Decorative','Cinzel',serif", fontSize:24, color:"#a06ad4", fontWeight:900 }}>{pmCalculado}</span>
                </div>
              </div>

              <div style={{ fontFamily:"'Cinzel',serif", fontSize:8, letterSpacing:1, color:"#7a5020", marginTop:8, textAlign:"center" }}>
                ✦ Os máximos de PV/PM na aba Combate são atualizados automaticamente
              </div>
            </Secao>
        </>
      );

    case 1: //Combate//
      return (
        <>
          <Secao icone="❤️" titulo="Vitalidade & Mana">
              
              <Barra label="PONTOS DE VIDA"  icone="🩸" valor={pvView.valor}
  max={der.pvMax}     gradA="#c02020" gradB="#601010" allowNegative showStatus maxAutomatico onChange={(c,v) => setBarra("pv",  c, v)} />
              <Barra label="PV TEMPORÁRIOS"  icone="💛" valor={ficha.pvt.valor} max={ficha.pvt.max} gradA="#c8922a" gradB="#6a4010" livre onChange={(c,v) => setBarra("pvt", c, v)} />
              <Barra label="PONTOS DE MANA"  icone="🔮" valor={pmView.valor}
  max={der.pmMax}     gradA="#3070d0" gradB="#102060" maxAutomatico onChange={(c,v) => setBarra("pm",  c, v)} />
              <Barra label="PM TEMPORÁRIOS"  icone="🔷" valor={ficha.pmt.valor} max={ficha.pmt.max} gradA="#40a0c0" gradB="#104050" livre onChange={(c,v) => setBarra("pmt", c, v)} />

              <ControlesCombate
                pv={pvView}
                pvt={ficha.pvt}
                pm={pmView}
                pmt={ficha.pmt}
                onChangePv={valor =>
                  setBarra("pv", "valor", valor)
                }
                onChangePvt={valor =>
                  setBarra("pvt", "valor", valor)
                }
                onChangePm={valor =>
                  setBarra("pm", "valor", valor)
                }
                onChangePmt={valor =>
                  setBarra("pmt", "valor", valor)
                }
              />
            </Secao>

            <DiamondDivider />

            <Secao icone="👟" titulo="Deslocamento">
              <div style={{ display:"flex", alignItems:"center", gap:14 }}>
                <div style={{
                  width:64, height:64, borderRadius:"50%", flexShrink:0,
                  background:"linear-gradient(135deg,#3a1e00,#1c0e00)",
                  border:`2px solid ${deslocamentoFinal.motivos.length ? "#e06060" : "#c8922a"}`,
                  display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
                  boxShadow:`0 0 12px ${deslocamentoFinal.motivos.length ? "#e0606044" : "#c8922a44"}`
                }}>
                  <div style={{ fontFamily:"'Cinzel Decorative','Cinzel',serif", fontSize:20, fontWeight:900, color:deslocamentoFinal.motivos.length ? "#e06060" : "#e8a020", lineHeight:1 }}>
                    {deslocamentoFinal.valor}
                  </div>
                  <div style={{ fontFamily:"'Cinzel',serif", fontSize:8, color:"#7a5020", letterSpacing:1 }}>METROS</div>
                </div>

                <div style={{ flex:1 }}>
                  <span style={s.label}>Deslocamento Base (m)</span>
                  <input
                    type="number"
                    style={{ ...s.input, marginTop:4 }}
                    value={ficha.deslocamento === "" ? "" : ficha.deslocamento}
                    placeholder="9"
                    onChange={e => setDeslocamento(e.target.value)}
                    onFocus={e => e.target.style.borderColor="#e8a020"}
                    onBlur={e => { e.target.style.borderColor="#8b5e1a"; if(ficha.deslocamento==="") setDeslocamento(9); }}
                  />
                  {deslocamentoFinal.motivos.length > 0 && (
                    <div style={{ marginTop:6, fontFamily:"'Cinzel',serif", fontSize:8, letterSpacing:0.5, color:"#e06060", lineHeight:1.5 }}>
                      ⚠ {deslocamentoFinal.base}m → {deslocamentoFinal.valor}m ({deslocamentoFinal.motivos.join(", ")})
                    </div>
                  )}
                </div>
              </div>
            </Secao>

            <DiamondDivider />

            <Secao icone="⚔️" titulo="Ataques">
            {penAtaqueCondicoes.detalhes.length > 0 && (
                <div style={{ fontFamily:"'Cinzel',serif", fontSize:8, color:"#e06060", marginBottom:6 }}>
                  ⚠ Ataques: {penAtaqueCondicoes.detalhes.join(", ")}
                </div>
              )}
              <div style={{ overflowX:"auto", WebkitOverflowScrolling:"touch", marginBottom:6 }}>
                <div style={{ minWidth:580 }}>
                  <div style={{ display:"grid", gridTemplateColumns:"210px 50px 60px 60px 60px 60px 26px 26px", gap:4, marginBottom:6
, fontFamily:"'Cinzel',serif", fontSize:8, letterSpacing:1, color:"#7a5020", textTransform:"uppercase", borderBottom:"1px solid #3a2a1066", paddingBottom:5 }}>
                    <span>Arma</span>
                    <span style={{ textAlign:"center" }}>Teste</span>
                    <span style={{ textAlign:"center" }}>Dano</span>
                    <span style={{ textAlign:"center" }}>Crítico</span>
                    <span style={{ textAlign:"center" }}>Tipo</span>
                    <span style={{ textAlign:"center" }}>Alcance</span>
                    <span />
                    <span />
                  </div>
                  {(ficha.armas||[]).map((arma, idx) => (
                    <div key={arma.id} style={{ display:"grid", gridTemplateColumns:"210px 50px 60px 60px 60px 60px 26px 26px", gap:4, marginBottom:5, alignItems:"center" }}>

                      {[
                        { campo:"nome",     ph:"Espada Longa" },
                        { campo:"teste",    ph:"+12"          },
                        { campo:"dano",     ph:"1d8+5"        },
                        { campo:"critico",  ph:"19/×2"        },
                        { campo:"tipo",     ph:"Corte"        },
                        { campo:"alcance",  ph:"Curto"        },
                      ].map(({ campo, ph }) => (
                        <input key={campo} value={arma[campo]} placeholder={ph}
                          onChange={e => setArma(arma.id, campo, e.target.value)}
                          style={{ background:"#0d070088", border:"1px solid #8b5e1a55", borderRadius:4, color:"#f0d8a0", fontFamily:campo==="nome"?"'Merriweather',Georgia,serif":"'Cinzel',serif", fontSize:campo==="nome"?12:10, padding:"5px 6px", outline:"none", width:"100%", boxSizing:"border-box", textAlign:campo==="nome"?"left":"center" }}
                          onFocus={e => e.target.style.borderColor="#e8a020"}
                          onBlur={e =>  e.target.style.borderColor="#8b5e1a55"} />
                      ))}
                        <div style={{ display:"flex", flexDirection:"column", gap:2 }}>
                        <button onClick={() => moverArma(arma.id, -1)} disabled={idx===0} title="Mover para cima"
                          style={{ height:12, borderRadius:3, border:"1px solid #8b5e1a55", background:"#0d070088", color:idx===0?"#3a2a10":"#c8922a", fontSize:9, lineHeight:1, cursor:idx===0?"not-allowed":"pointer", opacity:idx===0?0.4:1 }}>▲</button>
                        <button onClick={() => moverArma(arma.id, 1)} disabled={idx===(ficha.armas||[]).length-1} title="Mover para baixo"
                          style={{ height:12, borderRadius:3, border:"1px solid #8b5e1a55", background:"#0d070088", color:idx===(ficha.armas||[]).length-1?"#3a2a10":"#c8922a", fontSize:9, lineHeight:1, cursor:idx===(ficha.armas||[]).length-1?"not-allowed":"pointer", opacity:idx===(ficha.armas||[]).length-1?0.4:1 }}>▼</button>
                      </div>

                      <button onClick={() => removeArma(arma.id)} style={{ width:24, height:26, borderRadius:4, border:"1px solid #5a1a1a", background:"#2a0d0d88", color:"#e06060", fontSize:13, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>✕</button>
                      <div
                        style={{
                          gridColumn: "1 / -1",
                        }}
                      >
                        <AcoesArma
                            arma={arma}
                            bonusAtaque={(Number(ficha.bonAtaque) || 0) + modCena("ataque") + penAtaqueCondicoes.total}
                            bonusDano={(Number(ficha.bonDano) || 0) + modCena("dano")}
                            onResultado={registrarRolagemArma}
                          />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <button onClick={addArma} style={{ marginTop:6, width:"100%", padding:"7px 0", background:"linear-gradient(180deg,#2a1800,#1a0e00)", border:"1px dashed #8b5e1a", borderRadius:5, color:"#7a5020", fontFamily:"'Cinzel',serif", fontSize:9, letterSpacing:2, cursor:"pointer" }}>+ ADICIONAR ARMA</button>
            </Secao>
            
            <DiamondDivider />

            <Secao icone="🛡️" titulo="Defesa">
  
  {/* ── Círculo de Defesa Total + Componentes ── */}
  <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
    <div style={{
      width:64, height:64, borderRadius:"50%", flexShrink:0,
      background:"linear-gradient(135deg,#3a1e00,#1c0e00)",
      border:"2px solid #c8922a",
      display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
      boxShadow:"0 0 12px #c8922a44"
    }}>
      <div style={{ fontFamily:"'Cinzel',serif", fontSize:9, color:"#7a5020", letterSpacing:1 }}>DEF</div>
      <div style={{ fontFamily:"'Cinzel Decorative','Cinzel',serif", fontSize:22, fontWeight:900, color:"#e8a020", lineHeight:1 }}>{defTotal}</div>
    </div>

    <div style={{ flex:1, display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr", gap:5 }}>
      {[
        { label:"Destreza",      valor:fmtMod(modDes), fixo:true  },
        { label:"Bôn. Armad", campo:"bonArmadura",  auto:true  },
        { label:"Bôn. Escudo",   campo:"bonEscudo",    auto:true },
        { label:"Outros",        campo:"outros",        auto:false },
      ].map(({ label, valor, fixo, campo, auto }) => (
        <div key={label} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:3 }}>
          <div style={{ fontFamily:"'Cinzel',serif", fontSize:7, letterSpacing:1, color:"#7a5020", textAlign:"center", lineHeight:1.3 }}>{label}</div>
          {fixo || auto
            ? <div style={{
                ...inputDef,
                color: fixo
                  ? (modDes >= 0 ? "#7ec87e" : "#e06060")
                  : "#c8922a",
                border:"1px solid #3a2a10",
                background:"#0d070044",
                display:"flex", alignItems:"center", justifyContent:"center",
                height:28, boxSizing:"border-box",
              }}>
                {fixo
                  ? valor
                  : fmtMod(der[campo] || 0)}
              </div>
            : <input
                type="number"
                style={inputDef}
                value={(ficha.defesaComp?.[campo] === 0 || !ficha.defesaComp?.[campo]) ? "" : ficha.defesaComp[campo]}
                placeholder="0"
                onChange={e => setDefComp(campo, e.target.value)}
                onFocus={e => e.target.style.borderColor="#e8a020"}
                onBlur={e =>  e.target.style.borderColor="#8b5e1a55"}
              />
          }
        </div>
      ))}
    </div>
  </div>

  {/* ── Defesa afetada por condições ── */}
  <div
    style={{
      marginBottom: 12,
      padding: "10px 12px",
      borderRadius: 8,
      background:
        "linear-gradient(135deg,#22120066,#180d0066)",
      border: `1px solid ${
        efeitosDefesa.detalhes.length > 0
          ? "#e0606055"
          : "#8b5e1a44"
      }`,
    }}
  >
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 8,
        marginBottom: 8,
      }}
    >
      <span
        style={{
          fontFamily: "'Cinzel',serif",
          fontSize: 9,
          letterSpacing: 2,
          color: "#c8922a",
        }}
      >
        DEFESA POR TIPO DE ATAQUE
      </span>

      <span
        style={{
          fontFamily: "'Cinzel',serif",
          fontSize: 9,
          color: "#7a5020",
          whiteSpace: "nowrap",
        }}
      >
        Geral:{" "}
        <b style={{ color: "#e8a020" }}>
          {defTotal}
        </b>
      </span>
    </div>

    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 6,
        marginBottom: 8,
      }}
    >
      {[
        {
          label: "CORPO A CORPO",
          valor: defCorpoACorpo,
          modificador:
            efeitosDefesa.modificadorCorpoACorpo,
        },
        {
          label: "À DISTÂNCIA",
          valor: defDistancia,
          modificador:
            efeitosDefesa.modificadorDistancia,
        },
      ].map(({ label, valor, modificador }) => (
        <div
          key={label}
          style={{
            padding: "8px 6px",
            textAlign: "center",
            borderRadius: 6,
            background: "#0d070088",
            border: "1px solid #8b5e1a55",
          }}
        >
          <div
            style={{
              fontFamily: "'Cinzel',serif",
              fontSize: 8,
              letterSpacing: 1,
              color: "#7a5020",
              marginBottom: 3,
            }}
          >
            {label}
          </div>

          <div
            style={{
              fontFamily:
                "'Cinzel Decorative','Cinzel',serif",
              fontSize: 22,
              fontWeight: 900,
              color:
                modificador < 0
                  ? "#e06060"
                  : modificador > 0
                    ? "#7ec87e"
                    : "#f0d8a0",
            }}
          >
            {valor}
          </div>

          <div
            style={{
              marginTop: 2,
              fontFamily: "'Cinzel',serif",
              fontSize: 8,
              color: "#7a5020",
            }}
          >
            {modificador === 0
              ? "sem modificador"
              : `${fmtMod(modificador)} condições`}
          </div>
        </div>
      ))}
    </div>

    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        gap: 8,
        paddingTop: 7,
        borderTop: "1px solid #3a2a10",
        fontFamily: "'Cinzel',serif",
        fontSize: 8,
        color: "#7a5020",
      }}
    >
      <span>
        Defesa base:{" "}
        <b style={{ color: "#c8922a" }}>
          {defesaBase}
        </b>
      </span>

      <span>
        Condições gerais:{" "}
        <b
          style={{
            color:
              efeitosDefesa.modificadorBase < 0
                ? "#e06060"
                : "#7ec87e",
          }}
        >
          {fmtMod(efeitosDefesa.modificadorBase)}
        </b>
      </span>
    </div>

    <div
      style={{
        marginTop: 8,
        fontFamily: "'Cinzel',serif",
        fontSize: 8,
        lineHeight: 1.5,
        color: "#c8922a",
      }}
    >
      {efeitosDefesa.detalhes.length === 0 ? (
        <div style={{ color: "#7a5020" }}>
          Nenhuma condição modifica a Defesa.
        </div>
      ) : (
        efeitosDefesa.detalhes.map((detalhe, index) => (
          <div key={`${detalhe}-${index}`}>
            • {detalhe}
          </div>
        ))
      )}
    </div>

    {efeitosDefesa.caido && (
      <div
        style={{
          marginTop: 7,
          paddingTop: 7,
          borderTop: "1px solid #e0606033",
          fontFamily: "'Cinzel',serif",
          fontSize: 8,
          lineHeight: 1.5,
          color: "#e06060",
          textAlign: "center",
        }}
      >
        Quando estiver Caído, use o valor correspondente
        ao tipo de ataque.
      </div>
    )}
  </div>

  {/* ── Penalidade de Armadura (calculada) ── */}
  <div style={{
    display:"flex", alignItems:"center", justifyContent:"space-between",
    padding:"6px 12px", marginBottom:12, borderRadius:6,
    background:"#1a0d0044", border:"1px solid #8b5e1a44",
  }}>
    <span style={{ fontFamily:"'Cinzel',serif", fontSize:9, letterSpacing:2, color:"#7a5020" }}>
      ⚔ PENALIDADE DE ARMADURA
    </span>
    <span style={{
      fontFamily:"'Cinzel Decorative','Cinzel',serif", fontSize:16, fontWeight:900,
      color: (der.penArmadura) < 0 ? "#e06060" : "#7a5020",
    }}>
      {der.penArmadura}
    </span>
  </div>

  {/* ── Tabela de Armaduras / Escudos ── */}
  <div style={{ marginBottom:10 }}>
    <div style={{ fontFamily:"'Cinzel',serif", fontSize:8, letterSpacing:2, color:"#7a5020", marginBottom:6, textTransform:"uppercase" }}>
      Armaduras / Escudos
    </div>

    {/* Cabeçalho da tabela */}
    <div style={{
      display:"grid", gridTemplateColumns:"1fr 82px 40px 55px 26px", gap:4,
      marginBottom:4, paddingBottom:4,
      borderBottom:"1px solid #3a2a1066",
      fontFamily:"'Cinzel',serif", fontSize:8, letterSpacing:1,
      color:"#7a5020", textTransform:"uppercase",
    }}>
      <span>Nome</span>
      <span style={{ textAlign:"center", color:"#c8922a" }}>Tipo</span>
      <span style={{ textAlign:"center", color:"#c8922a" }}>🛡 Def</span>
      <span style={{ textAlign:"center", color:"#e06060" }}>⚔ Penal.</span>
      <span />
    </div>

    {(ficha.armaduras || []).map(arm => (
      <div key={arm.id} style={{ display:"grid", gridTemplateColumns:"1fr 82px 40px 55px 26px", gap:4, marginBottom:5, alignItems:"center" }}>
        {/* Nome */}
        <input
          value={arm.nome}
          placeholder="Ex: Cota de Malha"
          onChange={e => setArmadura(arm.id, "nome", e.target.value)}
          style={{
            background:"#0d070088", border:"1px solid #8b5e1a55", borderRadius:4,
            color:"#f0d8a0", fontFamily:"'Merriweather',Georgia,serif", fontSize:12,
            padding:"5px 6px", outline:"none", width:"100%", boxSizing:"border-box"
          }}
          onFocus={e => e.target.style.borderColor="#e8a020"}
          onBlur={e =>  e.target.style.borderColor="#8b5e1a55"}
        />
         {/* Tipo do equipamento */}
         <select
          value={arm.tipo || "armadura"}
          onChange={e =>
            setArmadura(
              arm.id,
              "tipo",
              e.target.value
            )
          }
          style={{
            background: "#1a0d0088",
            border: "1px solid #8b5e1a55",
            borderRadius: 4,
            color: "#c8922a",
            fontFamily: "'Cinzel',serif",
            fontSize: 9,
            padding: "5px 3px",
            outline: "none",
            width: "100%",
            boxSizing: "border-box",
            textAlign: "center",
            cursor: "pointer",
          }}
          onFocus={e =>
            e.target.style.borderColor = "#e8a020"
          }
          onBlur={e =>
            e.target.style.borderColor = "#8b5e1a55"
          }
        >
          <option
            value="armadura"
            style={{ background: "#1c0e00" }}
          >
            Armadura
          </option>

          <option
            value="escudo"
            style={{ background: "#1c0e00" }}
          >
            Escudo
          </option>
        </select>

        {/* Bônus de Defesa — numérico, positivo */}
        <input
          type="number"
          value={arm.defesa === "" || arm.defesa === undefined ? "" : arm.defesa}
          placeholder="+4"
          onChange={e => setArmadura(arm.id, "defesa", e.target.value)}
          style={{
            background:"#0d070088", border:"1px solid #c8922a55", borderRadius:4,
            color:"#c8922a", fontFamily:"'Cinzel',serif", fontSize:12,
            padding:"5px 4px", outline:"none", width:"100%", boxSizing:"border-box", textAlign:"center"
          }}
          onFocus={e => e.target.style.borderColor="#c8922a"}
          onBlur={e =>  e.target.style.borderColor="#c8922a55"}
        />

        {/* Penalidade — numérico, geralmente negativo */}
        <input
          type="number"
          value={arm.penalidade === "" || arm.penalidade === undefined ? "" : arm.penalidade}
          placeholder="−2"
          onChange={e => setArmadura(arm.id, "penalidade", e.target.value)}
          style={{
            background:"#0d070088", border:"1px solid #e0606055", borderRadius:4,
            color:"#e06060", fontFamily:"'Cinzel',serif", fontSize:12,
            padding:"5px 4px", outline:"none", width:"100%", boxSizing:"border-box", textAlign:"center"
          }}
          onFocus={e => e.target.style.borderColor="#e06060"}
          onBlur={e =>  e.target.style.borderColor="#e0606055"}
        />

        <button
          onClick={() => removeArmadura(arm.id)}
          style={{ width:24, height:26, borderRadius:4, border:"1px solid #5a1a1a", background:"#2a0d0d88", color:"#e06060", fontSize:13, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}
        >✕</button>
      </div>
    ))}

    <button
      onClick={addArmadura}
      style={{ width:"100%", padding:"6px 0", background:"linear-gradient(180deg,#2a1800,#1a0e00)", border:"1px dashed #8b5e1a55", borderRadius:5, color:"#7a5020", fontFamily:"'Cinzel',serif", fontSize:8, letterSpacing:2, cursor:"pointer" }}
    >+ ARMADURA / ESCUDO</button>
  </div>

   {/* ── Stats: RD, Iniciativa, Bôn. Ataque, Bôn. Dano ── */}
   <div
    style={{
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 8,
    }}
  >
    {/* Redução de dano */}
    <div style={s.statBox}>
      <span style={s.statIcone}>⛏️</span>

      <div style={s.statNome}>
        Red. Dano
      </div>

      <div style={s.statValor}>
        {(ficha.rd || 0) >= 0
          ? `+${ficha.rd || 0}`
          : ficha.rd}
      </div>

      <div style={s.statBtns}>
        <button
          style={s.btnBarra}
          onClick={() =>
            set("rd", (ficha.rd || 0) - 1)
          }
        >
          −
        </button>

        <button
          style={s.btnBarra}
          onClick={() =>
            set("rd", (ficha.rd || 0) + 1)
          }
        >
          +
        </button>
      </div>
    </div>

    {/* Iniciativa automática */}
<div style={s.statBox}>
  <span style={s.statIcone}>⚡</span>

  <div style={s.statNome}>
    Iniciativa
  </div>

  <div
    style={{
      ...s.statValor,
      color:
        iniciativaTotal >= 0
          ? "#7ec87e"
          : "#e06060",
    }}
  >
    {fmtMod(iniciativaTotal)}
  </div>

  {efeitosIniciativa.detalhes.length > 0 && (
    <div
      style={{
        marginTop: 4,
        fontFamily: "'Cinzel',serif",
        fontSize: 7,
        color: "#e06060",
        lineHeight: 1.4,
      }}
    >
      <div>
        Base: {fmtMod(iniciativaBase)}
      </div>

      {efeitosIniciativa.detalhes.map(
        (detalhe, index) => (
          <div key={`${detalhe}-${index}`}>
            ⚠ {detalhe}
          </div>
        )
      )}
    </div>
  )}

  <div
    style={{
      fontFamily: "'Cinzel',serif",
      fontSize: 8,
      color: "#7a5020",
      marginTop: 2,
    }}
  >
    {efeitosIniciativa.detalhes.length === 0
      ? "VALOR DA PERÍCIA"
      : "VALOR FINAL COM CONDIÇÕES"}
  </div>

  <div
    style={{
      ...s.statBtns,
      marginTop: 7,
    }}
  >
    <button
      onClick={rolarIniciativa}
      title="Rolar 1d20 + perícia Iniciativa"
      style={{
        ...s.btnBarra,
        width: "100%",
        padding: "6px 4px",
        color: "#e8a020",
        borderColor: "#c8922a",
      }}
    >
      ROLAR 1d20
    </button>
  </div>

  {resultadoIniciativa && (
    <div
      style={{
        marginTop: 8,
        padding: "7px 5px",
        borderRadius: 5,
        background: "#e8a02011",
        border: "1px solid #c8922a55",
      }}
    >
      <div
        style={{
          fontFamily: "'Cinzel',serif",
          fontSize: 7,
          letterSpacing: 1,
          color: "#7a5020",
          marginBottom: 3,
        }}
      >
        RESULTADO FINAL
      </div>

      <div
        style={{
          fontFamily:
            "'Cinzel Decorative','Cinzel',serif",
          fontSize: 24,
          fontWeight: 900,
          color: "#e8a020",
          lineHeight: 1,
        }}
      >
        {resultadoIniciativa.total}
      </div>

      <div
        style={{
          marginTop: 5,
          fontFamily: "'Cinzel',serif",
          fontSize: 8,
          color: "#c8a060",
          lineHeight: 1.5,
        }}
      >
        d20: {resultadoIniciativa.natural}{" "}
        {fmtMod(resultadoIniciativa.bonus)}
      </div>

      {resultadoIniciativa.natural === 20 && (
        <div
          style={{
            marginTop: 4,
            fontFamily: "'Cinzel',serif",
            fontSize: 7,
            letterSpacing: 1,
            color: "#7ec87e",
          }}
        >
          20 NATURAL
        </div>
      )}

      {resultadoIniciativa.natural === 1 && (
        <div
          style={{
            marginTop: 4,
            fontFamily: "'Cinzel',serif",
            fontSize: 7,
            letterSpacing: 1,
            color: "#e06060",
          }}
        >
          1 NATURAL
        </div>
      )}
    </div>
  )}
</div>

    {/* Bônus de ataque */}
    <div style={s.statBox}>
      <span style={s.statIcone}>🗡️</span>

      <div style={s.statNome}>
        Bôn. Ataque
      </div>

      <div style={s.statValor}>
        {(ficha.bonAtaque || 0) >= 0
          ? `+${ficha.bonAtaque || 0}`
          : ficha.bonAtaque}
      </div>

      <div style={s.statBtns}>
        <button
          style={s.btnBarra}
          onClick={() =>
            set(
              "bonAtaque",
              (ficha.bonAtaque || 0) - 1
            )
          }
        >
          −
        </button>

        <button
          style={s.btnBarra}
          onClick={() =>
            set(
              "bonAtaque",
              (ficha.bonAtaque || 0) + 1
            )
          }
        >
          +
        </button>
      </div>
    </div>

    {/* Bônus de dano */}
    <div style={s.statBox}>
      <span style={s.statIcone}>💥</span>

      <div style={s.statNome}>
        Bôn. Dano
      </div>

      <div style={s.statValor}>
        {(ficha.bonDano || 0) >= 0
          ? `+${ficha.bonDano || 0}`
          : ficha.bonDano}
      </div>

      <div style={s.statBtns}>
        <button
          style={s.btnBarra}
          onClick={() =>
            set(
              "bonDano",
              (ficha.bonDano || 0) - 1
            )
          }
        >
          −
        </button>

        <button
          style={s.btnBarra}
          onClick={() =>
            set(
              "bonDano",
              (ficha.bonDano || 0) + 1
            )
          }
        >
          +
        </button>
      </div>
    </div>
  </div>
  
</Secao>

            <DiamondDivider />
            <ControleRodada cena={ficha.cena} onUpdateCena={updateCena} />
            <SecaoCondicoes condicoes={ficha.condicoes||[]} onChange={setCondicoes} rodadaAtual={ficha.cena?.rodada || 1} />
        </>
      );

    case 2: //Perícias//
      return (
        <>
          <HistoricoRolagens
            rolagens={historicoRolagens}
            onLimpar={limparHistoricoRolagens}
          />
          {/* Legenda */}
  <div style={{ display:"flex", gap:6, flexWrap:"wrap", padding:"8px 12px 4px", fontFamily:"'Cinzel',serif", fontSize:9, letterSpacing:1, color:"#7a5020" }}>
    <span>TOTAL =</span>
    <span style={{ color:"#c8922a" }}>½ NÍV</span>
    <span>+</span>
    <span style={{ color:"#7ec87e" }}>MOD ATR</span>
    <span>+</span>
    <span style={{ color:"#e8a020" }}>TREIN</span>
    <span>+</span>
    <span style={{ color:"#a080c0" }}>OUTROS</span>
    <span>+</span>
    <span style={{ color:"#e06060" }}>CONDIÇÕES</span>
  </div>

  {/* Cabeçalho da tabela */}
  <div style={{ display:"grid", gridTemplateColumns:"16px 1fr 40px 34px 32px 32px 42px", gap:4, alignItems:"center", padding:"5px 14px 5px 12px", background:"linear-gradient(90deg,#3a1e00,#281400,#3a1e00)", borderTop:"1px solid #8b5e1a55", borderBottom:"1px solid #8b5e1a55", fontFamily:"'Cinzel',serif", fontSize:8, letterSpacing:1, color:"#7a5020", textTransform:"uppercase" }}>
    <span /><span>Perícia</span>
    <span style={{ textAlign:"center", color:"#c8922a"  }}>ATR</span>
    <span style={{ textAlign:"center", color:"#7ec87e"  }}>MOD</span>
    <span style={{ textAlign:"center", color:"#e8a020"  }}>TREIN</span>
    <span style={{ textAlign:"center", color:"#a080c0"  }}>OUT</span>
    <span style={{ textAlign:"center", color:"#f0d8a0"  }}>TOTAL</span>
  </div>

  <Secao icone="📜" titulo="Lista de Perícias">
    {/* Legenda de ícones */}
    <div style={{ display:"flex", gap:10, flexWrap:"wrap", marginBottom:10, fontFamily:"'Cinzel',serif", fontSize:8, letterSpacing:1, color:"#7a5020" }}>
      <span style={{ color:"#e06060" }}>🔒 = Somente treinado</span>
      <span style={{ color:"#c8922a" }}>⚔ = Penalidade de armadura</span>
    </div>

    <div style={{ display:"flex", flexDirection:"column", gap:3 }}>
      {PERICIAS.map(p => {
        // Constantes de regras
        const PERICIAS_SO_TREINADO = [
          "Adestramento","Conhecimento","Guerra","Jogatina","Ladinagem",
          "Misticismo","Nobreza","Ofício","Pilotagem","Religião"
        ];
        const PERICIAS_PEN_ARMADURA = ["Acrobacia","Furtividade","Ladinagem"];
        const OFICIOS = ["Armeiro","Artesão","Alquimista","Cozinheiro","Alfaiate"];

        const soTreinado  = PERICIAS_SO_TREINADO.includes(p);
        const temPenArmad = PERICIAS_PEN_ARMADURA.includes(p);

        const penArmadura = temPenArmad
        ? (der.penArmadura) + (sobrecarregado ? -5 : 0)
          : 0;

        const dados    = ficha.pericias[p];
        const treinado = dados.treinado;
        const atrib    = dados.atrib || PERICIAS_ATRIB_PADRAO[p];
        const modAtrib = calcMod(ficha.atributos[atrib]);
        const bonTrein =
          treinado
            ? bonusTreinamento(nivelTotal)
            : 0;

        const efeitosPericia =
          calcularEfeitosPericiaCondicoes(
            condicoesEfetivas,
            p,
            atrib
          );

        /*
         * Total da perícia já com as condições.
         */
        const totalComCondicoes =
          calcPericia(p) +
          efeitosPericia.modificador;

        /*
         * Perícias somente treinadas continuam
         * bloqueadas quando não estão treinadas.
         */
        const total =
          soTreinado && !treinado
            ? 0
            : totalComCondicoes;

        const isLocked =
          soTreinado && !treinado;

        const textoTotal =
          isLocked
            ? "—"
            : efeitosPericia.indisponivel
              ? "—"
              : efeitosPericia.falhaAutomatica
                ? "Fl"
                : total;

        return (
          <div key={p}>
            <div
              style={{
                display:"grid",
                gridTemplateColumns:"16px 1fr 40px 34px 32px 32px 42px",
                gap:4,
                alignItems:"center",
                padding:"5px 4px 5px 2px",
                borderRadius:5,
                background:treinado ? "#3a200044" : "transparent",
                border:`1px solid ${treinado ? "#c8922a33" : "transparent"}`,
                transition:"background 0.15s",
                opacity:
                  isLocked ||
                  efeitosPericia.indisponivel ||
                  efeitosPericia.falhaAutomatica
                    ? 0.55
                    : 1,
              }}
            >
              {/* Checkbox treinado */}
              <div
                onClick={() => togglePericia(p)}
                style={{
                  width:14, height:14, borderRadius:3, cursor:"pointer",
                  background:treinado ? "#e8a020" : "#0d070088",
                  border:`1px solid ${treinado ? "#e8a020" : "#8b5e1a"}`,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontSize:9, color:"#1c0e00", flexShrink:0, transition:"all 0.15s"
                }}
              >{treinado ? "✦" : ""}</div>

              {/* Nome + badges + ofício */}
              <div onClick={() => togglePericia(p)} style={{ cursor:"pointer" }}>
                <div style={{ display:"flex", alignItems:"center", gap:4, flexWrap:"wrap" }}>
                  <span style={{ fontFamily:"'IM Fell English',Georgia,serif", fontSize:12, color:treinado ? "#e8a020" : "#c8a060" }}>{p}</span>
                  {soTreinado  && <span title="Somente treinado" style={{ fontSize:9, lineHeight:1 }}>🔒</span>}
                  {temPenArmad && <span title="Penalidade de armadura" style={{ fontSize:9, lineHeight:1 }}>⚔</span>}
                </div>
                {/* Seletor de ofício */}
                {p === "Ofício" && (
                  <select
                    value={dados.oficio || "Armeiro"}
                    onClick={e => e.stopPropagation()}
                    onChange={e => {
                      e.stopPropagation();
                      setFicha(f => ({
                        ...f,
                        pericias: {
                          ...f.pericias,
                          Ofício: { ...f.pericias["Ofício"], oficio: e.target.value }
                        }
                      }));
                    }}
                    style={{
                      marginTop:3,
                      background:"#1a0d0088",
                      border:"1px solid #8b5e1a55",
                      borderRadius:3,
                      color:"#c8922a",
                      fontFamily:"'Cinzel',serif",
                      fontSize:8,
                      padding:"2px 4px",
                      outline:"none",
                      cursor:"pointer",
                      maxWidth:110,
                    }}
                    onFocus={e => e.target.style.borderColor="#e8a020"}
                    onBlur={e =>  e.target.style.borderColor="#8b5e1a55"}
                  >
                    {["Armeiro","Artesão","Alquimista","Cozinheiro","Alfaiate"].map(o => (
                      <option key={o} value={o} style={{ background:"#1c0e00" }}>{o}</option>
                    ))}
                  </select>
                )}
              </div>

              {/* Seletor de atributo */}
              <select
                value={atrib}
                onChange={e => setFicha(f => ({
                  ...f,
                  pericias:{ ...f.pericias, [p]:{ ...f.pericias[p], atrib:e.target.value } }
                }))}
                style={{
                  background:"#1a0d0088", border:"1px solid #8b5e1a55", borderRadius:3,
                  color:"#c8922a", fontFamily:"'Cinzel',serif", fontSize:8, fontWeight:700,
                  textAlign:"center", padding:"2px 1px", outline:"none",
                  width:"100%", cursor:"pointer", appearance:"none", WebkitAppearance:"none"
                }}
                onFocus={e => e.target.style.borderColor="#e8a020"}
                onBlur={e =>  e.target.style.borderColor="#8b5e1a55"}
              >
                {ATRIBUTOS.map(a => <option key={a} value={a} style={{ background:"#1c0e00" }}>{a}</option>)}
              </select>

              {/* MOD */}
              <div style={{ textAlign:"center", fontFamily:"'Cinzel',serif", fontSize:12, fontWeight:700, color:modAtrib>=0 ? "#7ec87e" : "#e06060" }}>
                {fmtMod(modAtrib)}
              </div>

              {/* TREIN */}
              <div style={{ textAlign:"center", fontFamily:"'Cinzel',serif", fontSize:12, fontWeight:700, color:treinado ? "#e8a020" : "#3a2a10" }}>
                {treinado ? `+${bonTrein}` : "—"}
              </div>

              {/* OUTROS */}
              <input
                type="number"
                value={dados.outros === 0 ? "" : dados.outros}
                placeholder="0"
                onChange={e => setPericiaBon(p, e.target.value)}
                style={{
                  background:"#0d070088", border:"1px solid #8b5e1a55", borderRadius:4,
                  color:"#a080c0", fontFamily:"'Cinzel',serif", fontSize:11,
                  textAlign:"center", padding:"2px", outline:"none",
                  width:"100%", boxSizing:"border-box"
                }}
                onFocus={e => e.target.style.borderColor="#a080c0"}
                onBlur={e =>  e.target.style.borderColor="#8b5e1a55"}
              />

              {/* TOTAL */}
              <div style={{
                textAlign:"center",
                fontFamily:"'Cinzel Decorative','Cinzel',serif",
                fontSize:15, fontWeight:900,
                color: isLocked ? "#3a2a10" : temPenArmad && penArmadura < 0 ? "#e8a020" : "#f0d8a0",
                background:"linear-gradient(135deg,#3a1e0088,#1c0e0088)",
                border:"1px solid #8b5e1a66",
                borderRadius:5, padding:"2px 0",
                position:"relative",
              }}>
                {textoTotal}
              </div>
            </div>

            <RolagemPericia
              nome={p}
              total={total}
              indisponivel={
                isLocked ||
                efeitosPericia.indisponivel
              }
              falhaAutomatica={
                efeitosPericia.falhaAutomatica
              }
              onResultado={registrarRolagemPericia}
            />

            {!isLocked &&
              efeitosPericia.detalhes.length > 0 && (
                <div
                  style={{
                    marginTop: -1,
                    marginBottom: 3,
                    paddingLeft: 22,
                    fontFamily: "'Cinzel',serif",
                    fontSize: 8,
                    letterSpacing: 0.3,
                    lineHeight: 1.4,
                    color: "#e06060",
                  }}
                >
                  {efeitosPericia.detalhes.map(
                    (detalhe, index) => (
                      <div
                        key={`${detalhe}-${index}`}
                      >
                        ⚠ {detalhe}
                      </div>
                    )
                  )}
                </div>
              )}

            {/* Indicador de penalidade de armadura ativa */}
            {temPenArmad && penArmadura < 0 && (
              <div style={{
                marginTop:-1, marginBottom:2,
                paddingLeft:22,
                fontFamily:"'Cinzel',serif", fontSize:8, letterSpacing:0.5,
                color:"#c8922a88",
              }}>
                ⚔ pen. armadura: {penArmadura}
              </div>
            )}
          </div>
        );
      })}
    </div>
  </Secao>
        </>
      );

    case 3: //Poderes//
      return (
        <SecaoPoderes
        poderes={ficha.poderes || []}
        onAdd={addPoder}
        onUpdate={updatePoder}
        onRemove={removePoder}
        onMover={moverPoder}
        />

      );

    case 4: //Mochila//
      return (
        <>
          <Secao icone="⚖️" titulo="Controle de Carga">
              <div style={{ ...s.grid2, marginBottom:12 }}>
              <div style={s.statBox}>
                <span style={s.statIcone}>💪</span>

                <div style={s.statNome}>
                  Limite de Carga
                </div>

                <div
                  style={{
                    ...s.statValor,
                    fontSize: 20,
                  }}
                >
                  {limCarga}
                </div>

                <div
                  style={{
                    fontSize: 8,
                    color: "#7a5020",
                    fontFamily: "'Cinzel',serif",
                    marginTop: 2,
                    lineHeight: 1.5,
                  }}
                >
                  Base: {limCargaBase}
                  <br />
                  Fontes: +{extrasFontes}
                </div>
              </div>
                <div style={s.statBox}>
                  <span style={s.statIcone}>🏋️</span>
                  <div style={s.statNome}>Carga Máxima</div>
                  <div style={{ ...s.statValor, fontSize:20 }}>{cargaMax}</div>
                  <div style={{ fontSize:9, color:"#7a5020", fontFamily:"'Cinzel',serif", marginTop:2 }}>Limite Final × 2</div>
                </div>
              </div>
              <div
  
>
<div
  style={{
    padding: "10px 12px",
    marginBottom: 10,
    borderRadius: 8,
    border: "1px solid #8b5e1a55",
    background:
      "linear-gradient(135deg,#22120066,#180d0066)",
  }}
>
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap: 8,
      marginBottom: 8,
    }}
  >
    <div
      style={{
        fontFamily: "'Cinzel',serif",
        fontSize: 9,
        letterSpacing: 2,
        color: "#c8922a",
      }}
    >
      FONTES EXTRAS DE CARGA
    </div>

    <div
      style={{
        fontFamily: "'Cinzel',serif",
        fontSize: 9,
        color: "#e8a020",
      }}
    >
      +{extrasFontes}
    </div>
  </div>

  {(ficha.carga?.fontesExtras || []).length === 0 && (
    <div
      style={{
        padding: "8px 0",
        textAlign: "center",
        fontFamily: "'Cinzel',serif",
        fontSize: 9,
        color: "#7a5020",
        fontStyle: "italic",
      }}
    >
      Nenhuma fonte cadastrada.
    </div>
  )}

  {(ficha.carga?.fontesExtras || []).map(fonte => (
    <div
      key={fonte.id}
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 64px 28px",
        gap: 5,
        alignItems: "center",
        marginBottom: 6,
      }}
    >
      <input
        value={fonte.nome}
        placeholder="Ex: Mochila reforçada"
        onChange={e =>
          setFonteCarga(
            fonte.id,
            "nome",
            e.target.value
          )
        }
        style={{
          ...s.input,
          fontSize: 11,
        }}
        onFocus={e =>
          (e.target.style.borderColor = "#e8a020")
        }
        onBlur={e =>
          (e.target.style.borderColor = "#8b5e1a")
        }
      />

      <input
        type="number"
        min="0"
        step="0.5"
        value={
          fonte.valor === 0
            ? ""
            : fonte.valor
        }
        placeholder="+0"
        onChange={e =>
          setFonteCarga(
            fonte.id,
            "valor",
            e.target.value
          )
        }
        style={{
          ...s.input,
          textAlign: "center",
          color: "#e8a020",
        }}
        onFocus={e =>
          (e.target.style.borderColor = "#e8a020")
        }
        onBlur={e =>
          (e.target.style.borderColor = "#8b5e1a")
        }
      />

      <button
        type="button"
        onClick={() =>
          removeFonteCarga(fonte.id)
        }
        style={{
          width: 28,
          height: 30,
          borderRadius: 4,
          border: "1px solid #5a1a1a",
          background: "#2a0d0d88",
          color: "#e06060",
          cursor: "pointer",
          fontSize: 13,
        }}
        title="Remover fonte"
      >
        ✕
      </button>
    </div>
  ))}

  <button
    type="button"
    onClick={addFonteCarga}
    style={{
      width: "100%",
      padding: "7px 0",
      marginTop: 4,
      borderRadius: 5,
      border: "1px dashed #8b5e1a",
      background:
        "linear-gradient(180deg,#2a1800,#1a0e00)",
      color: "#c8922a",
      fontFamily: "'Cinzel',serif",
      fontSize: 9,
      letterSpacing: 1,
      cursor: "pointer",
    }}
  >
    + ADICIONAR FONTE
  </button>
</div>
  
</div>
              <div style={{ padding:"10px 12px", borderRadius:8, marginBottom:4, border:`1px solid ${corCarga}`, background:totalEspaco>cargaMax?"linear-gradient(135deg,#2a0d0d88,#1a080888)":totalEspaco>limCarga?"linear-gradient(135deg,#2a1a0088,#1a100088)":"transparent", animation:totalEspaco>cargaMax?"cargaPulse 1.5s ease-in-out infinite":"none", transition:"all 0.4s" }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                  <span style={{ fontFamily:"'Cinzel',serif", fontSize:10, letterSpacing:1, color:"#c8922a" }}>🎒 CARGA ATUAL</span>
                  <span style={{ fontFamily:"'Cinzel',serif", fontSize:12, fontWeight:700, color:corCarga }}>{totalEspaco.toFixed(1)} / {cargaMax}</span>
                </div>
                <div style={{ height:12, background:"#0d070088", borderRadius:6, border:"1px solid #8b5e1a55", overflow:"hidden", position:"relative" }}>
                  <div style={{ height:"100%", width:`${pctCarga}%`, background:`linear-gradient(90deg,${corCarga}88,${corCarga})`, borderRadius:6, transition:"width 0.4s ease" }} />
                  <div style={{ position:"absolute", inset:0, background:"linear-gradient(180deg,#ffffff18 0%,transparent 60%)", borderRadius:6, pointerEvents:"none" }} />
                </div>
                {totalEspaco > limCarga && (
                  <div style={{ fontFamily:"'Cinzel',serif", fontSize:9, letterSpacing:1, color:corCarga, marginTop:6, textAlign:"center" }}>
                    {totalEspaco > cargaMax ? "⚠ ACIMA DA CARGA MÁXIMA" : "⚠ SOBRECARREGADO — penalidade –5 / deslocamento –3m"}
                  </div>
                )}
              </div>
            </Secao>

            <DiamondDivider />

            <Secao icone="🎒" titulo="Itens & Equipamentos">
              <div style={{ display:"grid", gridTemplateColumns:"1fr 40px 40px 25px 25px", gap:4, marginBottom:6, fontFamily:"'Cinzel',serif", fontSize:8, letterSpacing:1, color:"#7a5020", textTransform:"uppercase", borderBottom:"1px solid #3a2a1066", paddingBottom:5 }}>
                <span>Item / Descrição</span>
                <span style={{ textAlign:"center" }}>Qtd</span>
                <span style={{ textAlign:"center" }}>Esp</span>
                <span style={{ textAlign:"center" }}>Ord</span>
                <span />
              </div>

              {(ficha.itens||[]).map((item, idx) => (
                <div key={item.id} style={{ display:"grid", gridTemplateColumns:"1fr 40px 40px 25px 25px", gap:4, marginBottom:5, alignItems:"center" }}>
                  <input value={item.descricao} placeholder="Poção de Cura, Corda..."
                    onChange={e => setItem(item.id, "descricao", e.target.value)}
                    style={{ background:"#0d070088", border:"1px solid #8b5e1a55", borderRadius:4, color:"#f0d8a0", fontFamily:"'Merriweather',Georgia,serif", fontSize:12, padding:"5px 6px", outline:"none", width:"100%", boxSizing:"border-box" }}
                    onFocus={e => e.target.style.borderColor="#e8a020"}
                    onBlur={e =>  e.target.style.borderColor="#8b5e1a55"} />
                  <input value={item.qtd} placeholder="1"
                    onChange={e => setItem(item.id, "qtd", e.target.value)}
                    style={{ background:"#0d070088", border:"1px solid #8b5e1a55", borderRadius:4, color:"#f0d8a0", fontFamily:"'Cinzel',serif", fontSize:11, padding:"5px 4px", outline:"none", width:"100%", boxSizing:"border-box", textAlign:"center" }}
                    onFocus={e => e.target.style.borderColor="#e8a020"}
                    onBlur={e =>  e.target.style.borderColor="#8b5e1a55"} />
                  <input type="number" value={item.espaco} placeholder="0.5"
                    onChange={e => setItem(item.id, "espaco", e.target.value)}
                    style={{ background:"#0d070088", border:"1px solid #8b5e1a55", borderRadius:4, color:corCarga, fontFamily:"'Cinzel',serif", fontSize:11, padding:"5px 4px", outline:"none", width:"100%", boxSizing:"border-box", textAlign:"center" }}
                    onFocus={e => e.target.style.borderColor="#e8a020"}
                    onBlur={e =>  e.target.style.borderColor="#8b5e1a55"} />
                                    <div style={{ display:"flex", flexDirection:"column", gap:2 }}>
                    <button
                      onClick={() => moverItem(item.id, -1)}
                      disabled={idx === 0}
                      title="Mover para cima"
                      style={{ height:12, borderRadius:3, border:"1px solid #8b5e1a55", background:"#0d070088", color:idx===0?"#3a2a10":"#c8922a", fontSize:9, lineHeight:1, cursor:idx===0?"not-allowed":"pointer", opacity:idx===0?0.4:1 }}
                    >▲</button>
                    <button
                      onClick={() => moverItem(item.id, 1)}
                      disabled={idx === (ficha.itens||[]).length - 1}
                      title="Mover para baixo"
                      style={{ height:12, borderRadius:3, border:"1px solid #8b5e1a55", background:"#0d070088", color:idx===(ficha.itens||[]).length-1?"#3a2a10":"#c8922a", fontSize:9, lineHeight:1, cursor:idx===(ficha.itens||[]).length-1?"not-allowed":"pointer", opacity:idx===(ficha.itens||[]).length-1?0.4:1 }}
                    >▼</button>
                  </div>
  
                  <button onClick={() => removeItem(item.id)} style={{ width:24, height:26, borderRadius:4, border:"1px solid #5a1a1a", background:"#2a0d0d88", color:"#e06060", fontSize:13, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>✕</button>
                </div>
              ))}
              <button onClick={addItem} style={{ marginTop:6, width:"100%", padding:"7px 0", background:"linear-gradient(180deg,#2a1800,#1a0e00)", border:"1px dashed #8b5e1a", borderRadius:5, color:"#7a5020", fontFamily:"'Cinzel',serif", fontSize:9, letterSpacing:2, cursor:"pointer" }}>+ ADICIONAR ITEM</button>
            </Secao>

            <DiamondDivider />

            <Secao icone="📝" titulo="Anotações">
              <textarea value={ficha.anotacoes} placeholder="Missões, NPCs, segredos, recompensas..." rows={6}
                onChange={e => set("anotacoes", e.target.value)}
                style={{ ...s.textarea }}
                onFocus={e => e.target.style.borderColor="#e8a020"}
                onBlur={e =>  e.target.style.borderColor="#8b5e1a"} />
            </Secao>
        </>
      );

    case 5: //Magia//
      if (!ficha.usaMagia) {
        return null;
      }

      return (
        <AbaGrimorio
          magias={ficha.magias || []}
          onChange={setMagias}
          cdMagia={cdMagia}
          magiaConfig={ficha.magiaConfig}
          onConfigChange={setMagiaConfig}
          atributos={ficha.atributos}
          nivel={nivelTotal}
          onLancar={lancarMagia}
          pmDisponivel={(Number(pmView.valor) || 0) + (Number(ficha.pmt?.valor) || 0)}
        />
      );

    default:
      return null;
  }
}

  return (
    <>
      {roladorAberto && (
        <RoladorDados
          onClose={() => setRoladorAberto(false)}
        />
      )}

      {historicoAberto && (
        <Modal titulo="📜 Histórico de Rolagens" onClose={() => setHistoricoAberto(false)}>
          <HistoricoRolagens
            rolagens={historicoRolagens}
            onLimpar={limparHistoricoRolagens}
          />
        </Modal>
      )}

      {/* NOVO MODAL */}
      {modalCenaAberto && (
        <ModalCena
          cena={ficha.cena}
          onUpdateCena={updateCena}
          onClose={() => setModalCenaAberto(false)}
          initialCena={CENA_INICIAL} // NOVA PROP
        />
      )}
      <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&family=Cinzel+Decorative:wght@400;700;900&family=IM+Fell+English&family=Merriweather:wght@400;700&display=swap" rel="stylesheet" />

      <style>{`
        @keyframes pvPulse    { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes cargaPulse { 0%,100%{box-shadow:0 0 6px #e0606066} 50%{box-shadow:0 0 14px #e06060cc} }
        @keyframes giraSelo   { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes fadeIn     { from{opacity:0} to{opacity:1} }
        
        @media (max-width: 600px) {
          .topoLinha .topoBotoes { gap: 3px !important; }
          .topoLinha .topoTitulo { font-size: 18px !important; }
        }

        .navBarResponsiva {
          transition: all 0.2s ease;
        }
        
        @media (min-width: 1024px) {
          .navBarResponsiva {
            position: sticky !important;
            top: 0 !important;
            bottom: auto !important;
            left: auto !important;
            right: auto !important;
            width: 100% !important;
            max-width: 980px;
            margin: 0 auto;
            order: -1;
            border-top: none !important;
            border-bottom: 1px solid #8b5e1a;
            box-shadow: 0 4px 16px #00000066;
          }
        
          .navBarResponsiva .navItem {
            padding: 12px 8px 14px !important;
            gap: 5px !important;
          }
        
          .navBarResponsiva .navIcone {
            font-size: 22px !important;
          }
        
          .navBarResponsiva .navLabel {
            font-size: 10px !important;
            letter-spacing: 1.5px !important;
          }
        
          .layoutDesktop {
            display: flex;
            flex: 1;
            height: 0;
            min-height: 0;
            gap: 10px;
            padding: 10px;
            position: relative;
            z-index: 1;
            box-sizing: border-box;
          }
          
          .menuAbasDesktop {
            width: 180px;
            flex: 0 0 180px;
            align-self: flex-start;
          
            /*
             * O menu poderá rolar sem aumentar
             * indefinidamente a altura da tela.
             */
            max-height: calc(100vh - 120px);
            overflow-y: auto;
          
            padding: 9px;
            border: 1px solid #8b5e1a;
            border-radius: 8px;
            background: linear-gradient(160deg,#221200dd,#180d00dd);
            box-sizing: border-box;
          
            /*
             * Mantém o menu visível durante a rolagem
             * da área principal.
             */
            position: sticky;
            top: 10px;
          
            scrollbar-width: thin;
            scrollbar-color: #8b5e1a #0d0700;
          }

          .menuAbasDesktop::-webkit-scrollbar {
            width: 7px;
          }
          
          .menuAbasDesktop::-webkit-scrollbar-track {
            background: #0d0700;
            border-radius: 8px;
          }
          
          .menuAbasDesktop::-webkit-scrollbar-thumb {
            background: #8b5e1a;
            border-radius: 8px;
          }
          
          .menuAbasDesktop::-webkit-scrollbar-thumb:hover {
            background: #c8922a;
          }
          
          .menuAbasTitulo {
            padding-bottom: 9px;
            margin-bottom: 10px;
            border-bottom: 1px solid #8b5e1a55;
            color: #e8a020;
            font-family: "Cinzel", serif;
            font-size: 11px;
            letter-spacing: 2px;
            text-align: center;
          }
          
          .menuPainelGrupo {
            margin-bottom: 14px;
          }
          
          .menuPainelTitulo {
            margin-bottom: 5px;
            color: #7a5020;
            font-family: "Cinzel", serif;
            font-size: 10px;
            letter-spacing: 1px;
            text-align: center;
          }
          
          .menuAbaDesktop {
            width: 100%;
            display: flex;
            align-items: center;
            gap: 7px;
            padding: 8px 6px;
            margin-bottom: 4px;
            border: 1px solid transparent;
            border-radius: 5px;
            background: transparent;
            color: #7a5020;
            font-family: "Cinzel", serif;
            font-size: 12px;
            letter-spacing: 0.5px;
            text-align: left;
            cursor: pointer;
            box-sizing: border-box;
          }
          
          .menuAbaDesktop:hover {
            border-color: #8b5e1a88;
            background: #3a1e0055;
            color: #c8922a;
          }
          
          .menuAbaDesktop.ativa {
            border-color: #c8922a;
            background: #c8922a22;
            color: #e8a020;
          }
          
          .menuAbaIcone {
            width: 20px;
            flex-shrink: 0;
            text-align: center;
            font-size: 16px;
          }
          
          .botaoTrocarPaineis {
            width: 100%;
            padding: 7px 4px;
            border: 1px solid #8b5e1a;
            border-radius: 5px;
            background: transparent;
            color: #c8922a;
            font-family: "Cinzel", serif;
            font-size: 10px;
            letter-spacing: 0.5px;
            cursor: pointer;
          }
          
          .botaoTrocarPaineis:hover {
            background: #c8922a22;
          }
          
          .painelDesktop {
            flex: 1 1 0;
            min-width: 0;
            min-height: 0;
            overflow-y: auto;
            padding: 4px 7px 30px;
            scrollbar-width: thin;
            scrollbar-color: #8b5e1a #0d0700;
          }
          
          .painelDesktop::-webkit-scrollbar {
            width: 8px;
          }
          
          .painelDesktop::-webkit-scrollbar-track {
            background: #0d0700;
          }
          
          .painelDesktop::-webkit-scrollbar-thumb {
            background: #8b5e1a;
            border-radius: 8px;
          }

          .navBarResponsiva {
            display: none !important;
          }
        }

      `}</style>
      <div style={s.root}>
        <div style={s.noiseBg} />

        {/* ── TOPO ── */}
        <div style={s.topo}>
          <div className="topoLinha" style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:6, marginBottom:2 }}>

            {/* Esquerda: Rolador, Histórico, Cena */}
            <div className="topoBotoes" style={{ display:"flex", gap:5 }}>
              <button onClick={() => setRoladorAberto(true)} title="Rolador de dados" aria-label="Rolador de dados" style={btnTopo}>🎲</button>
              <button onClick={() => setHistoricoAberto(true)} title="Histórico de rolagens" aria-label="Histórico de rolagens" style={btnTopo}>📜</button>
              <button onClick={() => setModalCenaAberto(true)} title="Configurações da Cena" aria-label="Configurações da Cena" style={btnTopo}>⚙️</button>
            </div>

            {/* Centro: T20 + Perfil */}
            <div style={{ flex:1, minWidth:0, textAlign:"center" }}>
              <div className="topoTitulo" style={s.topoTitulo}>⚔ T20 ⚔</div>
              <div style={{ ...s.topoSub, marginTop:0 }}>👤 {usuario}</div>
            </div>

            {/* Direita: Importar, Exportar, Sair */}
            <div className="topoBotoes" style={{ display:"flex", gap:5 }}>
              <label title="Importar ficha (.json)" aria-label="Importar ficha" style={btnTopo}>
                ⬇
                <input type="file" accept=".json,application/json" onChange={importarFichaAtual} style={{ display:"none" }} />
              </label>
              <button onClick={exportarFichaAtual} title="Exportar esta ficha" aria-label="Exportar esta ficha" style={btnTopo}>⬆</button>
              <button onClick={sairConta} title="Sair" style={{ ...btnTopo, width:"auto", padding:"0 7px", fontSize:8, letterSpacing:1, color:"#7a5020", border:"1px solid #3a2a10" }}>SAIR</button>
            </div>
          </div>

          {/* Mensagem de salvamento (linha fina) */}
          <div className="topoMsg" style={{ minHeight:11, textAlign:"center", fontSize:9, letterSpacing:1, fontFamily:"'Cinzel',serif", color: msgSalvo.startsWith("⚠") ? "#e06060" : "#7ec87e" }}>
            {msgSalvo}
          </div>
          {ficha.nome && <div style={s.topoNome}>✦ {ficha.nome} ✦</div>}
          {(ficha.classes||[]).some(c => c.nome) && (
            <div style={{ ...s.topoNome, fontSize:11, color:"#7a5020", marginTop:1 }}>
              {ficha.raca && `${ficha.raca} · `}
              {(ficha.classes||[]).filter(c=>c.nome).map(c => `${c.nome} ${c.nivel}`).join(" / ")}
              {" · "}Nível {nivelTotal}
            </div>
          )}
        </div>

        {/* ── CONTEÚDO MOBILE ── */}
        {!modoDesktop && (
          <div style={s.scroll}>
            {renderizarAba(aba)}
          </div>
        )}

        {/* ── CONTEÚDO DESKTOP ── */}
        {modoDesktop && (
          <div className="layoutDesktop">
            <MenuAbasDesktop
              abas={ABAS}
              abaEsquerda={abaEsquerda}
              abaDireita={abaDireita}
              onSelecionarEsquerda={selecionarAbaEsquerda}
              onSelecionarDireita={selecionarAbaDireita}
              onTrocarPaineis={trocarPaineis}
            />

            <main className="painelDesktop">
              {renderizarAba(abaEsquerda)}
            </main>

            <main className="painelDesktop">
              {renderizarAba(abaDireita)}
            </main>
          </div>
        )}

        {/* ── NAV BAR ── */}
        <div
          className="navBarResponsiva"
          style={s.navBar}
        >
          {ABAS.map(a => (
            <div key={a.id} onClick={() => setAba(a.id)}
              style={{ ...s.navItem, borderTop:`2px solid ${aba===a.id?"#c8922a":"transparent"}`, background:aba===a.id?"linear-gradient(180deg,#3a1e0066,transparent)":"transparent" }}>
              <span style={s.navIcone}>{a.icon}</span>
              <span style={{ ...s.navLabel, color:aba===a.id?"#e8a020":"#7a5020" }}>{a.label}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
