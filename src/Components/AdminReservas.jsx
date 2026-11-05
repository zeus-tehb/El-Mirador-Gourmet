import { Icon, Metric, PageHeading } from './AdminComun';

export default function AdminReservas({ reservations, total, currentFilter, setFilter, search, setSearch, space, setSpace, expanded, setExpanded, updateReservation, exportReservations, openModal, notify, primaryButton }) {
  const filters = [['Todas', total], ['Confirmadas', 2], ['Pendientes', 1], ['Canceladas', 1]];
  return <div className="admin-content">
    <PageHeading title="Gestión de reservas" subtitle="Revisa y administra las reservas programadas para hoy." action={primaryButton('Nueva reserva', openModal)} />
    <div className="admin-metrics admin-metrics--reservations">
      <Metric label="RESERVAS DE HOY" value="12" note="↑ 3 vs. domingo anterior" />
      <Metric label="COMENSALES" value="38" note={<>Capacidad ocupada: <b className="admin-teal">72%</b></>} />
      <Metric label="POR CONFIRMAR" value={reservations.filter((item) => item.status === 'Pendiente').length} note="Requieren atención" />
      <Metric label="PRÓXIMA RESERVA" value="14:30" note="Mesa 01 · 2 personas" />
    </div>
    <div className="admin-reservation-tools">
      <label className="admin-select"><Icon name="calendar" /><select aria-label="Fecha"><option>Hoy, 30 OCT 2026</option><option>Mañana, 31 OCT 2026</option></select></label>
      <label className="admin-select"><Icon name="table" /><select value={space} onChange={(event) => setSpace(event.target.value)} aria-label="Espacio"><option>Todos los espacios</option><option>Salón principal</option><option>Terraza</option><option>Zona privada</option></select></label>
      <label className="admin-search"><Icon name="search" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar cliente, DNI o mesa..." /></label>
      <button className="admin-button" type="button" onClick={exportReservations}><Icon name="download" /> Exportar</button>
    </div>
    <div className="admin-tabs">{filters.map(([label, count]) => <button type="button" key={label} onClick={() => setFilter(label)} className={currentFilter === label ? 'is-selected' : ''}>{label}<b>{count}</b></button>)}<span>{reservations.length} reservas encontradas</span></div>
    <div className="admin-reservation-list">
      {reservations.map((item) => <article className={`admin-reservation-card${item.status === 'Cancelada' ? ' is-cancelled' : ''}`} key={item.id}>
        <div className="admin-reservation-card__top"><div className="admin-table-title"><i /><span><small>{item.id}</small><strong>Mesa {item.table}</strong></span></div><div className="admin-reservation-card__right"><span><Icon name="users" size={15} /> {item.people} personas</span><b>{item.time}</b><button type="button" aria-label={`Más opciones para ${item.guest}`} onClick={() => setExpanded(expanded === item.id ? '' : item.id)}>···</button></div></div>
        <div className="admin-reservation-card__body">
          <div className="admin-reservation-main">
            <div><span className="admin-eyebrow">CLIENTE</span><h3>{item.guest}</h3><p>{`DNI ${item.dni}`}<span>{item.phone}</span><span>{item.email}</span></p></div>
            <div className="admin-reservation-location"><span className="admin-eyebrow">UBICACIÓN</span><strong>{item.space}</strong><em className={`admin-status admin-status--${item.status.toLowerCase()}`}>{item.status}</em></div>
          </div>
          <div className="admin-reservation-details">
            <div><span className="admin-eyebrow">OBSERVACIONES</span><p>{item.notes}</p></div>
            <div><span className="admin-eyebrow">PLATOS RESERVADOS</span><p>{item.dishes.length ? item.dishes.map((dish) => <span key={dish}>{dish}<br /></span>) : 'Sin selección anticipada'}</p></div>
            <div><span className="admin-eyebrow">PAGO</span><b className={`admin-payment${item.payment === 'Pagado' ? ' is-paid' : ''}`}>{item.payment}</b></div>
          </div>
          {expanded === item.id && <div className="admin-expanded-details"><span>Contacto: {item.phone} · {item.email}</span><span>Identificación: DNI {item.dni}</span></div>}
          <div className="admin-reservation-card__footer"><button className="admin-detail-toggle" type="button" onClick={() => setExpanded(expanded === item.id ? '' : item.id)}>{expanded === item.id ? 'Ocultar detalle' : 'Ver detalle completo'}⌄</button><div>
            {item.status === 'Cancelada' ? <button className="admin-button" type="button" onClick={() => { updateReservation(item.id, { status: 'Pendiente' }); notify('Reserva restaurada.'); }}>Restaurar reserva</button> : <>
              {item.status === 'Pendiente' && <button className="admin-button admin-button--primary" type="button" onClick={() => { updateReservation(item.id, { status: 'Confirmada' }); notify('Reserva confirmada.'); }}>Confirmar reserva</button>}
              <button className="admin-button" type="button" onClick={() => { updateReservation(item.id, { status: 'Cancelada' }); notify('Reserva cancelada.'); }}>Cancelar</button>
            </>}
          </div></div>
        </div>
      </article>)}
      {!reservations.length && <div className="admin-empty">No se encontraron reservas con estos criterios.</div>}
    </div>
  </div>;
}
