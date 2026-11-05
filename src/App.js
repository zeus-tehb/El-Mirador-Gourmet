import { useEffect, useState } from 'react';
import Navegacion from './Navegacion';
import Home from './Components/Home';
import Nosotros from './Components/Nosotros';
import Carta from './Components/Carta';
import Reservas from './Components/Reservas';
import NuevaReserva from './Components/NuevaReserva';
import Contacto from './Components/Contacto';
import Login from './Components/Login';
import Footer from './Components/Footer';
import Admin from './Components/Admin';
import CuentaCliente from './Components/CuentaCliente';
import './App.css';

function App() {
  const [paginaReserva, setPaginaReserva] = useState(() => window.location.hash === '#reservar');
  const [avisoRegistroAbierto, setAvisoRegistroAbierto] = useState(
    () => window.location.hash === '#reservar',
  );
  const [loginAbierto, setLoginAbierto] = useState(false);
  const [vistaLogin, setVistaLogin] = useState('login');
  const [administracionAbierta, setAdministracionAbierta] = useState(false);
  const [cliente, setCliente] = useState(null);
  const [seccionCuenta, setSeccionCuenta] = useState(null);
  const [clientesRegistrados, setClientesRegistrados] = useState([]);

  useEffect(() => {
    function sincronizarPagina() {
      const reservaAbierta = window.location.hash === '#reservar';
      setPaginaReserva(reservaAbierta);
      if (!reservaAbierta) {
        window.requestAnimationFrame(() => {
          document.getElementById(window.location.hash.slice(1))?.scrollIntoView();
        });
      }
    }

    window.addEventListener('hashchange', sincronizarPagina);
    return () => window.removeEventListener('hashchange', sincronizarPagina);
  }, [cliente]);

  function abrirReservas() {
    window.location.hash = '#reservar';
    setPaginaReserva(true);
    setAvisoRegistroAbierto(!cliente);
    window.scrollTo(0, 0);
  }

  function abrirAcceso(vista = 'login') {
    setVistaLogin(vista);
    setAvisoRegistroAbierto(false);
    setLoginAbierto(true);
  }

  function cerrarAcceso() {
    setLoginAbierto(false);
    if (window.location.hash === '#reservar' && !cliente) {
      setAvisoRegistroAbierto(true);
    }
  }

  function iniciarSesion({ tipo, ...datosCliente }) {
    setLoginAbierto(false);
    setAvisoRegistroAbierto(false);
    if (tipo === 'admin') {
      setAdministracionAbierta(true);
      setCliente(null);
      return;
    }

    setCliente(datosCliente);
    if (window.location.hash === '#reservar') {
      setPaginaReserva(true);
    } else if (window.location.hash === '#inicio') {
      document.getElementById('inicio')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.location.hash = '#inicio';
    }
  }

  function registrarCliente(datosCliente) {
    const { clave, ...perfilCliente } = datosCliente;
    setClientesRegistrados((clientes) => [...clientes, { ...perfilCliente, clave }]);
    iniciarSesion({ tipo: 'cliente', ...perfilCliente });
  }

  function actualizarCliente(datosCliente) {
    setCliente(datosCliente);
    if (datosCliente.id) {
      setClientesRegistrados((clientes) => clientes.map((registrado) => (
        registrado.id === datosCliente.id
          ? { ...datosCliente, clave: registrado.clave }
          : registrado
      )));
    }
  }

  if (administracionAbierta) {
    return (
      <Admin
        onExit={() => {
          setAdministracionAbierta(false);
          setCliente(null);
        }}
      />
    );
  }

  return (
    <>
      <Navegacion
        cliente={cliente}
        onLoginClick={() => abrirAcceso()}
        onLogout={() => {
          setCliente(null);
          if (paginaReserva) setAvisoRegistroAbierto(true);
        }}
        onAccountOpen={setSeccionCuenta}
      />
      <main>
        {paginaReserva ? (
          <NuevaReserva cliente={cliente} />
        ) : (
          <>
            <Home />
            <Nosotros />
            <Carta />
            <Reservas onAbrirReserva={abrirReservas} />
            <Contacto />
          </>
        )}
      </main>
      <Footer />
      {cliente && seccionCuenta && (
        <CuentaCliente
          cliente={cliente}
          initialSection={seccionCuenta}
          onUpdate={actualizarCliente}
          onClose={() => setSeccionCuenta(null)}
          onLogout={() => {
            setSeccionCuenta(null);
            setCliente(null);
          }}
        />
      )}
      {loginAbierto && (
        <Login
          initialView={vistaLogin}
          onClose={cerrarAcceso}
          onSubmit={iniciarSesion}
          onRegister={registrarCliente}
          clientesRegistrados={clientesRegistrados}
        />
      )}
      {avisoRegistroAbierto && paginaReserva && !cliente && !loginAbierto && (
        <div className="reserva-acceso__fondo">
          <section
            className="reserva-acceso"
            role="dialog"
            aria-modal="true"
            aria-labelledby="reserva-acceso-titulo"
          >
            <button
              className="reserva-acceso__cerrar"
              type="button"
              aria-label="Cerrar aviso"
              onClick={() => {
                setAvisoRegistroAbierto(false);
                window.location.hash = '#reservas';
              }}
            >
              ×
            </button>
            <span className="reserva-acceso__icono" aria-hidden="true">♙</span>
            <p className="reserva-etiqueta">RESERVA TU EXPERIENCIA</p>
            <h2 id="reserva-acceso-titulo">Un paso más antes de reservar</h2>
            <p>Para solicitar una reserva, inicia sesión en tu cuenta de cliente o regístrate. Usaremos los datos de tu perfil para coordinarla.</p>
            <button className="reserva-acceso__principal" type="button" onClick={() => abrirAcceso('registro')}>
              Crear mi cuenta
            </button>
            <button className="reserva-acceso__secundario" type="button" onClick={() => abrirAcceso('login')}>
              Ya tengo cuenta · Iniciar sesión
            </button>
          </section>
        </div>
      )}
    </>
  );
}

export default App;
