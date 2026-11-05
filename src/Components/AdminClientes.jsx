import { clients } from '../AdminData';
import { Icon, PageHeading, downloadCsv } from './AdminComun';

export default function AdminClientes({ search, setSearch, openModal, notify }) {
  const visibleClients = clients.filter((client) => `${client.name} ${client.level} ${client.table}`.toLocaleLowerCase('es').includes(search.toLocaleLowerCase('es')));
  return <div className="admin-content">
    <PageHeading title="Clientes" subtitle="Prioridad calculada según frecuencia de visitas y consumo histórico." action={<button className="admin-button admin-button--primary" type="button" onClick={openModal}><Icon name="plus" size={15} />Nuevo cliente</button>} />
    <div className="admin-priority-banner"><strong>Prioridad de reserva especial</strong><span>Los clientes con mayor número de visitas aparecen primero y tienen acceso preferente a mesas especiales.</span></div>
    <div className="admin-client-tools"><label className="admin-search"><Icon name="search" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar por nombre, DNI o teléfono..." /></label><button className="admin-button" type="button" onClick={() => { downloadCsv('clientes-el-mirador.csv', [['Prioridad', 'Cliente', 'Visitas', 'Consumo', 'Nivel', 'Mesa preferida', 'Última visita'], ...visibleClients.map((client, index) => [index + 1, client.name, client.visits, client.spent, client.level, client.table, client.last])]); notify('Base de clientes exportada.'); }}><Icon name="download" />Exportar base</button></div>
    <div className="admin-client-table-wrap"><table className="admin-client-table"><thead><tr><th>PRIORIDAD / CLIENTE</th><th>VISITAS</th><th>CONSUMO</th><th>NIVEL</th><th>MESA PREFERIDA</th><th>ÚLTIMA VISITA</th></tr></thead><tbody>{visibleClients.map((client, index) => <tr key={client.name}><td><div className="admin-client-name"><b>{index + 1}</b><i>{client.initials}</i><strong>{client.name}</strong></div></td><td>{client.visits} visitas</td><td>{client.spent}</td><td><span className={`admin-level admin-level--${client.level.toLowerCase().replace(' ', '-')}`}>{client.level}</span></td><td>{client.table}</td><td>{client.last}</td></tr>)}</tbody></table>{!visibleClients.length && <p className="admin-empty">No se encontraron clientes.</p>}</div>
  </div>;
}
