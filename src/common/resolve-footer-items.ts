import { DEFAULT_FOOTER, type Config, type FooterItem } from '@/types/config';
import type { DutyReport } from '@/types/types';

export type FooterSlot = {
  key: FooterItem;
  entity: string;
  content?: 'last_changed';
};

/** Footer slots that need live entity state and relative-time rendering. */
export const isRelativeFooterSlot = (slot: FooterSlot): boolean =>
  slot.key === 'last_seen' || slot.content === 'last_changed';

const footerItemToProperty = {
  last_seen: 'last_seen',
  pet_weight: 'pet_weight',
  total_cycles: 'total_cycles',
  litter_level: 'litter_level',
  waste_drawer: 'waste_drawer',
  status: 'status',
  hopper_status: 'hopper_status',
  hopper_connected: 'hopper_connected',
} as const satisfies Record<
  Exclude<FooterItem, 'status_changed'>,
  keyof DutyReport
>;

/** Resolves all configured footer items, omitting unavailable entries. */
export const resolveFooterSlots = (
  config: Config | undefined,
  duty: DutyReport,
): FooterSlot[] => {
  const items = config?.footer?.length ? config.footer : DEFAULT_FOOTER;

  return items.flatMap((item): FooterSlot[] => {
    if (item === 'status_changed') {
      const status = duty.status;
      return status
        ? [{ key: item, entity: status, content: 'last_changed' as const }]
        : [];
    }

    const entityId = duty[footerItemToProperty[item]];
    return entityId ? [{ key: item, entity: entityId }] : [];
  });
};
