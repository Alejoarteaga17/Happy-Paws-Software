import { getSupabaseClient } from '../config/supabase';
import { SearchResult } from '../types/search';

export class SearchService {
  static async search(query: string): Promise<SearchResult[]> {
    const normalized = query.trim();
    const pattern = `%${normalized}%`;
    const client = getSupabaseClient();
    const [{ data: owners, error: ownersError }, { data: pets, error: petsError }] = await Promise.all([
      client
        .from('owners')
        .select('id, full_name, phone, email')
        .is('deleted_at', null)
        .or(`full_name.ilike.${pattern},phone.ilike.${pattern},email.ilike.${pattern}`)
        .order('full_name')
        .limit(25),
      client
        .from('pets')
        .select('id, owner_id, name, pet_tag, species, owners(full_name)')
        .is('deleted_at', null)
        .or(`name.ilike.${pattern},pet_tag.ilike.${pattern}`)
        .order('name')
        .limit(25),
    ]);
    if (ownersError) throw new Error(`SEARCH_FAILED: ${ownersError.message}`);
    if (petsError) throw new Error(`SEARCH_FAILED: ${petsError.message}`);

    const ownerResults: SearchResult[] = (owners ?? []).map((owner) => ({
      type: 'OWNER',
      id: owner.id,
      title: owner.full_name,
      subtitle: [owner.phone, owner.email].filter(Boolean).join(' · '),
    }));
    const petResults: SearchResult[] = (pets ?? []).map((pet) => {
      const owner = Array.isArray(pet.owners) ? pet.owners[0] : pet.owners;
      return {
        type: 'PET',
        id: pet.id,
        ownerId: pet.owner_id,
        title: pet.name,
        subtitle: `${pet.pet_tag} · ${owner?.full_name ?? 'Propietario sin nombre'} · ${pet.species}`,
      };
    });
    return [...ownerResults, ...petResults];
  }
}
