import { useEffect, useState } from 'react';
import { menuCategories } from '../AdminData';
import {
  formatBusinessTime,
  getEnvironmentPrice,
  getReservationSlots,
  getScheduleForDate,
  useBusinessHours,
} from '../businessHours';
import '../NuevaReserva.css';

const ambientes = [
  { nombre: 'Terraza', detalle: 'Al aire libre, junto a la costa', icono: '☼' },
  { nombre: 'Salón principal', detalle: 'Un espacio cálido y elegante', icono: '⌂' },
  { nombre: 'Zona privada', detalle: 'Un espacio íntimo para compartir', icono: '◇' },
];

const metodosPago = [
  { id: 'tarjeta', nombre: 'Tarjeta', detalle: 'Crédito o débito' },
  { id: 'transferencia', nombre: 'Transferencia', detalle: 'Coordinamos los datos por WhatsApp' },
  { id: 'yape', nombre: 'Yape', detalle: 'Billetera móvil' },
  { id: 'plin', nombre: 'Plin', detalle: 'Billetera móvil' },
  { id: 'sip', nombre: 'SIP', detalle: 'Aplicativo móvil' },
  { id: 'efectivo', nombre: 'Efectivo', detalle: 'En el restaurante antes de recibir la mesa' },
];

const tarjetasVacias = [];

function fechaLocal(fecha) {
  const anio = fecha.getFullYear();
  const mes = String(fecha.getMonth() + 1).padStart(2, '0');
  const dia = String(fecha.getDate()).padStart(2, '0');
  return `${anio}-${mes}-${dia}`;
}

