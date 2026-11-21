import { Suspense } from 'react';
import { ItemListView } from '@/widgets/item-list/ItemListView';

export const metadata = { title: 'Minha lista' };

export default function ListaPage() {
  return (
    <Suspense>
      <ItemListView />
    </Suspense>
  );
}
