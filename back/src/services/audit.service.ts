import { getSupabaseClient } from '../config/supabase';

export interface AuditEntry {
  actorUserId: string;
  action: string;
  entityName: string;
  entityId?: number | string;
  metadata?: Record<string, unknown>;
}

export class AuditService {
  static async record(entry: AuditEntry): Promise<void> {
    const { error } = await getSupabaseClient()
      .from('audit_logs')
      .insert({
        actor_user_id: entry.actorUserId,
        action: entry.action,
        entity_name: entry.entityName,
        entity_id: entry.entityId === undefined ? null : String(entry.entityId),
        metadata: entry.metadata ?? {},
      });
    if (error) throw new Error(`AUDIT_LOG_FAILED: ${error.message}`);
  }

  static async list(limit = 100) {
    const { data, error } = await getSupabaseClient()
      .from('audit_logs')
      .select('id, actor_user_id, action, entity_name, entity_id, metadata, created_at')
      .order('created_at', { ascending: false })
      .limit(Math.min(Math.max(limit, 1), 200));
    if (error) throw new Error(`AUDIT_LIST_FAILED: ${error.message}`);
    return data ?? [];
  }
}
