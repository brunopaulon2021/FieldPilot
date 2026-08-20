import { ArrowRight, CalendarDays, Check, ClipboardCheck, MapPin, QrCode, ShieldCheck, Sparkles, Wrench } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

const capabilities = [
  { icon: ClipboardCheck, eyebrow: "Operação", title: "Pedidos que viram trabalho", text: "Centralize entradas, prioridades e responsáveis. Cada pedido segue um fluxo claro até à conclusão." },
  { icon: CalendarDays, eyebrow: "Coordenação", title: "A equipa certa, à hora certa", text: "Planeie o dia, detete conflitos e acompanhe o que está atrasado sem depender de mensagens soltas." },
  { icon: Wrench, eyebrow: "Terreno", title: "Menos digitação, mais execução", text: "O técnico recebe o essencial, regista diagnóstico, materiais, fotografias e assinatura no telemóvel." },
];

const workflow = ["Pedido recebido", "Triagem e agenda", "Intervenção no local", "Relatório partilhado"];

export default function Home() {
  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#inicio" aria-label="FieldPilot, início">
          <span className="brand-mark" aria-hidden="true"><MapPin size={17} strokeWidth={2.4} /></span>
          <span>FieldPilot</span>
        </a>
        <nav className="desktop-nav" aria-label="Navegação principal">
          <a href="#produto">Produto</a><a href="#fluxo">Como funciona</a><a href="#seguranca">Segurança</a>
        </nav>
        <div className="header-actions"><ThemeToggle /><a className="button button-small" href="#contacto">Acompanhar lançamento</a></div>
      </header>

      <section className="hero" id="inicio">
        <div className="hero-copy">
          <div className="eyebrow"><span className="status-dot" /> Operações de campo, finalmente coordenadas</div>
          <h1>Da chamada do cliente ao relatório final.</h1>
          <p className="hero-lead">Organize pedidos, técnicos, equipamentos e manutenções sem depender de WhatsApp, Excel e papel.</p>
          <div className="hero-actions">
            <a className="button" href="#produto">Conhecer o FieldPilot <ArrowRight size={17} /></a>
            <a className="text-link" href="#fluxo">Ver o fluxo completo</a>
          </div>
          <ul className="proof-list" aria-label="Benefícios principais">
            <li><Check size={15} /> Feito para Portugal</li><li><Check size={15} /> Funciona no telemóvel</li><li><Check size={15} /> IA sempre opcional</li>
          </ul>
        </div>

        <div className="product-stage" aria-label="Pré-visualização do painel operacional">
          <div className="stage-glow" />
          <div className="app-window">
            <div className="window-top"><div className="mini-brand"><span className="brand-mark mini"><MapPin size={13} /></span> FieldPilot</div><span className="live-pill"><span /> Hoje</span></div>
            <div className="window-body">
              <aside className="app-sidebar" aria-hidden="true"><span className="active" /><span /><span /><span /></aside>
              <div className="app-content">
                <div className="app-heading"><div><small>QUINTA-FEIRA, 20 AGOSTO</small><h2>O que precisa da sua atenção?</h2></div><button type="button" aria-label="Criar nova ordem">+ Nova ordem</button></div>
                <div className="attention-grid">
                  <article className="attention-card urgent"><span className="card-icon">!</span><div><strong>2 ordens em risco</strong><small>Precisam de reagendamento</small></div><ArrowRight size={15} /></article>
                  <article className="attention-card"><span className="card-icon waiting">3</span><div><strong>Clientes aguardam</strong><small>Resposta pendente</small></div><ArrowRight size={15} /></article>
                </div>
                <div className="schedule-title"><strong>Próximas intervenções</strong><span>Ver agenda</span></div>
                <div className="job-row"><time>09:00</time><span className="job-line green" /><div><strong>Condomínio Aurora</strong><small>Portão da garagem · Preventiva</small></div><span className="tech-avatar">MR</span></div>
                <div className="job-row"><time>11:30</time><span className="job-line amber" /><div><strong>Hotel do Parque</strong><small>Controlo de acessos · Avaria</small></div><span className="tech-avatar blue">JS</span></div>
                <div className="job-row"><time>14:15</time><span className="job-line" /><div><strong>Clínica Atlântico</strong><small>Barreira automática · Inspeção</small></div><span className="tech-avatar dark">TC</span></div>
              </div>
            </div>
          </div>
          <div className="floating-note"><span><ShieldCheck size={16} /></span><div><strong>Equipa em movimento</strong><small>3 técnicos a caminho</small></div></div>
        </div>
      </section>

      <section className="section" id="produto">
        <div className="section-intro"><span>UM SISTEMA, TRÊS CONTEXTOS</span><h2>Cada pessoa vê apenas o que precisa para avançar.</h2><p>Uma experiência pensada para o escritório, o técnico no terreno e o cliente — sem transformar assistência técnica num ERP pesado.</p></div>
        <div className="capability-grid">{capabilities.map(({ icon: Icon, eyebrow, title, text }) => <article key={title} className="capability-card"><div className="capability-icon"><Icon size={20} /></div><small>{eyebrow}</small><h3>{title}</h3><p>{text}</p><span className="card-arrow"><ArrowRight size={16} /></span></article>)}</div>
      </section>

      <section className="workflow-section" id="fluxo">
        <div className="workflow-copy"><span>DO PEDIDO AO RESULTADO</span><h2>Um fluxo que não perde informação pelo caminho.</h2><p>Cada evento fica ligado ao cliente, ao local e ao equipamento. A equipa sabe o que aconteceu, o que falta e quem deve agir.</p><div className="feature-points"><div><QrCode size={18} /><span><strong>Histórico por equipamento</strong><small>QR e documentação num só registo.</small></span></div><div><Sparkles size={18} /><span><strong>FieldPilot AI opcional</strong><small>Ajuda na triagem e nos relatórios sem bloquear o core.</small></span></div></div></div>
        <ol className="workflow-list">{workflow.map((item, index) => <li key={item}><span>{String(index + 1).padStart(2, "0")}</span><strong>{item}</strong>{index < workflow.length - 1 && <i aria-hidden="true" />}</li>)}</ol>
      </section>

      <section className="trust-section" id="seguranca">
        <div><span className="trust-icon"><ShieldCheck size={24} /></span><h2>Construído para dados de clientes reais.</h2><p>Isolamento entre empresas, documentos privados, permissões por função e histórico de alterações fazem parte da arquitetura desde o início.</p></div>
        <ul><li><Check size={16} /> Dados separados por organização</li><li><Check size={16} /> Ficheiros privados por padrão</li><li><Check size={16} /> RGPD e exportação considerados</li></ul>
      </section>

      <section className="cta-section" id="contacto">
        <div><span>EM DESENVOLVIMENTO</span><h2>Um produto simples de adotar. Difícil de quebrar.</h2><p>O FieldPilot está a ser construído em entregas utilizáveis, com foco em empresas portuguesas de assistência técnica.</p></div>
        <a className="button button-light" href="https://github.com/brunopaulon2021/FieldPilot">Acompanhar no GitHub <ArrowRight size={17} /></a>
      </section>

      <footer><a className="brand" href="#inicio"><span className="brand-mark"><MapPin size={17} /></span>FieldPilot</a><p>Operações de campo, sem ruído.</p><span>© {new Date().getFullYear()} FieldPilot</span></footer>
    </main>
  );
}
