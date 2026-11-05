import { Metric, PageHeading, Icon } from './AdminComun';

export default function AdminResumen({ setPage }) {
  const bars = [40, 67, 83, 51, 62, 35, 73, 89];
  return <div className="admin-content">
    <PageHeading title="Resumen del día" subtitle="Todo lo que está ocurriendo hoy en El Mirador Gourmet." action={<button className="admin-button" type="button" onClick={() => window.print()}><Icon name="download" /> Descargar cierre</button>} />
    <div className="admin-metrics admin-metrics--dashboard">
      <Metric dark label="GANANCIAS DE HOY" value="S/ 8,460" note="↑ 12.4% frente al domingo anterior" />
      <Metric label="RESERVAS TOTALES" value="12" note="38 comensales esperados" />
      <Metric label="CLIENTES NUEVOS" value="7" note="↑ 3 más que ayer" />
      <Metric label="PÉRDIDA VS. MES ANTERIOR" value="− S/ 1,280" note="− 4.8% en facturación mensual" negative />
    </div>
    <div className="admin-dashboard-grid">
      <section className="admin-card admin-revenue">
        <div className="admin-card-heading"><div><span className="admin-eyebrow">INGRESOS</span><h2>Rendimiento del día</h2></div><span className="admin-today">Hoy</span></div>
        <div className="admin-chart">
          <div className="admin-chart__y"><span>S/ 3k</span><span>S/ 2k</span><span>S/ 1k</span><span>S/ 0</span></div>
          <div className="admin-chart__bars">{bars.map((height, index) => <div key={height + index}><i style={{ height: `${height}%` }} /><small>{index + 12} pm</small></div>)}</div>
        </div>
      </section>
      <section className="admin-card admin-popular">
        <span className="admin-eyebrow">POPULARIDAD</span><h2>Platos más pedidos</h2>
        {[
          ['Lomo fino al vino tinto', '14 pedidos', 'S/ 952'],
          ['Chilcano de maracuyá', '15 pedidos', 'S/ 416'],
          ['Arroz meloso de mariscos', '12 pedidos', 'S/ 696'],
          ['Tiradito de pesca del día', '11 pedidos', 'S/ 462'],
        ].map((item, index) => <div className="admin-popular-row" key={item[0]}><b>{`0${index + 1}`}</b><span>{item[0]}<small>{item[1]}</small></span><strong>{item[2]}</strong></div>)}
      </section>
      <section className="admin-card admin-occupancy">
        <div className="admin-card-heading"><div><span className="admin-eyebrow">OPERACIÓN</span><h2>Ocupación por espacio</h2></div><strong className="admin-occupancy__percent">72%</strong></div>
        {[['Salón principal', '18 de 24 lugares', 75], ['Terraza', '12 de 16 lugares', 75], ['Zona privada', '8 de 12 lugares', 67]].map((row) => <div className="admin-space-meter" key={row[0]}><div><span>{row[0]}</span><small>{row[1]}</small></div><i><b style={{ width: `${row[2]}%` }} /></i></div>)}
      </section>
      <section className="admin-card admin-activity">
        <span className="admin-eyebrow">EN VIVO</span><h2>Actividad reciente</h2>
        {[
          ['Reserva RSV-2054 confirmada', 'Hace 2 minutos', 'teal'],
          ['Mesa 08 liberada y lista', 'Hace 6 minutos', 'gold'],
          ['Nuevo cliente: Paula Reyes', 'Hace 10 minutos', 'teal'],
          ['Pago de S/ 420 registrado', 'Hace 14 minutos', 'teal'],
        ].map((row) => <div className="admin-activity-row" key={row[0]}><i className={`admin-dot admin-dot--${row[2]}`} /><span>{row[0]}<small>{row[1]}</small></span></div>)}
      </section>
    </div>
    <button className="admin-dashboard-link" type="button" onClick={() => setPage('Reservas')}>Ver gestión de reservas →</button>
  </div>;
}
