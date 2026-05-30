/**
 * Icon and color for the header hopper badge.
 * Icons align with Home Assistant `litterrobot` entity icons:
 * @see https://github.com/home-assistant/core/blob/dev/homeassistant/components/litterrobot/icons.json
 */
export interface HopperStatusPresentation {
  icon: string;
  color: string;
}

const UNAVAILABLE: HopperStatusPresentation = {
  icon: 'mdi:filter',
  color: 'var(--disabled-text-color, var(--secondary-text-color))',
};

/** `hopper_connected` off — hopper removed; no dedicated off icon in HA. */
const DISCONNECTED: HopperStatusPresentation = {
  icon: 'mdi:filter-remove',
  color: 'var(--disabled-text-color, var(--secondary-text-color))',
};

const READY: HopperStatusPresentation = {
  icon: 'mdi:filter-check',
  color: 'var(--success-color, #2ecc71)',
};

const EMPTY: HopperStatusPresentation = {
  icon: 'mdi:filter-minus-outline',
  color: 'var(--warning-color, #ff9800)',
};

const DISABLED: HopperStatusPresentation = {
  icon: 'mdi:filter-remove',
  color: 'var(--secondary-text-color)',
};

const MOTOR_DISCONNECTED: HopperStatusPresentation = {
  icon: 'mdi:engine-off',
  color: 'var(--error-color, #db4437)',
};

const MOTOR_FAULT_SHORT: HopperStatusPresentation = {
  icon: 'mdi:flash-off',
  color: 'var(--error-color, #db4437)',
};

const MOTOR_OT_AMPS: HopperStatusPresentation = {
  icon: 'mdi:flash-alert',
  color: 'var(--error-color, #db4437)',
};

/** Connected with no status yet — matches `hopper_connected` default icon. */
const CONNECTED: HopperStatusPresentation = {
  icon: 'mdi:filter-check',
  color: 'var(--success-color, #2ecc71)',
};

const normalizeState = (
  rawState: string | undefined | null,
): string | undefined => {
  if (rawState === undefined || rawState === null || rawState === '') {
    return undefined;
  }

  const state = rawState.toLowerCase();
  if (state === 'unknown' || state === 'unavailable') {
    return undefined;
  }

  return state;
};

const presentationFromStatus = (
  status: string | undefined,
): HopperStatusPresentation => {
  if (!status) {
    return UNAVAILABLE;
  }
  if (status === 'enabled') {
    return READY;
  }
  if (status === 'empty') {
    return EMPTY;
  }
  if (status === 'disabled') {
    return DISABLED;
  }
  if (status === 'motor_disconnected') {
    return MOTOR_DISCONNECTED;
  }
  if (status === 'motor_fault_short') {
    return MOTOR_FAULT_SHORT;
  }
  if (status === 'motor_ot_amps') {
    return MOTOR_OT_AMPS;
  }

  return {
    icon: 'mdi:filter',
    color: 'var(--secondary-text-color)',
  };
};

/**
 * Maps `hopper_connected` and `hopper_status` entity states to badge icon and color.
 *
 * When `hopper_connected` is `off`, the hopper is treated as disconnected regardless
 * of status. When connected (or connection is unknown), status drives refill/fault styling.
 */
export const hopperStatusPresentation = (
  statusState: string | undefined | null,
  connectedState?: string | undefined | null,
): HopperStatusPresentation => {
  const status = normalizeState(statusState);
  const connected = normalizeState(connectedState);

  if (connected === 'off') {
    return DISCONNECTED;
  }

  if (connected === 'on') {
    if (!status) {
      return CONNECTED;
    }
    return presentationFromStatus(status);
  }

  return presentationFromStatus(status);
};
