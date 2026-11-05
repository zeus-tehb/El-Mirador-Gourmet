import { useEffect, useState } from 'react';
import { reservationsInitial } from '../AdminData';

const secciones = [
  { id: 'datos', etiqueta: 'Datos personales', icono: '♙' },
  { id: 'pagos', etiqueta: 'Métodos de pago', icono: '▤' },
  { id: 'reservas', etiqueta: 'Historial de reservas', icono: '▦' },
  { id: 'configuracion', etiqueta: 'Configuración', icono: '⚙' },
];

const titulos = {
  datos: 'Datos personales',
  pagos: 'Métodos de pago',
  reservas: 'Historial de reservas',
  configuracion: 'Configuración',
};

function DatosPersonales({ cliente, onUpdate }) {
  const [editando, setEditando] = useState(false);
  const [datos, setDatos] = useState(cliente);
  const [guardado, setGuardado] = useState(false);

  function guardarDatos(event) {
    event.preventDefault();
    onUpdate(datos);
    setEditando(false);
    setGuardado(true);
  }

  return (
    <section className="cuenta-tarjeta cuenta-datos">
      <h2>Información personal</h2>
      {editando ? (
        <form className="cuenta-formulario cuenta-formulario--datos" onSubmit={guardarDatos}>
          <label>
            Nombre completo
            <input
              value={datos.nombre}
              onChange={(event) => setDatos({ ...datos, nombre: event.target.value })}
              required
            />
          </label>
          <label>
            Documento de identidad
            <input
              value={datos.dni}
              onChange={(event) => setDatos({ ...datos, dni: event.target.value })}
              required
            />
          </label>
          <label>
            Teléfono móvil
            <input
              type="tel"
              value={datos.telefono}
              onChange={(event) => setDatos({ ...datos, telefono: event.target.value })}
              required
            />
          </label>
          <label>
            Correo electrónico
            <input
              type="email"
              value={datos.correo}
              onChange={(event) => setDatos({ ...datos, correo: event.target.value })}
              required
            />
          </label>
          <div className="cuenta-acciones">
            <button className="cuenta-boton cuenta-boton--secundario" type="button" onClick={() => setEditando(false)}>
              Cancelar
            </button>
            <button className="cuenta-boton" type="submit">Guardar datos</button>
          </div>
        </form>
      ) : (
        <>
          <dl className="cuenta-datos-lista">
            <div><dt>Nombre completo</dt><dd>{cliente.nombre}</dd></div>
            <div><dt>Documento de identidad</dt><dd>DNI: {cliente.dni}</dd></div>
            <div><dt>Teléfono móvil</dt><dd>{cliente.telefono}</dd></div>
            <div><dt>Correo electrónico</dt><dd>{cliente.correo}</dd></div>
          </dl>
          <div className="cuenta-acciones">
            {guardado && <span className="cuenta-mensaje" role="status">Datos actualizados.</span>}
            <button className="cuenta-boton" type="button" onClick={() => { setGuardado(false); setEditando(true); }}>
              Editar datos
            </button>
          </div>
        </>
      )}
    </section>
  );
}

