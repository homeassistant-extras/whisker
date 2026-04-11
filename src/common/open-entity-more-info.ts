import { fireEvent } from '@hass/common/dom/fire_event';
import '@hass/state/more-info-mixin';

/**
 * Opens the Home Assistant more-info dialog for an entity (Lovelace convention).
 */
export function openEntityMoreInfo(
  target: HTMLElement,
  entityId: string | null | undefined,
): void {
  if (!entityId) {
    return;
  }
  fireEvent(target, 'hass-more-info', { entityId });
}
