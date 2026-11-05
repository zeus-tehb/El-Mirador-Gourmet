export default function Home() {
  return (
    <section className="portada" id="inicio" aria-labelledby="titulo-portada">
      <img className="portada__fondo" src="/img/portada-el-mirador.jpg" alt="" aria-hidden="true" />
      <div className="portada__contenido">
        <p>Bienvenidos a</p>
        <h1 id="titulo-portada">
          El Mirador
          <br />
          Gourmet
        </h1>
        <span>Alta cocina</span>
      </div>
    </section>
  );
}