function MetodosPago({ cliente, onUpdate }) {
  const [numero, setNumero] = useState('');
  const [titular, setTitular] = useState('');
  const [vencimiento, setVencimiento] = useState('');
  const [error, setError] = useState('');

  function agregarTarjeta(event) {
    event.preventDefault();
    const digitos = numero.replace(/\D/g, '');
    if (digitos.length < 12 || digitos.length > 19) {
      setError('Ingresa un número de tarjeta válido.');
      return;
    }

    const tarjetas = cliente.tarjetas || [];
    onUpdate({
      ...cliente,
      tarjetas: [...tarjetas, {
        id: `${Date.now()}`,
        titular: titular.trim(),
        ultimosDigitos: digitos.slice(-4),
        vencimiento,
      }],
    });
    setNumero('');
    setTitular('');
    setVencimiento('');
    setError('');
  }

  function eliminarTarjeta(id) {
    onUpdate({
      ...cliente,
      tarjetas: cliente.tarjetas.filter((tarjeta) => tarjeta.id !== id),
    });
  }

  return (
    <div className="cuenta-pagos">
      <section className="cuenta-tarjeta">
        <h2>Tarjetas guardadas</h2>
        {cliente.tarjetas?.length ? (
          <ul className="cuenta-tarjetas-lista">
            {cliente.tarjetas.map((tarjeta) => (
              <li key={tarjeta.id}>
                <span className="cuenta-tarjeta-icono" aria-hidden="true">▰</span>
                <span><strong>Tarjeta terminada en {tarjeta.ultimosDigitos}</strong><small>{tarjeta.titular} · Vence {tarjeta.vencimiento}</small></span>
                <button className="cuenta-enlace" type="button" onClick={() => eliminarTarjeta(tarjeta.id)}>
                  Eliminar
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="cuenta-vacio">Todavía no tienes tarjetas guardadas.</p>
        )}
      </section>
      <section className="cuenta-tarjeta">
        <h2>Agregar nueva tarjeta</h2>
        <p className="cuenta-nota">Demo: no se realizan cobros. Solo se conserva el nombre, vencimiento y los últimos cuatro dígitos.</p>
        <form className="cuenta-formulario cuenta-formulario--tarjeta" onSubmit={agregarTarjeta}>
          <label>
            Número de tarjeta
            <input
              inputMode="numeric"
              autoComplete="cc-number"
              value={numero}
              onChange={(event) => setNumero(event.target.value)}
              placeholder="Número de tarjeta"
              required
            />
          </label>
          <label>
            Nombre en la tarjeta
            <input
              autoComplete="cc-name"
              value={titular}
              onChange={(event) => setTitular(event.target.value)}
              placeholder="Nombre del titular"
              required
            />
          </label>
          <label>
            Fecha de vencimiento
            <input
              autoComplete="cc-exp"
              value={vencimiento}
              onChange={(event) => setVencimiento(event.target.value)}
              placeholder="MM/AA"
              pattern="(0[1-9]|1[0-2])/[0-9]{2}"
              required
            />
          </label>
          {error && <p className="cuenta-error" role="alert">{error}</p>}
          <button className="cuenta-boton" type="submit">Guardar tarjeta</button>
        </form>
      </section>
    </div>
  );
}

function HistorialReservas({ cliente }) {
  const [estadoFiltro, setEstadoFiltro] = useState('Todas');
  const reservas = reservationsInitial.filter((reserva) => (
    reserva.guest === cliente.nombre
    && (estadoFiltro === 'Todas' || reserva.status === estadoFiltro)
  ));

  return (
    <section className="cuenta-historial">
      <label className="cuenta-filtro">
        Estado
        <select value={estadoFiltro} onChange={(event) => setEstadoFiltro(event.target.value)}>
          <option>Todas</option>
          <option>Confirmada</option>
          <option>Pendiente</option>
          <option>Cancelada</option>
        </select>
      </label>
      {reservas.length ? (
        <div className="cuenta-reservas-grid">
          {reservas.map((reserva) => (
            <article className="cuenta-tarjeta cuenta-reserva" key={reserva.id}>
              <h2>Reserva #{reserva.id.replace('RSV-', '')}</h2>
              <p>{reserva.space} · Mesa {reserva.table}</p>
              <p>Hora: {reserva.time} · Personas: {reserva.people}</p>
              <span className={`cuenta-estado cuenta-estado--${reserva.status.toLowerCase()}`}>
                {reserva.status}
              </span>
            </article>
          ))}
        </div>
      ) : (
        <p className="cuenta-vacio">No hay reservas para mostrar con este estado.</p>
      )}
    </section>
  );
}

function Configuracion({ cliente, onUpdate }) {
  const preferencias = cliente.preferencias || { correo: true, novedades: false };

  function cambiarPreferencia(nombre, valor) {
    onUpdate({
      ...cliente,
      preferencias: { ...preferencias, [nombre]: valor },
    });
  }

  return (
    <section className="cuenta-tarjeta cuenta-configuracion">
      <h2>Preferencias de cuenta</h2>
      <p className="cuenta-nota">Administra cómo quieres recibir información de El Mirador Gourmet.</p>
      <label className="cuenta-preferencia">
        <span><strong>Notificaciones de reservas</strong><small>Recibir actualizaciones sobre tus reservas por correo.</small></span>
        <input
          type="checkbox"
          checked={preferencias.correo}
          onChange={(event) => cambiarPreferencia('correo', event.target.checked)}
        />
      </label>
      <label className="cuenta-preferencia">
        <span><strong>Novedades y promociones</strong><small>Recibir noticias y ofertas especiales del restaurante.</small></span>
        <input
          type="checkbox"
          checked={preferencias.novedades}
          onChange={(event) => cambiarPreferencia('novedades', event.target.checked)}
        />
      </label>
    </section>
  );
}

export default function CuentaCliente({ cliente, initialSection, onUpdate, onClose, onLogout }) {
  const [seccionActiva, setSeccionActiva] = useState(initialSection || 'datos');

  useEffect(() => {
    function cerrarConEscape(event) {
      if (event.key === 'Escape') onClose();
    }

    window.addEventListener('keydown', cerrarConEscape);
    return () => window.removeEventListener('keydown', cerrarConEscape);
  }, [onClose]);

  return (
    <div
      className="cuenta-fondo"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section className="cuenta-panel" role="dialog" aria-modal="true" aria-labelledby="cuenta-titulo">
        <header className="cuenta-encabezado">
          <div>
            <span className="cuenta-sobrelinea">EL MIRADOR GOURMET</span>
            <h1 id="cuenta-titulo">¡Hola, {cliente.nombre}!</h1>
          </div>
          <button className="cuenta-cerrar" type="button" aria-label="Cerrar cuenta" onClick={onClose}>×</button>
        </header>
        <div className="cuenta-cuerpo">
          <nav className="cuenta-lateral" aria-label="Opciones de cuenta">
            {secciones.map((seccion) => (
              <button
                className={`cuenta-nav-item${seccionActiva === seccion.id ? ' cuenta-nav-item--activo' : ''}`}
                type="button"
                key={seccion.id}
                aria-current={seccionActiva === seccion.id ? 'page' : undefined}
                onClick={() => setSeccionActiva(seccion.id)}
              >
                <span aria-hidden="true">{seccion.icono}</span>{seccion.etiqueta}
              </button>
            ))}
            <button className="cuenta-nav-item cuenta-nav-item--salir" type="button" onClick={onLogout}>
              <span aria-hidden="true">↪</span>Cerrar sesión
            </button>
          </nav>
          <main className="cuenta-contenido">
            <h2 className="cuenta-seccion-titulo">{titulos[seccionActiva]}</h2>
            {seccionActiva === 'datos' && <DatosPersonales cliente={cliente} onUpdate={onUpdate} />}
            {seccionActiva === 'pagos' && <MetodosPago cliente={cliente} onUpdate={onUpdate} />}
            {seccionActiva === 'reservas' && <HistorialReservas cliente={cliente} />}
            {seccionActiva === 'configuracion' && <Configuracion cliente={cliente} onUpdate={onUpdate} />}
          </main>
        </div>
      </section>
    </div>
  );
}
