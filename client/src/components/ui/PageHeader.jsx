function PageHeader({ title, subtitle }) {
  return (
    <div className="mb-10">
      <h1 className="text-5xl font-extrabold text-slate-800">{title}</h1>

      <p className="text-lg text-slate-500 mt-2">{subtitle}</p>
    </div>
  );
}

export default PageHeader;
