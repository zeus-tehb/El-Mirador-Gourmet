const categorias = [
  {
    nombre: 'Entradas',
    imagen: 'carta-entradas.jpg',
    pdf: 'https://drive.google.com/file/d/12-jRgqKcWs43Ggwnsv_h-eEVPqdTwW7M/view',
  },
  {
    nombre: 'Sandwiches',
    imagen: 'carta-sandwiches.jpg',
    pdf: 'https://drive.google.com/file/d/1_IovQX4IfkwsgVUQaAFE9LVTxnBwG6qK/view',
  },
  {
    nombre: 'Platos de fondo',
    imagen: 'carta-fondos.jpg',
    pdf: 'https://drive.google.com/file/d/13IEoxPO2ZepBm-Tojlh-nrctuwgUP3as/view',
  },
  {
    nombre: 'Postres',
    imagen: 'carta-postres.jpg',
    pdf: 'https://drive.google.com/file/d/1_MVrSb6enDuIRi3-mz_GljDWCkgVRuJR/view',
  },
  {
    nombre: 'Bebidas',
    imagen: 'carta-bebidas.jpg',
    pdf: 'https://drive.google.com/file/d/1P3Mk1BIk6UBEsPMLVc_TIh2-CB4eAIaM/view',
  },
];

export default function Carta() {
  return (
    <>
      <section className="franja-vista">
        <img
          className="franja-vista__imagen"
          src={`${process.env.PUBLIC_URL}/img/franja-vista-el-mirador.jpg`}
          alt=""
          aria-hidden="true"
        />
        <p>
          El restaurante ofrece una vista privilegiada hacia la costa y las exclusivas terrazas
          de nuestros ambientes.
        </p>
      </section>
      <section className="carta" id="carta">
        <div className="carta__titulo">
          <h2>La carta</h2>
        </div>
        <div className="carta__categorias">
          <img className="carta__fondo" src={`${process.env.PUBLIC_URL}/img/carta-fondo.png`} alt="" aria-hidden="true" />
          <p className="carta__introduccion">Sabores para disfrutar</p>
          <div className="categorias">
            {categorias.map((categoria) => (
              <a
                className="categoria"
                href={categoria.pdf}
                key={categoria.nombre}
                target="_blank"
                rel="noreferrer"
                style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/img/${categoria.imagen})` }}
              >
                <span>{categoria.nombre}</span>
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
