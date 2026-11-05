import { useState } from 'react';
import { PageHeading } from './AdminComun';

const tables = [
  { id: '01', seats: 2, zone: 'Terraza', status: 'occupied' }, { id: '02', seats: 4, zone: 'Terraza', status: 'available' }, { id: '03', seats: 2, zone: 'Terraza', status: 'booked' },
  { id: '04', seats: 4, zone: 'Salón principal', status: 'occupied' }, { id: '05', seats: 2, zone: 'Salón principal', status: 'available' }, { id: '06', seats: 4, zone: 'Salón principal', status: 'booked' },
  { id: '07', seats: 6, zone: 'Salón principal', status: 'occupied' }, { id: '08', seats: 2, zone: 'Salón principal', status: 'cleaning' }, { id: '09', seats: 4, zone: 'Salón principal', status: 'available' },
  { id: '10', seats: 6, zone: 'Zona privada', status: 'booked' }, { id: '11', seats: 4, zone: 'Zona privada', status: 'available' }, { id: '12', seats: 8, zone: 'Zona privada', status: 'occupied' },
];

export default function AdminMesas({ onAssign, notify, primaryButton }) {
  const [selected, setSelected] = useState(null);
  const occupied = ['01', '04', '07', '12'];
  const booked = ['03', '06', '10'];
  const statusOf = (table) => occupied.includes(table.id) ? 'occupied' : booked.includes(table.id) ? 'booked' : table.status;
  const labels = { occupied: 'Ocupada', booked: 'Reservada', available: 'Disponible', cleaning: 'En limpieza' };

  return <div className="admin-content">
    <PageHeading title="Croquis de mesas" subtitle="Visualiza en tiempo real la ocupación y disponibilidad del restaurante." action={primaryButton('Asignar mesa', onAssign)} />
    <div className="admin-table-summary"><div><strong>{occupied.length}</strong> Ocupadas</div><div><strong>{booked.length}</strong> Reservadas</div><div><strong>{12 - occupied.length - booked.length - 1}</strong> Disponibles</div><div><strong>1</strong> En limpieza</div><div className="admin-legend"><span><i className="is-occupied" />Ocupadas</span><span><i className="is-booked" />Reservadas</span><span><i className="is-available" />Disponibles</span><span><i className="is-cleaning" />Limpieza</span></div></div>
    <section className="admin-floorplan"><span className="admin-floorplan__view">VISTA AL MAR</span><div className="admin-floorplan__zones">
      {['Terraza', 'Salón principal', 'Zona privada'].map((zone) => <div className={`admin-floor-zone admin-floor-zone--${zone === 'Terraza' ? 'terrace' : zone === 'Salón principal' ? 'hall' : 'private'}`} key={zone}><span>{zone}</span><div className="admin-floor-zone__tables">{tables.filter((table) => table.zone === zone).map((table) => {
        const status = statusOf(table);
        return <button type="button" key={table.id} className={`admin-table admin-table--${status}${selected === table.id ? ' is-picked' : ''}`} onClick={() => { setSelected(table.id); notify(`Mesa ${table.id}: ${labels[status]}. ${table.seats} personas.`); }} aria-label={`Mesa ${table.id}, ${labels[status]}, ${table.seats} personas`}><small>MESA</small><strong>{table.id}</strong><small>{table.seats} personas</small></button>;
      })}</div>{zone === 'Salón principal' && <div className="admin-bar">BARRA</div>}</div>)}
    </div><div className="admin-floorplan__entry">ENTRADA</div></section>
    <p className="admin-table-hint">Selecciona una mesa para consultar su estado. {selected && `Mesa ${selected} seleccionada.`}</p>
  </div>;
}
