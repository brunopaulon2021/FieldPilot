export default function CustomersLoading() {
  return (
    <main className="dashboard-loading" aria-busy="true" aria-label="A carregar clientes">
      <div className="loading-sidebar" />
      <div className="loading-content">
        <div className="loading-line wide" />
        <div className="loading-line medium" />
        <div className="loading-panels">
          <div className="loading-panel" />
          <div className="loading-panel narrow" />
        </div>
      </div>
    </main>
  );
}
