export function Icon({ name, size = 17 }) {
  const paths = {
    grid: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18M8 14l2 2 5-5" /></>,
    table: <><path d="M3 8h18M5 8v13m14-13v13M3 21h18M7 8V4h10v4" /></>,
    cutlery: <><path d="M6 3v7m-3-7v4a3 3 0 0 0 6 0V3M6 10v11m11-18v18m0-18c-3 3-3 8 0 10" /></>,
    users: <><path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M10 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm7-7.5a4 4 0 0 1 0 7.8M20 21v-2a4 4 0 0 0-3-3.87" /></>,
    chart: <><path d="M4 20V10m6 10V4m6 16v-7m6 7H2" /></>,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    search: <><circle cx="10.8" cy="10.8" r="6.8" /><path d="m16 16 5 5" /></>,
    download: <><path d="M12 3v12m-5-5 5 5 5-5M4 21h16" /></>,
    plus: <><path d="M12 5v14M5 12h14" /></>,
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9m-8 12h4" /></>,
  };
  return <svg className="admin-icon" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name] || paths.grid}</svg>;
}

export function PageHeading({ title, subtitle, action }) {
  return (
    <div className="admin-page-heading">
      <div>
        <p className="admin-eyebrow">VIERNES, 30 DE OCTUBRE</p>
        <h1>{title}</h1>
        {subtitle && <p className="admin-subtitle">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function Metric({ label, value, note, dark = false, negative = false }) {
  return <article className={`admin-metric${dark ? ' admin-metric--dark' : ''}`}>
    <span className="admin-eyebrow">{label}</span>
    <strong className={negative ? 'admin-negative' : ''}>{value}</strong>
    {note && <small>{note}</small>}
  </article>;
}

export function downloadCsv(filename, rows) {
  const content = rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');
  const url = URL.createObjectURL(new Blob([`\uFEFF${content}`], { type: 'text/csv;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
