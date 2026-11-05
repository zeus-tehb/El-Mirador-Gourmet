import { useMemo, useState } from 'react';
import AdminClientes from './AdminClientes';
import AdminResumen from './AdminResumen';
import AdminMenu from './AdminMenu';
import AdminModal from './AdminModal';
import AdminReportes from './AdminReportes';
import AdminReservas from './AdminReservas';
import AdminMesas from './AdminMesas';
import AdminHorarios from './AdminHorarios';
import { downloadCsv, Icon } from './AdminComun';
import { navigation, reservationsInitial } from '../AdminData';
import { getScheduleForDate, useBusinessHours } from '../businessHours';
import '../Admin.css';

export default function Admin({ onExit }) {
  const businessHours = useBusinessHours();
  const [page, setPage] = useState('Resumen');
  const [reservations, setReservations] = useState(reservationsInitial);
  const [reservationFilter, setReservationFilter] = useState('Todas');
  const [reservationSearch, setReservationSearch] = useState('');
  const [clientSearch, setClientSearch] = useState('');
  const [spaceFilter, setSpaceFilter] = useState('Todos los espacios');
  const [expanded, setExpanded] = useState('');
  const [modal, setModal] = useState('');
  const [notice, setNotice] = useState('');

  const filteredReservations = useMemo(() => reservations.filter((reservation) => {
    const matchesStatus = reservationFilter === 'Todas' || reservation.status === reservationFilter.slice(0, -1) || (reservationFilter === 'Confirmadas' && reservation.status === 'Confirmada') || (reservationFilter === 'Canceladas' && reservation.status === 'Cancelada');
    const query = reservationSearch.trim().toLocaleLowerCase('es');
    const matchesQuery = !query || [reservation.guest, reservation.dni, reservation.table, reservation.id].some((value) => value.toLocaleLowerCase('es').includes(query));
    return matchesStatus && matchesQuery && (spaceFilter === 'Todos los espacios' || reservation.space === spaceFilter);
  }), [reservations, reservationFilter, reservationSearch, spaceFilter]);

  function updateReservation(id, changes) {
    setReservations((items) => items.map((item) => item.id === id ? { ...item, ...changes } : item));
  }

  function notify(message) {
    setNotice(message);
    window.setTimeout(() => setNotice(''), 2600);
  }

  function exportReservations() {
    downloadCsv('reservas-el-mirador.csv', [
      ['Código', 'Cliente', 'Mesa', 'Personas', 'Hora', 'Ubicación', 'Estado', 'Pago'],
      ...reservations.map((item) => [item.id, item.guest, item.table, item.people, item.time, item.space, item.status, item.payment]),
    ]);
  }

  const primaryButton = (text, onClick) => <button className="admin-button admin-button--primary" type="button" onClick={onClick}><Icon name="plus" size={15} />{text}</button>;
  const today = new Date();
  const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  const todaySchedule = getScheduleForDate(todayKey, businessHours);

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <div className="admin-brand__seal">MG</div>
          <div><strong>EL MIRADOR</strong><small>GOURMET</small></div>
        </div>
        <nav className="admin-side-nav" aria-label="Administración">
          {navigation.map((group) => <div className="admin-nav-group" key={group.section}>
            <p>{group.section}</p>
            {group.items.map((item) => <button key={item.label} className={`admin-nav-link${page === item.label ? ' is-active' : ''}`} type="button" onClick={() => setPage(item.label)}>
              <Icon name={item.icon} /><span>{item.label}</span>{item.badge && <small>{reservations.length + 8}</small>}
            </button>)}
          </div>)}
        </nav>
        <div className="admin-profile">
          <div className="admin-avatar">JM</div>
          <div><strong>Jhonatan Mantilla</strong><small>Administrador</small></div>
          <button type="button" aria-label="Volver al sitio" title="Volver al sitio" onClick={onExit}>↪</button>
        </div>
      </aside>
      <div className="admin-workspace">
        <header className="admin-topbar">
          <div><span>ADMINISTRACIÓN</span><strong>{page}</strong></div>
          <div className="admin-topbar__right"><span className={!todaySchedule.enabled ? 'is-closed' : ''}><i /> Restaurante {todaySchedule.enabled ? 'abierto' : 'cerrado'}</span><button type="button" aria-label="Notificaciones" onClick={() => notify('No tienes notificaciones nuevas.')}><Icon name="bell" size={18}/><b>3</b></button></div>
        </header>
        <main className="admin-main">
          {page === 'Resumen' && <AdminResumen setPage={setPage} />}
          {page === 'Reservas' && <AdminReservas
            reservations={filteredReservations}
            total={reservations.length}
            currentFilter={reservationFilter}
            setFilter={setReservationFilter}
            search={reservationSearch}
            setSearch={setReservationSearch}
            space={spaceFilter}
            setSpace={setSpaceFilter}
            expanded={expanded}
            setExpanded={setExpanded}
            updateReservation={updateReservation}
            exportReservations={exportReservations}
            openModal={() => setModal('reservation')}
            notify={notify}
            primaryButton={primaryButton}
          />}
          {page === 'Mesas' && <AdminMesas onAssign={() => setModal('table')} notify={notify} primaryButton={primaryButton} />}
          {page === 'Carta y pedidos' && <AdminMenu openModal={() => setModal('dish')} notify={notify} primaryButton={primaryButton} />}
          {page === 'Clientes' && <AdminClientes search={clientSearch} setSearch={setClientSearch} openModal={() => setModal('client')} notify={notify} />}
          {page === 'Reportes' && <AdminReportes notify={notify} />}
          {page === 'Horarios y cierres' && <AdminHorarios notify={notify} />}
        </main>
      </div>
      {notice && <div className="admin-toast" role="status">{notice}</div>}
      {modal && <AdminModal type={modal} close={() => setModal('')} save={(message) => { setModal(''); notify(message); }} />}
    </div>
  );
}
