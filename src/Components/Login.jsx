import { useState } from 'react';

const clienteDemo = {
  nombre: 'Andrea Fernández',
  dni: '74839210',
  correo: 'andrea.f@email.com',
  telefono: '+51 962 491 696',
  tarjetas: [],
  preferencias: { correo: true, novedades: false },
};

export default function Login({ onClose, onSubmit, onRegister, clientesRegistrados, initialView = 'login' }) {
  const [vista, setVista] = useState(initialView);
  const [usuario, setUsuario] = useState('');
  const [clave, setClave] = useState('');
  const [nombre, setNombre] = useState('');
  const [dni, setDni] = useState('');
  const [telefono, setTelefono] = useState('');
  const [correo, setCorreo] = useState('');
  const [confirmarClave, setConfirmarClave] = useState('');
  const [aceptaTerminos, setAceptaTerminos] = useState(false);
  const [error, setError] = useState('');

  function iniciarSesion(event) {
    event.preventDefault();
    const usuarioNormalizado = usuario.trim().toLocaleLowerCase();

    if (usuarioNormalizado === 'admin@elmirador' && clave === '1234@admin') {
      setError('');
      onSubmit({ tipo: 'admin' });
      return;
    }

    if (usuarioNormalizado === 'cliente@elmirador.com' && clave === 'cliente123') {
      setError('');
      onSubmit({ tipo: 'cliente', ...clienteDemo });
      return;
    }

    const clienteRegistrado = clientesRegistrados.find((cliente) => (
      cliente.correo.toLocaleLowerCase() === usuarioNormalizado
      && cliente.clave === clave
    ));
    if (clienteRegistrado) {
      const datosCliente = { ...clienteRegistrado };
      delete datosCliente.clave;
      setError('');
      onSubmit({ tipo: 'cliente', ...datosCliente });
      return;
    }

    setError('Usuario o contraseña incorrectos.');
  }

  function registrarCliente(event) {
    event.preventDefault();
    const correoNormalizado = correo.trim().toLocaleLowerCase();

    if (clave.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.');
      return;
    }
    if (clave !== confirmarClave) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    if (!aceptaTerminos) {
      setError('Debes aceptar los términos y condiciones para continuar.');
      return;
    }
    if (
      correoNormalizado === 'cliente@elmirador.com'
      || correoNormalizado === 'admin@elmirador'
      || clientesRegistrados.some((cliente) => cliente.correo.toLocaleLowerCase() === correoNormalizado)
    ) {
      setError('Ya existe una cuenta con ese correo electrónico.');
      return;
    }

    setError('');
    onRegister({
      id: `${Date.now()}`,
      nombre: nombre.trim(),
      dni: dni.trim(),
      telefono: telefono.trim(),
      correo: correoNormalizado,
      clave,
      tarjetas: [],
      preferencias: { correo: true, novedades: false },
    });
  }

  function cambiarVista(nuevaVista) {
    setVista(nuevaVista);
    setError('');
    setClave('');
    setConfirmarClave('');
  }

  return (
    <div className="login__fondo" onMouseDown={onClose}>
      <section
        className="login"
        id="login"
        role="dialog"
        aria-modal="true"
        aria-labelledby="login-titulo"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="login__barra">
          <img className="login__marca-mini" src={`${process.env.PUBLIC_URL}/img/logo-el-mirador.jpg`} alt="El Mirador Gourmet" />
          <button className="login__home" type="button" onClick={onClose}>HOME</button>
        </header>
        <div className={`login__contenido${vista === 'registro' ? ' login__contenido--registro' : ' login__contenido--acceso'}`}>
          <img className="login__emblema" src={`${process.env.PUBLIC_URL}/img/logo-el-mirador.jpg`} alt="" />
          {vista === 'registro' && <p className="login__sobrelinea">EL MIRADOR GOURMET</p>}
          <h2 id="login-titulo">
            {vista === 'login' ? (
              <>EL MIRADOR<br />GOURMET</>
            ) : 'Crea tu cuenta'}
          </h2>
          {vista === 'registro' && (
            <p className="login__descripcion">Regístrate para disfrutar de El Mirador Gourmet</p>
          )}
          {vista === 'login' ? (
            <>
              <form className="login__formulario" onSubmit={iniciarSesion}>
                <label className="login__etiqueta" htmlFor="login-usuario">Usuario o correo electrónico</label>
                <input
                  id="login-usuario"
                  type="text"
                  autoComplete="username"
                  placeholder="Usuario o correo electrónico"
                  value={usuario}
                  onChange={(event) => setUsuario(event.target.value)}
                  required
                />
                <label className="login__etiqueta" htmlFor="login-clave">Contraseña</label>
                <input
                  id="login-clave"
                  type="password"
                  autoComplete="current-password"
                  placeholder="Contraseña"
                  value={clave}
                  onChange={(event) => setClave(event.target.value)}
                  required
                />
                {error && <p className="login__error" role="alert">{error}</p>}
                <button className="login__submit" type="submit">INGRESAR</button>
              </form>
              <button className="login__cambiar-vista" type="button" onClick={() => cambiarVista('registro')}>
                ¿Aún no tienes cuenta? <strong>Regístrate</strong>
              </button>
              <div className="login__divider"><span>o</span></div>
              <div className="login__social" aria-label="Accesos externos no configurados">
                <span className="login__social-icon login__social-icon--gmail" role="img" aria-label="Gmail">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M3 19V5l9 7 9-7v14" />
                    <path d="M3 5l9 7 9-7" />
                  </svg>
                </span>
                <span className="login__social-icon login__social-icon--facebook" role="img" aria-label="Facebook">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path className="login__facebook-bg" d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Z" />
                    <path className="login__facebook-letter" d="M13.5 19v-6h2l.3-2.4h-2.3V9.1c0-.7.2-1.1 1.2-1.1H16V5.8c-.3 0-1.1-.1-2-.1-2 0-3.3 1.2-3.3 3.4v1.5H8.5V13h2.2v6h2.8Z" />
                  </svg>
                </span>
              </div>
            </>
          ) : (
            <>
              <form className="login__formulario login__formulario--registro" onSubmit={registrarCliente}>
                <label htmlFor="registro-nombre">Nombre completo
                  <input id="registro-nombre" autoComplete="name" placeholder="Ingresa tu nombre completo" value={nombre} onChange={(event) => setNombre(event.target.value)} required />
                </label>
                <label htmlFor="registro-dni">Documento de identidad
                  <input id="registro-dni" autoComplete="off" placeholder="DNI" value={dni} onChange={(event) => setDni(event.target.value)} required />
                </label>
                <label htmlFor="registro-telefono">Número de teléfono
                  <input id="registro-telefono" type="tel" autoComplete="tel" placeholder="+51 987 654 321" value={telefono} onChange={(event) => setTelefono(event.target.value)} required />
                </label>
                <label htmlFor="registro-correo">Correo electrónico
                  <input id="registro-correo" type="email" autoComplete="email" placeholder="tucorreo@ejemplo.com" value={correo} onChange={(event) => setCorreo(event.target.value)} required />
                </label>
                <label htmlFor="registro-clave">Contraseña
                  <input id="registro-clave" type="password" autoComplete="new-password" placeholder="Mínimo 8 caracteres" value={clave} onChange={(event) => setClave(event.target.value)} minLength={8} required />
                </label>
                <label htmlFor="registro-confirmar-clave">Confirmar contraseña
                  <input id="registro-confirmar-clave" type="password" autoComplete="new-password" placeholder="Confirma tu contraseña" value={confirmarClave} onChange={(event) => setConfirmarClave(event.target.value)} minLength={8} required />
                </label>
                <label className="login__terminos" htmlFor="registro-terminos">
                  <input id="registro-terminos" type="checkbox" checked={aceptaTerminos} onChange={(event) => setAceptaTerminos(event.target.checked)} />
                  <span>Acepto los términos y condiciones y la política de privacidad.</span>
                </label>
                {error && <p className="login__error" role="alert">{error}</p>}
                <button className="login__submit" type="submit">CREAR CUENTA</button>
              </form>
              <button className="login__cambiar-vista" type="button" onClick={() => cambiarVista('login')}>
                ¿Ya tienes una cuenta? <strong>Ingresar</strong>
              </button>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
