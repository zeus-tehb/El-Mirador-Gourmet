export default function AdminModal({ type, close, save }) {
  const fields = {
    reservation: { title: 'Nueva reserva', entries: [['Nombre del cliente', 'text'], ['Teléfono', 'tel'], ['Fecha', 'date'], ['Hora', 'time'], ['Número de personas', 'number']] },
    client: { title: 'Nuevo cliente', entries: [['Nombre completo', 'text'], ['DNI', 'text'], ['Teléfono', 'tel'], ['Correo electrónico', 'email']] },
    dish: { title: 'Agregar plato', entries: [['Nombre del plato', 'text'], ['Categoría', 'text'], ['Precio (S/)', 'number'], ['Descripción', 'text']] },
    table: { title: 'Asignar mesa', entries: [['Nombre del cliente', 'text'], ['Número de personas', 'number'], ['Mesa', 'text'], ['Hora', 'time']] },
  };
  const config = fields[type];
  return <div className="admin-modal-backdrop" onMouseDown={close}><section className="admin-modal" role="dialog" aria-modal="true" aria-labelledby="admin-modal-title" onMouseDown={(event) => event.stopPropagation()}>
    <button className="admin-modal__close" type="button" aria-label="Cerrar" onClick={close}>×</button><span className="admin-eyebrow">EL MIRADOR GOURMET</span><h2 id="admin-modal-title">{config.title}</h2>
    <form onSubmit={(event) => { event.preventDefault(); save(`${config.title} guardado correctamente.`); }}>
      {config.entries.map(([label, typeName], index) => <label key={label}>{label}<input type={typeName} min={typeName === 'number' ? '1' : undefined} required={index < 2} /></label>)}
      <div className="admin-modal__actions"><button type="button" className="admin-button" onClick={close}>Cancelar</button><button type="submit" className="admin-button admin-button--primary">Guardar</button></div>
    </form>
  </section></div>;
}
