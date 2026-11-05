import { useState } from 'react';
import {
  createDefaultBusinessHours,
  formatBusinessTime,
  bookingEnvironments,
  partySizeTiers,
  readBusinessHours,
  saveBusinessHours,
  weekdayNames,
} from '../businessHours';
import { PageHeading } from './AdminComun';

const hoy = new Date();
const fechaMinima = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}-${String(hoy.getDate()).padStart(2, '0')}`;

function horaValida(day) {
  return day.opening < day.lastReservation && day.lastReservation < day.closing;
}

export default function AdminHorarios({ notify }) {
  const [settings, setSettings] = useState(readBusinessHours);
  const [fecha, setFecha] = useState('');
  const [tipo, setTipo] = useState('horario');
  const [motivo, setMotivo] = useState('');
  const [horarioEspecial, setHorarioEspecial] = useState({
    opening: '12:00',
    closing: '18:00',
    lastReservation: '16:00',
  });
  const [error, setError] = useState('');

  function guardar(nextSettings, successMessage) {
    try {
      saveBusinessHours(nextSettings);
      setSettings(nextSettings);
      setError('');
      notify(successMessage);
      return true;
    } catch (saveError) {
      console.error('No se pudo guardar la configuración de horarios.', saveError);
      setError('No se pudo guardar. Revisa el almacenamiento del navegador e inténtalo otra vez.');
      return false;
    }
  }

  function actualizarDia(day, campo, valor) {
    setSettings((current) => ({
      ...current,
      weekly: {
        ...current.weekly,
        [day]: { ...current.weekly[day], [campo]: valor },
      },
    }));
  }

  function actualizarTarifa(ambiente, indice, valor) {
    setSettings((current) => ({
      ...current,
      pricing: {
        ...current.pricing,
        [ambiente]: current.pricing[ambiente].map((price, priceIndex) => (
          priceIndex === indice ? valor : price
        )),
      },
    }));
  }

  function guardarTarifas(event) {
    event.preventDefault();
    const invalidPrice = bookingEnvironments.some((environment) => (
      settings.pricing[environment].some((price) => !Number.isFinite(Number(price)) || Number(price) < 0)
    ));
    if (invalidPrice) {
      setError('Las tarifas deben ser números iguales o mayores a cero.');
      return;
    }
    guardar(
      { ...readBusinessHours(), pricing: settings.pricing },
      'Tarifas de reserva actualizadas.',
    );
  }

  function guardarHorarioSemanal(event) {
    event.preventDefault();
    const invalidDay = weekdayNames.find((_, day) => (
      settings.weekly[day].enabled && !horaValida(settings.weekly[day])
    ));
    if (invalidDay) {
      setError(`En ${invalidDay}, la última reserva debe ser posterior a la apertura y anterior al cierre.`);
      return;
    }
    guardar(
      { ...readBusinessHours(), weekly: settings.weekly },
      'Horarios habituales actualizados.',
    );
  }

  function agregarExcepcion(event) {
    event.preventDefault();
    if (!fecha) {
      setError('Selecciona la fecha especial.');
      return;
    }
    if (settings.exceptions.some((exception) => exception.date === fecha)) {
      setError('Ya existe una configuración para esa fecha. Elimínala primero para reemplazarla.');
      return;
    }
    if (tipo === 'cerrado' && !motivo.trim()) {
      setError('Indica el motivo del cierre para informar a los clientes.');
      return;
    }
    if (tipo === 'horario' && !horaValida(horarioEspecial)) {
      setError('La última reserva debe ser posterior a la apertura y anterior al cierre.');
      return;
    }

    const exception = tipo === 'cerrado'
      ? { date: fecha, closed: true, reason: motivo.trim() }
      : { date: fecha, closed: false, reason: motivo.trim(), ...horarioEspecial };
    const saved = guardar(
      { ...readBusinessHours(), exceptions: [...settings.exceptions, exception].sort((a, b) => a.date.localeCompare(b.date)) },
      tipo === 'cerrado' ? 'Cierre especial agregado.' : 'Horario especial agregado.',
    );
    if (saved) {
      setFecha('');
      setMotivo('');
    }
  }

  function eliminarExcepcion(date) {
    guardar(
      { ...readBusinessHours(), exceptions: settings.exceptions.filter((exception) => exception.date !== date) },
      'Excepción eliminada.',
    );
  }

  function restablecerHorarios() {
    guardar(
      { ...readBusinessHours(), weekly: createDefaultBusinessHours().weekly },
      'Se restablecieron los horarios habituales.',
    );
  }

  return (
    <div className="admin-content admin-hours">
      <PageHeading
        title="Horarios y cierres"
        subtitle="Define los horarios habituales y las excepciones que verán tus clientes al reservar."
      />
      {error && <p className="admin-hours__error" role="alert">{error}</p>}

      <form className="admin-card admin-hours__weekly" onSubmit={guardarHorarioSemanal}>
        <div className="admin-card-heading">
          <div><span className="admin-eyebrow">HORARIO HABITUAL</span><h2>Atención por día</h2></div>
          <button className="admin-button" type="button" onClick={restablecerHorarios}>Restablecer horarios iniciales</button>
        </div>
        <p className="admin-hours__help">La última reserva debe ser antes del cierre. Los clientes solo verán horarios disponibles hasta esa hora.</p>
        <div className="admin-hours__days">
          {weekdayNames.map((name, day) => {
            const schedule = settings.weekly[day];
            return (
              <div className={`admin-hours__day${schedule.enabled ? '' : ' is-closed'}`} key={day}>
                <label className="admin-hours__day-name">
                  <input
                    type="checkbox"
                    checked={schedule.enabled}
                    onChange={(event) => actualizarDia(day, 'enabled', event.target.checked)}
                  />
                  <strong>{name}</strong>
                </label>
                {schedule.enabled ? (
                  <div className="admin-hours__time-fields">
                    <label>Apertura<input type="time" value={schedule.opening} onChange={(event) => actualizarDia(day, 'opening', event.target.value)} required /></label>
                    <label>Última reserva<input type="time" value={schedule.lastReservation} onChange={(event) => actualizarDia(day, 'lastReservation', event.target.value)} required /></label>
                    <label>Cierre<input type="time" value={schedule.closing} onChange={(event) => actualizarDia(day, 'closing', event.target.value)} required /></label>
                  </div>
                ) : (
                  <label className="admin-hours__closed-reason">Aviso de cierre
                    <input
                      type="text"
                      value={schedule.closedReason || ''}
                      placeholder="Ej. Cerrado por mantenimiento"
                      onChange={(event) => actualizarDia(day, 'closedReason', event.target.value)}
                    />
                  </label>
                )}
              </div>
            );
          })}
        </div>
        <div className="admin-hours__actions"><button className="admin-button admin-button--primary" type="submit">Guardar horario habitual</button></div>
      </form>

      <form className="admin-card admin-hours__pricing" onSubmit={guardarTarifas}>
        <div className="admin-card-heading">
          <div><span className="admin-eyebrow">TARIFA REFERENCIAL POR MESA</span><h2>Precios por ambiente y cantidad de personas</h2></div>
        </div>
        <p className="admin-hours__help">
          Estas tarifas de ejemplo se pueden ajustar antes de publicar. Se agrega al total de los platos seleccionados y el cliente puede pagar el 50% o el total.
        </p>
        <div className="admin-hours__pricing-table">
          <div className="admin-hours__pricing-row admin-hours__pricing-row--header">
            <strong>Ambiente</strong>
            {partySizeTiers.map((tier) => <span key={tier.label}>{tier.label}</span>)}
          </div>
          {bookingEnvironments.map((environment) => (
            <div className="admin-hours__pricing-row" key={environment}>
              <strong>{environment}</strong>
              {settings.pricing[environment].map((price, index) => (
                <label key={partySizeTiers[index].label}>
                  <span className="admin-hours__mobile-tier">{partySizeTiers[index].label}</span>
                  <span>S/</span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    aria-label={`${environment}, ${partySizeTiers[index].label}`}
                    value={price}
                    onChange={(event) => actualizarTarifa(environment, index, event.target.value)}
                    required
                  />
                </label>
              ))}
            </div>
          ))}
        </div>
        <div className="admin-hours__actions"><button className="admin-button admin-button--primary" type="submit">Guardar tarifas</button></div>
      </form>

      <section className="admin-card admin-hours__exceptions">
        <div className="admin-card-heading">
          <div><span className="admin-eyebrow">FECHAS ESPECIALES</span><h2>Feriados, eventos y mantenimiento</h2></div>
        </div>
        <p className="admin-hours__help">Agrega una fecha con horario especial o marca el restaurante como cerrado. Ese día no se podrán solicitar reservas si está cerrado.</p>
        <form className="admin-hours__exception-form" onSubmit={agregarExcepcion}>
          <label>Fecha<input type="date" min={fechaMinima} value={fecha} onChange={(event) => setFecha(event.target.value)} required /></label>
          <label>Disponibilidad
            <select value={tipo} onChange={(event) => { setTipo(event.target.value); setError(''); }}>
              <option value="horario">Horario especial</option>
              <option value="cerrado">Cerrado todo el día</option>
            </select>
          </label>
          {tipo === 'horario' ? (
            <div className="admin-hours__exception-times">
              <label>Apertura<input type="time" value={horarioEspecial.opening} onChange={(event) => setHorarioEspecial({ ...horarioEspecial, opening: event.target.value })} required /></label>
              <label>Última reserva<input type="time" value={horarioEspecial.lastReservation} onChange={(event) => setHorarioEspecial({ ...horarioEspecial, lastReservation: event.target.value })} required /></label>
              <label>Cierre<input type="time" value={horarioEspecial.closing} onChange={(event) => setHorarioEspecial({ ...horarioEspecial, closing: event.target.value })} required /></label>
            </div>
          ) : (
            <label className="admin-hours__reason">Motivo del cierre
              <input value={motivo} onChange={(event) => setMotivo(event.target.value)} placeholder="Fiesta privada, mantenimiento..." required />
            </label>
          )}
          {tipo === 'horario' && <label className="admin-hours__reason">Motivo o detalle (opcional)
            <input value={motivo} onChange={(event) => setMotivo(event.target.value)} placeholder="Ej. Horario por feriado" />
          </label>}
          <div className="admin-hours__actions"><button className="admin-button admin-button--primary" type="submit">Agregar fecha especial</button></div>
        </form>

        <div className="admin-hours__exception-list">
          {settings.exceptions.length ? settings.exceptions.map((exception) => (
            <article key={exception.date}>
              <div>
                <strong>{new Date(`${exception.date}T12:00:00`).toLocaleDateString('es-PE', { day: 'numeric', month: 'long', year: 'numeric' })}</strong>
                <span>{exception.closed
                  ? `Cerrado${exception.reason ? ` · ${exception.reason}` : ''}`
                  : `${formatBusinessTime(exception.opening)}–${formatBusinessTime(exception.closing)} · Última reserva ${formatBusinessTime(exception.lastReservation)}${exception.reason ? ` · ${exception.reason}` : ''}`}</span>
              </div>
              <button className="admin-button" type="button" onClick={() => eliminarExcepcion(exception.date)}>Eliminar</button>
            </article>
          )) : <p className="admin-hours__empty">Todavía no hay fechas especiales ni cierres registrados.</p>}
        </div>
      </section>
    </div>
  );
}
