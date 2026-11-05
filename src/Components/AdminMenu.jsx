import { useState } from 'react';
import { menuCategories } from '../AdminData';
import { PageHeading } from './AdminComun';

export default function AdminMenu({ openModal, notify, primaryButton }) {
  const [category, setCategory] = useState('Todas');
  return <div className="admin-content">
    <PageHeading title="Carta y pedidos" subtitle="Menú disponible hoy, demanda y control de platos." action={primaryButton('Agregar plato', openModal)} />
    <div className="admin-menu-summary">{[['PLATOS ACTIVOS', '12'], ['PEDIDOS HOY', '118'], ['TICKET PROMEDIO', 'S/ 186'], ['NO DISPONIBLES', '2']].map(([label, value]) => <div key={label}><span>{label}</span><strong>{value}</strong></div>)}</div>
    <div className="admin-menu-filters">{['Todas', ...menuCategories.map((group) => group.name)].map((name) => <button type="button" key={name} onClick={() => setCategory(name)} className={category === name ? 'is-selected' : ''}>{name}</button>)}</div>
    <div className="admin-menu-grid">{menuCategories.filter((group) => category === 'Todas' || group.name === category).map((group) => <section className="admin-card admin-menu-category" key={group.name}><div className="admin-card-heading"><h2>{group.name}</h2><span>{group.dishes.length} opciones</span></div>{group.dishes.map(([name, orders, price, status]) => <div className="admin-dish" key={name}><span className="admin-dish__initial">{name[0]}</span><div><strong>{name}</strong><small>{status} hoy · {orders} pedidos</small></div><b>{price}</b><button type="button" aria-label={`Opciones de ${name}`} onClick={() => notify(`${name}: ${status.toLocaleLowerCase()} hoy.`)}>···</button></div>)}</section>)}</div>
  </div>;
}
