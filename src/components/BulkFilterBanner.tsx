import LoadingLink from '@/src/components/navigation/LoadingLink';
import { ClipboardList } from 'lucide-react';

export default function BulkFilterBanner() {
  return (
    <div className="bulk_filter_banner">
      <div className="flex items-center gap-4">
        <div className="bulk_filter_banner_icon_wrap">
          <ClipboardList className="w-8 h-8 text-white flex-shrink-0" />
        </div>
        <div>
          <p className="subtitle_text text-white font-bold drop-shadow">
            ¿Tenés una decklist para buscar?
          </p>
          <p className="normal_text text-gray-200 mt-1 drop-shadow">
            Pegá tu lista de cartas y filtrá en bulk para ver de una qué tenemos en stock.
          </p>
        </div>
      </div>
      <LoadingLink
        href="/bulk-filter"
        className="button_primary medium_button flex items-center gap-2 whitespace-nowrap"
      >
        Filtrar en bulk →
      </LoadingLink>
    </div>
  );
}
