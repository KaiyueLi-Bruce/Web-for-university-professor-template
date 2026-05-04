import { useState } from 'react';
import { createStableId } from '../lib/content';

/**
 * Generic hook for managing list operations (add, remove, update)
 * Useful for managing collections like members, papers, research items
 */
export function useListManager<T extends { id: string }>(
  initialList: T[],
  idPrefix: string,
  createDefaultItem: () => T
) {
  const [items, setItems] = useState<T[]>(initialList);

  const addItem = () => {
    setItems((prev) => [
      ...prev,
      {
        ...createDefaultItem(),
        id: createStableId(idPrefix),
      },
    ]);
  };

  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, updates: Partial<T>) => {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, ...updates } : item))
    );
  };

  return {
    items,
    setItems,
    addItem,
    removeItem,
    updateItem,
  };
}
