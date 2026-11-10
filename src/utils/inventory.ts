import { InventoryItem } from '../types/game';

/**
 * Checks whether an item type is stackable.
 * Weapons and gear with custom inscriptions/durability unique stats do not stack.
 */
export function isItemStackable(item: InventoryItem): boolean {
  if (!item) return false;
  // If it has individual durability, custom gift/forge tags, it stays unique
  if (item.durability !== undefined || item.giftedBy || item.forgedBy) return false;
  
  // Consumables and raw resources always stack
  return (
    item.category === 'food' ||
    item.category === 'water' ||
    item.category === 'medical' ||
    item.category === 'resource' ||
    item.category === 'tool'
  );
}

/**
 * Merges a new item into an existing inventory array, incrementing quantity if stackable.
 */
export function addItemToInventory(inventory: InventoryItem[], newItem: InventoryItem): InventoryItem[] {
  if (!newItem || newItem.quantity <= 0) return inventory;
  const isStackable = isItemStackable(newItem);

  const existingIndex = inventory.findIndex(i => {
    if (i.id === newItem.id) return true;
    if (isStackable && isItemStackable(i)) {
      return (
        i.name.trim().toLowerCase() === newItem.name.trim().toLowerCase() &&
        i.category === newItem.category
      );
    }
    return false;
  });

  if (existingIndex !== -1) {
    const copy = [...inventory];
    copy[existingIndex] = {
      ...copy[existingIndex],
      quantity: copy[existingIndex].quantity + newItem.quantity
    };
    return copy;
  }

  return [...inventory, { ...newItem }];
}

/**
 * Consolidates duplicate stackable items in an inventory array into single entries.
 */
export function consolidateInventory(inventory: InventoryItem[]): InventoryItem[] {
  if (!Array.isArray(inventory)) return [];
  const merged: InventoryItem[] = [];

  for (const item of inventory) {
    if (!item || item.quantity <= 0) continue;
    const isStackable = isItemStackable(item);

    const existing = merged.find(m => {
      if (m.id === item.id) return true;
      if (isStackable && isItemStackable(m)) {
        return (
          m.name.trim().toLowerCase() === item.name.trim().toLowerCase() &&
          m.category === item.category
        );
      }
      return false;
    });

    if (existing) {
      existing.quantity += item.quantity;
    } else {
      merged.push({ ...item });
    }
  }

  return merged;
}