export default function NuevaReserva({ cliente }) {
  const businessHours = useBusinessHours();
  const [fecha, setFecha] = useState('');
  const [comensales, setComensales] = useState('2');
  const [horario, setHorario] = useState('');
  const [ambiente, setAmbiente] = useState('Terraza');
  const [cantidades, setCantidades] = useState({});
  const [mensaje, setMensaje] = useState('');
  const [checkoutAbierto, setCheckoutAbierto] = useState(false);
  const [modalidadPago, setModalidadPago] = useState('adelanto');
  const [metodoPago, setMetodoPago] = useState('');
  const [tarjetaGuardadaId, setTarjetaGuardadaId] = useState(cliente?.tarjetas?.[0]?.id || '');
  const [tarjetaNueva, setTarjetaNueva] = useState(false);
  const [solicitudEnviada, setSolicitudEnviada] = useState(false);
  const tarjetasGuardadas = cliente?.tarjetas || tarjetasVacias;
  const tarjetaGuardada = tarjetasGuardadas.find((tarjeta) => tarjeta.id === tarjetaGuardadaId);

  useEffect(() => {
    if (!tarjetasGuardadas.some((tarjeta) => tarjeta.id === tarjetaGuardadaId)) {
      setTarjetaGuardadaId(tarjetasGuardadas[0]?.id || '');
    }
  }, [cliente, tarjetaGuardadaId, tarjetasGuardadas]);

  const platosSeleccionados = menuCategories.flatMap((categoria) => (
    categoria.dishes
      .filter(([nombre]) => cantidades[nombre])
      .map(([nombre, , precio]) => ({
        nombre,
        precio,
        cantidad: cantidades[nombre],
      }))
  ));
  const totalPlatos = platosSeleccionados.reduce((total, plato) => (
    total + Number(plato.precio.replace('S/ ', '')) * plato.cantidad
  ), 0);
  const tarifaAmbiente = getEnvironmentPrice(businessHours.pricing, ambiente, Number(comensales));
  const totalReserva = Math.round((tarifaAmbiente + totalPlatos) * 100) / 100;
  const importePago = modalidadPago === 'adelanto'
    ? Math.round(totalReserva * 50) / 100
    : totalReserva;
  const saldoRestante = Math.round((totalReserva - importePago) * 100) / 100;
  const horarioDelDia = fecha ? getScheduleForDate(fecha, businessHours) : null;
  const horarios = getReservationSlots(horarioDelDia);

  function cambiarCantidad(nombre, cantidad) {
    setCantidades((actuales) => ({ ...actuales, [nombre]: Math.max(0, cantidad) }));
  }

  function revisarReserva(event) {
    event.preventDefault();
    if (!cliente || !horarioDelDia?.enabled || !fecha || !horario) return;
    setMensaje('');
    setSolicitudEnviada(false);
    setCheckoutAbierto(true);
  }

  function registrarSolicitud(event) {
    event.preventDefault();
    if (!metodoPago) return;
    setSolicitudEnviada(true);
    setMensaje('Solicitud de reserva recibida. El pago está pendiente de confirmación.');
  }

  return (
    <section className="nueva-reserva">
      <header className="nueva-reserva__portada">
        <img src="/img/reservas-el-mirador.jpg" alt="" aria-hidden="true" />
        <div>
          <a className="nueva-reserva__volver" href="#inicio">← Volver a home</a>
          <p>EL MIRADOR GOURMET · MIRAFLORES</p>
          <h1>Tu mesa, frente al mar</h1>
          <span>Un momento especial comienza con una buena mesa.</span>
        </div>
      </header>

      <div className="nueva-reserva__contenido">
        <form className="reserva-formulario" onSubmit={revisarReserva}>
          <div className="reserva-formulario__encabezado">
            <div>
              <span className="reserva-etiqueta">RESERVACIONES</span>
              <h2>Planeemos tu visita</h2>
            </div>
            <span className="reserva-paso">1 — 3</span>
          </div>

          <section className="reserva-seccion">
            <div className="reserva-seccion__titulo">
              <span>01</span>
              <div><h3>Fecha y comensales</h3><p>Elige cuándo vienes y cuántos te acompañan.</p></div>
            </div>
            <div className="reserva-campos reserva-campos--dos">
              <label>
                Fecha de visita
                <input
                  type="date"
                  name="fecha"
                  min={fechaLocal(new Date())}
                  value={fecha}
                  onChange={(event) => {
                    setFecha(event.target.value);
                    setHorario('');
                    setMensaje('');
                  }}
                  required
                />
              </label>
              <label>
                Número de comensales
                <select value={comensales} onChange={(event) => setComensales(event.target.value)}>
                  {Array.from({ length: 12 }, (_, indice) => indice + 1).map((numero) => (
                    <option key={numero} value={numero}>{numero} {numero === 1 ? 'persona' : 'personas'}</option>
                  ))}
                </select>
              </label>
            </div>
          </section>

          <section className="reserva-seccion">
            <div className="reserva-seccion__titulo">
              <span>02</span>
              <div><h3>Elige tu horario</h3><p>Las mesas se reservan por 120 minutos.</p></div>
            </div>
            <div className="reserva-horarios" role="group" aria-label="Horarios disponibles">
              {fecha && horarioDelDia?.enabled && horarios.map((hora) => (
                <button
                  className={horario === hora ? 'is-seleccionado' : ''}
                  type="button"
                  key={hora}
                  aria-pressed={horario === hora}
                  onClick={() => setHorario(hora)}
                >
                  {hora}
                </button>
              ))}
              {!fecha && <span className="reserva-ayuda">Selecciona una fecha para consultar los horarios.</span>}
            </div>
            <div className="reserva-horarios__nota">
              {fecha && horarioDelDia?.enabled && !horario && (
                <span className="reserva-ayuda">Selecciona un horario para continuar.</span>
              )}
              <span className="reserva-tolerancia">Tolerancia de llegada: 15 minutos.</span>
            </div>
            {fecha && horarioDelDia && !horarioDelDia.enabled && (
              <div className="reserva-cerrado" role="status">
                <strong>No es posible reservar para esta fecha.</strong>
                <span>{horarioDelDia.reason || horarioDelDia.closedReason || 'El restaurante permanecerá cerrado.'}</span>
              </div>
            )}
            {fecha && horarioDelDia?.enabled && (
              <p className="reserva-ayuda">
                Atención: {formatBusinessTime(horarioDelDia.opening)}–{formatBusinessTime(horarioDelDia.closing)}.
                {' '}Última reserva: {formatBusinessTime(horarioDelDia.lastReservation)}.
                {horarioDelDia.reason ? ` ${horarioDelDia.reason}` : ''}
              </p>
            )}
          </section>

          <section className="reserva-seccion">
            <div className="reserva-seccion__titulo">
              <span>03</span>
              <div><h3>Escoge tu ambiente</h3><p>Cuéntanos dónde te gustaría disfrutar.</p></div>
            </div>
            <div className="reserva-ambientes">
              {ambientes.map((opcion) => (
                <button
                  className={ambiente === opcion.nombre ? 'is-seleccionado' : ''}
                  type="button"
                  key={opcion.nombre}
                  aria-pressed={ambiente === opcion.nombre}
                  onClick={() => setAmbiente(opcion.nombre)}
                >
                  <span className="reserva-ambientes__icono" aria-hidden="true">{opcion.icono}</span>
                  <strong>{opcion.nombre}</strong>
                  <small>{opcion.detalle}</small>
                </button>
              ))}
            </div>
          </section>

          <section className="reserva-seccion">
            <div className="reserva-seccion__titulo">
              <span>04</span>
              <div><h3>Adelanta tu pedido <em>opcional</em></h3><p>Agrega platos para que todo esté listo a tu llegada.</p></div>
            </div>
            <div className="reserva-menu">
              {menuCategories.map((categoria) => (
                <div className="reserva-menu__categoria" key={categoria.name}>
                  <h4>{categoria.name}</h4>
                  {categoria.dishes.map(([nombre, , precio]) => (
                    <div className="reserva-plato" key={nombre}>
                      <div><strong>{nombre}</strong><span>{precio}</span></div>
                      <div className="reserva-plato__cantidad">
                        <button
                          type="button"
                          aria-label={`Quitar ${nombre}`}
                          onClick={() => cambiarCantidad(nombre, (cantidades[nombre] || 0) - 1)}
                        >−</button>
                        <span>{cantidades[nombre] || 0}</span>
                        <button
                          type="button"
                          aria-label={`Agregar ${nombre}`}
                          onClick={() => cambiarCantidad(nombre, (cantidades[nombre] || 0) + 1)}
                        >+</button>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </section>

          <div className="reserva-envio">
            <p>
              {cliente
                ? `Reserva para ${cliente.nombre}. Usaremos el teléfono y correo asociados a tu cuenta.`
                : 'Inicia sesión o regístrate para solicitar esta reserva.'}
            </p>
            <button type="submit" disabled={!fecha || !horario || !cliente || !horarioDelDia?.enabled}>
              Confirmar pago <span aria-hidden="true">↗</span>
            </button>
            {mensaje && <div className="reserva-envio__mensaje" role="status">{mensaje}</div>}
          </div>
        </form>

        <aside className="reserva-resumen">
          <img src="/img/reservas-el-mirador.jpg" alt="Terraza de El Mirador Gourmet con vista al mar al atardecer" />
          <div className="reserva-resumen__cuerpo">
            <span className="reserva-etiqueta">TU EXPERIENCIA</span>
            <h2>El Mirador Gourmet</h2>
            <p>Malecón Cisneros 1210, Miraflores</p>
            <dl>
              <div><dt>Fecha</dt><dd>{fecha || 'Por elegir'}</dd></div>
              <div><dt>Comensales</dt><dd>{comensales} {comensales === '1' ? 'persona' : 'personas'}</dd></div>
              <div><dt>Horario</dt><dd>{horario || 'Por elegir'}</dd></div>
              <div><dt>Ambiente</dt><dd>{ambiente}</dd></div>
              <div><dt>Tarifa de mesa ({comensales} {comensales === '1' ? 'persona' : 'personas'})</dt><dd>S/ {tarifaAmbiente.toFixed(2)}</dd></div>
            </dl>
            {platosSeleccionados.length > 0 && (
              <div className="reserva-resumen__platos">
                <h3>Tu selección</h3>
                {platosSeleccionados.map((plato) => (
                  <p key={plato.nombre}><span>{plato.cantidad} × {plato.nombre}</span><b>S/ {(plato.cantidad * Number(plato.precio.replace('S/ ', ''))).toFixed(2)}</b></p>
                ))}
              </div>
            )}
            <div className="reserva-resumen__total">
              <strong>Total de la reserva</strong>
              <strong>S/ {totalReserva.toFixed(2)}</strong>
            </div>
            <div className="reserva-resumen__nota">El total incluye la tarifa del ambiente y los platos seleccionados. La reserva se confirma al validar el pago con el restaurante.</div>
          </div>
        </aside>
      </div>
      {checkoutAbierto && (
        <div
          className="checkout-reserva__fondo"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setCheckoutAbierto(false);
          }}
        >
          <section
            className="checkout-reserva"
            role="dialog"
            aria-modal="true"
            aria-labelledby="checkout-reserva-titulo"
          >
            <button
              className="checkout-reserva__cerrar"
              type="button"
              aria-label="Cerrar resumen de pago"
              onClick={() => setCheckoutAbierto(false)}
            >×</button>
            <span className="reserva-etiqueta">RESUMEN DE TU RESERVA</span>
            <h2 id="checkout-reserva-titulo">Revisa y elige cómo pagar</h2>
            <div className="checkout-reserva__detalle">
              <div><span>Cliente</span><strong>{cliente?.nombre}</strong></div>
              <div>
                <span>Fecha y hora</span>
                <strong>
                  {new Date(`${fecha}T12:00:00`).toLocaleDateString('es-PE', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })} · {horario}
                </strong>
              </div>
              <div><span>Comensales y ambiente</span><strong>{comensales} · {ambiente}</strong></div>
              <div><span>Separación de mesa</span><strong>S/ {tarifaAmbiente.toFixed(2)}</strong></div>
              {platosSeleccionados.map((plato) => (
                <div key={plato.nombre}>
                  <span>{plato.cantidad} × {plato.nombre}</span>
                  <strong>
                    S/ {(plato.cantidad * Number(plato.precio.replace('S/ ', ''))).toFixed(2)}
                  </strong>
                </div>
              ))}
              <div className="checkout-reserva__gran-total">
                <span>Total</span><strong>S/ {totalReserva.toFixed(2)}</strong>
              </div>
            </div>

            {solicitudEnviada ? (
              <div className="checkout-pago-exito" role="status">
                <span aria-hidden="true">✓</span>
                <p className="reserva-etiqueta">SOLICITUD RECIBIDA</p>
                <h3>¡Tu reserva fue solicitada!</h3>
                <p>
                  Monto por pagar: <strong>S/ {importePago.toFixed(2)}</strong> con {metodosPago.find((metodo) => metodo.id === metodoPago)?.nombre}.
                  El pago está pendiente de confirmación por el restaurante.
                </p>
                <div><span>Estado de la reserva</span><strong>Pendiente de confirmación</strong></div>
                <button className="checkout-reserva__confirmar" type="button" onClick={() => setCheckoutAbierto(false)}>
                  Volver a mi reserva
                </button>
              </div>
            ) : (
              <form className="checkout-pasarela" onSubmit={registrarSolicitud}>
                <fieldset className="checkout-reserva__opciones">
                  <legend>¿Cuánto deseas pagar?</legend>
                  <label className={modalidadPago === 'adelanto' ? 'is-seleccionado' : ''}>
                    <input
                      type="radio"
                      name="modalidad-pago"
                      value="adelanto"
                      checked={modalidadPago === 'adelanto'}
                      onChange={() => setModalidadPago('adelanto')}
                    />
                    <span>
                      <strong>50% para separar</strong>
                      <small>Saldo de S/ {saldoRestante.toFixed(2)} en el restaurante antes de recibir la mesa.</small>
                    </span>
                    <b>S/ {importePago.toFixed(2)}</b>
                  </label>
                  <label className={modalidadPago === 'total' ? 'is-seleccionado' : ''}>
                    <input
                      type="radio"
                      name="modalidad-pago"
                      value="total"
                      checked={modalidadPago === 'total'}
                      onChange={() => setModalidadPago('total')}
                    />
                    <span>
                      <strong>Pagar el total</strong>
                      <small>Cubre la tarifa de mesa y los platos seleccionados.</small>
                    </span>
                    <b>S/ {totalReserva.toFixed(2)}</b>
                  </label>
                </fieldset>

                <fieldset className="checkout-reserva__metodos">
                  <legend>Medio de pago</legend>
                  <div>
                    {metodosPago.map((metodo) => (
                      <label className={metodoPago === metodo.id ? 'is-seleccionado' : ''} key={metodo.id}>
                        <input
                          type="radio"
                          name="metodo-pago"
                          value={metodo.id}
                          checked={metodoPago === metodo.id}
                          onChange={() => {
                            setMetodoPago(metodo.id);
                            setSolicitudEnviada(false);
                          }}
                          required
                        />
                        <strong>{metodo.nombre}</strong>
                        <small>{metodo.detalle}</small>
                      </label>
                    ))}
                  </div>
                </fieldset>

                {metodoPago === 'tarjeta' && (
                  <fieldset className="checkout-pasarela__campos">
                    <legend>{tarjetasGuardadas.length ? 'Elige una tarjeta' : 'Datos de tarjeta'}</legend>
                    {tarjetasGuardadas.length > 0 && (
                      <div className="checkout-tarjetas-guardadas">
                        {tarjetasGuardadas.map((tarjeta) => (
                          <label
                            className={!tarjetaNueva && tarjetaGuardadaId === tarjeta.id ? 'is-seleccionado' : ''}
                            key={tarjeta.id}
                          >
                            <input
                              type="radio"
                              name="tarjeta-cuenta"
                              checked={!tarjetaNueva && tarjetaGuardadaId === tarjeta.id}
                              onChange={() => {
                                setTarjetaGuardadaId(tarjeta.id);
                                setTarjetaNueva(false);
                              }}
                            />
                            <span className="checkout-tarjetas-guardadas__marca" aria-hidden="true">▰</span>
                            <span className="checkout-tarjetas-guardadas__datos">
                              <strong>•••• {tarjeta.ultimosDigitos}</strong>
                              <small>{tarjeta.titular} · Vence {tarjeta.vencimiento}</small>
                            </span>
                            {!tarjetaNueva && tarjetaGuardadaId === tarjeta.id && (
                              <span className="checkout-tarjetas-guardadas__seleccion">Seleccionada</span>
                            )}
                          </label>
                        ))}
                        <label className={tarjetaNueva ? 'is-seleccionado' : ''}>
                          <input
                            type="radio"
                            name="tarjeta-cuenta"
                            checked={tarjetaNueva}
                            onChange={() => setTarjetaNueva(true)}
                          />
                          <span className="checkout-tarjetas-guardadas__otra-marca" aria-hidden="true">＋</span>
                          <span className="checkout-tarjetas-guardadas__datos">
                            <strong>Usar otra tarjeta</strong>
                            <small>Ingresa los datos de tu tarjeta.</small>
                          </span>
                        </label>
                      </div>
                    )}
                    {tarjetaGuardada && !tarjetaNueva ? (
                      <p>
                        Se usará la tarjeta de {tarjetaGuardada.titular} terminada en {tarjetaGuardada.ultimosDigitos}.
                        No es necesario volver a ingresar sus datos.
                      </p>
                    ) : (
                      <>
                        <label className="checkout-pasarela__ancho">
                          Nombre del titular
                          <input name="titular" autoComplete="off" placeholder="Ej. Andrea Pérez" required />
                        </label>
                        <label className="checkout-pasarela__ancho">
                          Número de tarjeta
                          <input name="tarjeta" inputMode="numeric" autoComplete="off" placeholder="4242 4242 4242 4242" pattern="[0-9 ]{12,23}" required />
                        </label>
                        <label>Vencimiento<input name="vencimiento" autoComplete="off" placeholder="MM/AA" pattern="(0[1-9]|1[0-2])/[0-9]{2}" required /></label>
                        <label>CVV<input name="cvv" inputMode="numeric" autoComplete="off" placeholder="123" pattern="[0-9]{3,4}" required /></label>
                      </>
                    )}
                  </fieldset>
                )}

                {['yape', 'plin', 'sip'].includes(metodoPago) && (
                  <fieldset className="checkout-pasarela__campos">
                    <legend>Pago con {metodosPago.find((metodo) => metodo.id === metodoPago)?.nombre}</legend>
                    <label>
                      Número de celular
                      <input name="celular" type="tel" inputMode="numeric" autoComplete="off" placeholder="999 999 999" pattern="[0-9 +()-]{7,16}" required />
                    </label>
                  </fieldset>
                )}

                {metodoPago === 'transferencia' && (
                  <fieldset className="checkout-pasarela__campos">
                    <legend>Transferencia bancaria</legend>
                    <label>
                      Código de operación
                      <input name="operacion" autoComplete="off" placeholder="Ej. 123456789" minLength={6} required />
                    </label>
                  </fieldset>
                )}

                {metodoPago === 'efectivo' && (
                 <div className="checkout-pasarela__efectivo">
                   Pagarás <strong>S/ {importePago.toFixed(2)}</strong> en el restaurante antes de recibir la mesa.
                 </div>
                )}

                <button className="checkout-reserva__confirmar" type="submit" disabled={!metodoPago}>
                 Total a pagar: S/ {importePago.toFixed(2)}
                </button>
              </form>
            )}
          </section>
        </div>
      )}
    </section>
  );
}
