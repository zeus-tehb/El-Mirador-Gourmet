import { formatBusinessTime, useBusinessHours, weekdayNames } from '../businessHours';

function describirHorario(schedule) {
  if (!schedule.enabled) {
    return `Cerrado${schedule.closedReason ? `: ${schedule.closedReason}.` : '.'}`;
  }

  return `${formatBusinessTime(schedule.opening)} a ${formatBusinessTime(schedule.closing)} (última reserva ${formatBusinessTime(schedule.lastReservation)}).`;
}

function agruparHorarios(weekly) {
  const days = [1, 2, 3, 4, 5, 6];
  const groups = [];

  days.forEach((day) => {
    const schedule = weekly[day];
    const signature = `${schedule.enabled}|${schedule.opening}|${schedule.closing}|${schedule.lastReservation}|${schedule.closedReason || ''}`;
    const lastGroup = groups[groups.length - 1];
    if (lastGroup && lastGroup.signature === signature) {
      lastGroup.days.push(day);
    } else {
      groups.push({ signature, schedule, days: [day] });
    }
  });

  const sunday = weekly[0];
  groups.push({
    signature: `0|${sunday.enabled}|${sunday.opening}|${sunday.closing}|${sunday.lastReservation}|${sunday.closedReason || ''}`,
    schedule: sunday,
    days: [0],
  });

  return groups.map(({ schedule, days: groupedDays }) => {
    const first = weekdayNames[groupedDays[0]];
    const last = weekdayNames[groupedDays[groupedDays.length - 1]];
    const label = groupedDays.length > 1 ? `${first} a ${last.toLowerCase()}` : first;
    return { label, schedule };
  });
}

export default function Contacto() {
  const businessHours = useBusinessHours();

  return (
    <section className="contacto" id="contacto">
      <h2>Contáctanos</h2>
      <div className="contacto__contenido">
        <div className="contacto__datos">
          <p>
            Estamos ubicados frente al mar con una vista panorámica privilegiada y acceso libre
            mediante reserva previa.
          </p>
          <p>Si tienes preguntas o comentarios, no dudes en comunicarte con nosotros.</p>
          <p>
            <strong>Dirección:</strong> Malecón Cisneros 1210 (frente al parque y con vista
            directa al mar), Miraflores, Lima, Perú.
          </p>
          <p>
            <strong>Teléfono y WhatsApp:</strong>{' '}
            <a href="tel:+51962491696">(+51-1) 461-1312. Ext. 2 | WhatsApp: (+51) 962-491-696</a>
          </p>
          <p>
            <strong>Correo electrónico:</strong>{' '}
            <a href="mailto:contacto@elmiradorgourmet.com">contacto@elmiradorgourmet.com</a>
          </p>
          <p>
            <strong>Redes sociales:</strong>
            <br />
            Facebook: /ElMiradorGourmet
            <br />
            Instagram: @ElMiradorGourmet
          </p>
        </div>
        <div className="horario">
          <h3>Horario de atención</h3>
          <ul className="horario__lista">
            {agruparHorarios(businessHours.weekly).map(({ label, schedule }) => (
              <li key={label}>
                <strong>{label}:</strong> {describirHorario(schedule)}
              </li>
            ))}
            <li>
              <strong>Horario festivo (24, 25 y 31 de diciembre y 1 de enero):</strong>{' '}
              12:00 pm a 6:00 pm (última reserva 4:00 pm).
            </li>
          </ul>
          <p className="horario__nota">Abrimos todos los días, incluidos feriados. Horario sujeto a modificación.</p>
        </div>
      </div>
      <a
        className="mapa"
        href="https://maps.google.com/?q=Malec%C3%B3n+Cisneros+1210+Miraflores+Lima"
        target="_blank"
        rel="noreferrer"
        aria-label="Abrir ubicación de El Mirador Gourmet en Google Maps"
      >
        <span>Abrir en maps</span>
        <span className="mapa__marcador">mapa</span>
      </a>
    </section>
  );
}
