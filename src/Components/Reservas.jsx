export default function Reservas({ onAbrirReserva }) {
  return (
    <section className="reservas" id="reservas">
      <h2>Reservas</h2>
      <div className="reservas__contenido">
        <div className="reservas__politicas">
          <h3>Reservas y políticas del restaurante</h3>
          <ul>
            <li>
              <strong>Reservas y consultas:</strong> Si no encuentras disponibilidad en el
              sistema web, puedes escribirnos por WhatsApp al +51 962-491-696 o llamarnos para
              verificar mesas disponibles.
            </li>
            <li>
              <strong>Tolerancia y tiempo:</strong> Contamos con una tolerancia máxima de 15
              minutos. El tiempo asignado por mesa es de 120 minutos desde la hora reservada.
            </li>
            <li>
              <strong>Grupos grandes:</strong> Para reservas de más de 6 personas, la mesa será
              asignada cuando esté presente al menos el 70% de los invitados.
            </li>
            <li>
              <strong>Restricciones de ingreso:</strong> No está permitido el ingreso de
              mascotas, alimentos externos, decoraciones ni música particular.
            </li>
            <li>
              <strong>Política de descorche:</strong> Permitido únicamente para vino, espumante,
              cava o champagne (hasta 750 ml) a S/ 60.00 por botella.
            </li>
          </ul>
        </div>
        <div className="reservas__imagen-contenedor">
          <div className="reservas__imagen-enlace">
            <img
              className="reservas__imagen"
              src={`${process.env.PUBLIC_URL}/img/reservas-el-mirador.jpg`}
              alt="Mesa preparada en la terraza del restaurante, rodeada de jardines y flores"
            />
          </div>
          <button className="boton" type="button" onClick={onAbrirReserva}>
            Reservar ahora
          </button>
        </div>
      </div>
    </section>
  );
}
