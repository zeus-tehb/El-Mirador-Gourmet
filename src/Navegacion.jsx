import { useState } from 'react';

const enlaces = [
  { texto: 'Home', destino: '#inicio' },
  { texto: 'Reservas', destino: '#reservas' },
  { texto: 'Carta', destino: '#carta' },
  { texto: 'Nosotros', destino: '#nosotros' },
  { texto: 'Contáctanos', destino: '#contacto' },
];

function Logo() {
  return (
    <a className="logo" href="#inicio" aria-label="El Mirador Gourmet, inicio">
      <img src="/img/logo-el-mirador.jpg" alt="" />
    </a>
  );
}

export default function Navegacion({ cliente, onLoginClick, onLogout, onAccountOpen }) {
  const [menuAbierto, setMenuAbierto] = useState(false);

  function cerrarMenu() {
    setMenuAbierto(false);
  }

  function abrirCuenta(seccion) {
    cerrarMenu();
    onAccountOpen(seccion);
  }

  function cerrarSesion() {
    cerrarMenu();
    onLogout();
  }

  return (
    <header className="barra-navegacion">
      <nav className="navegacion" aria-label="Navegación principal">
        <Logo />
        <button
          className="boton-menu"
          type="button"
          aria-label={menuAbierto ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={menuAbierto}
          aria-controls="enlaces-principales"
          onClick={() => setMenuAbierto(!menuAbierto)}
        >
          <span />
          <span />
          <span />
        </button>
        <ul
          className={`enlaces-navegacion${menuAbierto ? ' enlaces-navegacion--abiertos' : ''}`}
          id="enlaces-principales"
        >
          {enlaces.map(({ texto, destino }) => (
            <li key={destino}>
              <a href={destino} onClick={cerrarMenu}>
                {texto}
              </a>
            </li>
          ))}
          {cliente ? (
            <li className="navegacion__sesion">
              <button
                className="perfil-trigger"
                type="button"
                aria-label={`Abrir menú de ${cliente.nombre}`}
                aria-expanded={menuAbierto}
                aria-controls="menu-perfil"
                onClick={() => setMenuAbierto(!menuAbierto)}
              >
                <span className="perfil-trigger__iniciales" aria-hidden="true">
                  {cliente.nombre.split(' ').map((parte) => parte[0]).slice(0, 2).join('')}
                </span>
                <span className="sesion-usuario">{cliente.nombre}</span>
              </button>
              {menuAbierto && (
                <section className="menu-perfil" id="menu-perfil" aria-label="Menú de cuenta">
                  <header className="menu-perfil__cabecera">
                    <span className="perfil-trigger__iniciales" aria-hidden="true">
                      {cliente.nombre.split(' ').map((parte) => parte[0]).slice(0, 2).join('')}
                    </span>
                    <div>
                      <strong>{cliente.nombre}</strong>
                      <span>{cliente.correo}</span>
                    </div>
                  </header>
                  <div className="menu-perfil__opciones">
                    <button type="button" onClick={() => abrirCuenta('datos')}>
                      <span aria-hidden="true">♙</span>Datos personales
                    </button>
                    <button type="button" onClick={() => abrirCuenta('pagos')}>
                      <span aria-hidden="true">▤</span>Métodos de pago
                    </button>
                    <button type="button" onClick={() => abrirCuenta('reservas')}>
                      <span aria-hidden="true">▦</span>Historial de reservas
                    </button>
                    <button type="button" onClick={() => abrirCuenta('configuracion')}>
                      <span aria-hidden="true">⚙</span>Configuración
                    </button>
                    <button type="button" onClick={cerrarSesion}>
                      <span aria-hidden="true">↪</span>Cerrar sesión
                    </button>
                  </div>
                </section>
              )}
            </li>
          ) : (
            <li>
              <button
                className="enlace-login"
                type="button"
                onClick={() => {
                  cerrarMenu();
                  onLoginClick();
                }}
              >
                Login
              </button>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
}
