export const navigation = [
  { section: 'GESTIÓN', items: [{ label: 'Resumen', icon: 'grid' }, { label: 'Reservas', icon: 'calendar', badge: '12' }, { label: 'Mesas', icon: 'table' }, { label: 'Carta y pedidos', icon: 'cutlery' }] },
  { section: 'ADMINISTRACIÓN', items: [{ label: 'Clientes', icon: 'users' }, { label: 'Reportes', icon: 'chart' }, { label: 'Horarios y cierres', icon: 'clock' }] },
];

export const reservationsInitial = [
  { id: 'RSV-2048', table: '01', guest: 'Andrea Fernández', dni: '74839210', phone: '+51 962 491 696', email: 'andrea.f@email.com', people: 2, time: '14:30', space: 'Terraza', status: 'Confirmada', payment: 'Pagado', notes: 'Aniversario. Preparar mesa junto a la ventana.', dishes: ['2× Lomo fino', '1× Tiradito de pesca'] },
  { id: 'RSV-2051', table: '06', guest: 'Carlos Mendoza', dni: '43291856', phone: '+51 994 208 731', email: 'carlos.m@email.com', people: 4, time: '15:00', space: 'Salón principal', status: 'Pendiente', payment: 'Pendiente', notes: 'Una persona es alérgica a los mariscos.', dishes: ['4× Menú degustación', '1× Espumante brut'] },
  { id: 'RSV-2054', table: '12', guest: 'Lucía Salazar', dni: '70312498', phone: '+51 978 610 422', email: 'lucia.salazar@email.com', people: 6, time: '16:30', space: 'Zona privada', status: 'Confirmada', payment: 'Pendiente', notes: 'Cumpleaños. La torta llegará a las 16:15.', dishes: ['6× Menú costa', '2× Vino sauvignon blanc'] },
  { id: 'RSV-2057', table: '04', guest: 'Martín Rojas', dni: '45903217', phone: '+51 910 348 612', email: 'martin.rojas@email.com', people: 3, time: '18:00', space: 'Terraza', status: 'Cancelada', payment: 'Pendiente', notes: 'Cancelación solicitada por el cliente.', dishes: [] },
];

export const clients = [
  { name: 'Andrea Fernández', initials: 'AF', visits: 32, spent: 'S/ 8,420', level: 'VIP Oro', table: 'Terraza · Mesa 01', last: '15 jun 2024' },
  { name: 'Lucía Salazar', initials: 'LS', visits: 24, spent: 'S/ 6,180', level: 'VIP Oro', table: 'Zona privada · Mesa 12', last: '10 jun 2024' },
  { name: 'Carlos Mendoza', initials: 'CM', visits: 18, spent: 'S/ 4,560', level: 'VIP Plata', table: 'Salón · Mesa 06', last: '02 jun 2024' },
  { name: 'Valeria Torres', initials: 'VT', visits: 13, spent: 'S/ 3,290', level: 'VIP Plata', table: 'Terraza · Mesa 03', last: '28 may 2024' },
  { name: 'Martín Rojas', initials: 'MR', visits: 8, spent: 'S/ 1,940', level: 'Frecuente', table: 'Salón · Mesa 04', last: '20 may 2024' },
  { name: 'Sofía Castillo', initials: 'SC', visits: 3, spent: 'S/ 780', level: 'Nuevo', table: 'Sin preferencia', last: '12 may 2024' },
];

export const menuCategories = [
  { name: 'Entradas', dishes: [['Causa de pulpo al olivo', '8', 'S/ 34', 'Disponible'], ['Tiradito de pesca del día', '11', 'S/ 42', 'Disponible'], ['Croquetas de ají de gallina', '6', 'S/ 30', 'Disponible']] },
  { name: 'Fondos', dishes: [['Lomo fino al vino tinto', '14', 'S/ 68', 'Disponible'], ['Pesca del día con risotto', '9', 'S/ 62', 'Disponible'], ['Arroz meloso de mariscos', '12', 'S/ 58', 'Disponible']] },
  { name: 'Postres', dishes: [['Suspiro Mirador', '7', 'S/ 28', 'Disponible'], ['Tarta tibia de chocolate', '10', 'S/ 30', 'Disponible'], ['Selección de helados', '4', 'S/ 24', 'Disponible']] },
  { name: 'Bebidas', dishes: [['Chilcano de maracuyá', '15', 'S/ 32', 'Disponible'], ['Copa sauvignon blanc', '16', 'S/ 28', 'Disponible'], ['Limonada de hierbaluisa', '8', 'S/ 18', 'Disponible']] },
];
