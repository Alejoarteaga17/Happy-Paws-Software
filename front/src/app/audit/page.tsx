'use client';

import { useEffect, useState } from 'react';
import AppHeader from '../../components/app-header';
import RestrictedView from '../../components/restricted-view';
import { getSupabaseClient } from '../../services/supabase-client';

interface AuditRow {
  id: number;
  action: string;
  entity_name: string;
  entity_id: string | null;
  created_at: string;
}

export default function AuditPage() {
  return (
    <RestrictedView permission="view_audit">
      <AuditTable />
    </RestrictedView>
  );
}

function AuditTable() {
  const [logs, setLogs] = useState<AuditRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    getSupabaseClient()
      .from('audit_logs')
      .select('id,action,entity_name,entity_id,created_at')
      .order('created_at', { ascending: false })
      .limit(100)
      .then(({ data, error: queryError }) => {
        if (queryError) setError(queryError.message);
        else setLogs((data ?? []) as AuditRow[]);
      });
  }, []);
  return (
    <main className="summary-page">
      <AppHeader />
      <section className="summary-content">
        <header className="summary-hero">
          <div>
            <p className="eyebrow">Trazabilidad</p>
            <h1>Histórico de operaciones</h1>
            <p className="summary-subtitle">Acciones recientes registradas por el sistema.</p>
          </div>
        </header>
        <section className="summary-panel table-panel">
          {error && <p className="form-error">{error}</p>}
          <table className="data-table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Acción</th>
                <th>Entidad</th>
                <th>ID</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id}>
                  <td>{new Date(log.created_at).toLocaleString('es-CO')}</td>
                  <td>{log.action}</td>
                  <td>{log.entity_name}</td>
                  <td>{log.entity_id ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {!logs.length && !error && <p className="empty">No hay operaciones registradas.</p>}
        </section>
      </section>
    </main>
  );
}
