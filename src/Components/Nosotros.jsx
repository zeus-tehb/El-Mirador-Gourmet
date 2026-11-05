export default function Nosotros() {
  return (
    <section className="nosotros" id="nosotros">
      <div className="nosotros__texto">
        <h2>Nosotros</h2>
        <h3>Nuestra esencia</h3>
        <p>
          En El Mirador Gourmet, cada detalle está pensado para despertar tus sentidos. Somos
          un espacio exclusivo diseñado para conectar la alta cocina con la calidez de la
          naturaleza y la elegancia arquitectónica.
        </p>
        <p>
          Contamos con diferentes ambientes para cada ocasión: una terraza exterior bajo las
          estrellas y frente a hermosas vistas panorámicas, un salón principal sofisticado y
          luminoso, y una zona privada concebida para celebraciones íntimas y memorables.
        </p>
        <p>
          Te invitamos a vivir una experiencia gastronómica única, donde la pasión por el buen
          comer y la excelencia en el servicio se unen para crear momentos inolvidables.
        </p>
      </div>
      <img
        className="nosotros__imagen"
        src="/img/nosotros-el-mirador.jpg"
        alt="Chef presenta un plato a los comensales durante una cena en El Mirador Gourmet"
      />
    </section>
  );
}
