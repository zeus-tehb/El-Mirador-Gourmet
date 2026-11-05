import { Icon, PageHeading } from './AdminComun';

export default function AdminReportes({ notify }) {
  const demand = [22, 38, 58, 82, 22, 39, 58, 82, 22, 39];
  return <div className="admin-content">
    <PageHeading title="Reportes" subtitle="Indicadores para tomar mejores decisiones comerciales y operativas." action={<button className="admin-button" type="button" onClick={() => { window.print(); notify('Selecciona "Guardar como PDF" en las opciones de impresión.'); }}><Icon name="download" />Exportar PDF</button>} />
    <section className="admin-reports-banner"><div><span>FACTURACIÓN · OCTUBRE</span><strong>S/ 142,680</strong><small>Objetivo mensual: S/ 180,000</small><i><b /></i></div><div className="admin-reports-target"><strong>79%</strong><small>del objetivo</small></div></section>
    <div className="admin-reports-grid">
      <section className="admin-card admin-sales-chart"><div className="admin-card-heading"><div><span className="admin-eyebrow">ÚLTIMOS 6 MESES</span><h2>Evolución de ventas</h2></div><strong>+18.2%</strong></div><svg viewBox="0 0 620 250" role="img" aria-label="Gráfico de evolución de ventas en seis meses"><defs><linearGradient id="salesFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#725f58" stopOpacity=".28" /><stop offset="100%" stopColor="#725f58" stopOpacity=".02" /></linearGradient></defs><path d="M0 204 C60 188 85 194 125 168 S200 150 245 154 S312 140 350 112 S412 108 450 122 S500 130 535 92 S590 90 620 64 L620 250 L0 250Z" fill="url(#salesFill)" /><path d="M0 204 C60 188 85 194 125 168 S200 150 245 154 S312 140 350 112 S412 108 450 122 S500 130 535 92 S590 90 620 64" fill="none" stroke="#67544d" strokeWidth="3" /></svg><div className="admin-month-labels">{['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'].map((month) => <span key={month}>{month}</span>)}</div></section>
      <section className="admin-card admin-source-card"><span className="admin-eyebrow">CANALES</span><h2>Origen de reservas</h2><div className="admin-donut-wrap"><div className="admin-donut"><strong>284</strong><small>reservas</small></div><ul><li><i />Web <b>52%</b></li><li><i />WhatsApp <b>31%</b></li><li><i />Teléfono <b>17%</b></li></ul></div></section>
      <section className="admin-card admin-demand-card"><span className="admin-eyebrow">COMPORTAMIENTO</span><h2>Horas de mayor demanda</h2><div className="admin-demand-bars">{demand.map((height, index) => <div key={`${height}-${index}`}><i style={{ height: `${height}%` }} /><small>{12 + index}h</small></div>)}</div></section>
      <section className="admin-card admin-efficiency"><span className="admin-eyebrow">EFICIENCIA</span><h2>Indicadores operativos</h2><div className="admin-efficiency-grid">{[['Cancelaciones', '6.2%'], ['Mesas reutilizadas', '2.4×'], ['Tiempo promedio', '98 min'], ['Satisfacción', '4.8/5']].map(([label, value]) => <div key={label}><small>{label}</small><strong>{value}</strong></div>)}</div></section>
    </div>
  </div>;
}
