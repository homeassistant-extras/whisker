/**
 * Maps Litter Robot `status_code` sensor states (Home Assistant core enum) to an icon and
 * theme-friendly color. Codes match `homeassistant/components/litterrobot/sensor.py` options.
 */

export interface LitterRobotStatusPresentation {
  icon: string;
  color: string;
}

const UNAVAILABLE = {
  icon: 'mdi:help-circle-outline',
  color: 'var(--disabled-text-color, var(--secondary-text-color))',
} as const;

/** Ready / clean complete — nominal “good” */
const GOOD: LitterRobotStatusPresentation = {
  icon: 'mdi:check-circle-outline',
  color: 'var(--success-color, #2ecc71)',
};

/** Active cycle / detecting / powering up */
const ACTIVE: LitterRobotStatusPresentation = {
  icon: 'mdi:autorenew',
  color: 'var(--primary-color)',
};

const CAT_ACTIVE: LitterRobotStatusPresentation = {
  icon: 'mdi:cat',
  color: 'var(--primary-color)',
};

const EMPTY_CYCLE: LitterRobotStatusPresentation = {
  icon: 'mdi:broom',
  color: 'var(--primary-color)',
};

/** Paused */
const PAUSED: LitterRobotStatusPresentation = {
  icon: 'mdi:pause-circle',
  color: 'var(--warning-color, #ff9800)',
};

/** Drawer filling up */
const DRAWER_WARN: LitterRobotStatusPresentation = {
  icon: 'mdi:trash-can-outline',
  color: 'var(--warning-color, #ff9800)',
};

const DRAWER_FULL: LitterRobotStatusPresentation = {
  icon: 'mdi:delete-alert',
  color: 'var(--error-color, #db4437)',
};

/** Pinch / mechanical detect */
const PINCH: LitterRobotStatusPresentation = {
  icon: 'mdi:hand-back-left-off',
  color: 'var(--warning-color, #ff9800)',
};

/** Hardware / bonnet */
const BONNET: LitterRobotStatusPresentation = {
  icon: 'mdi:archive-off-outline',
  color: 'var(--error-color, #db4437)',
};

/** Faults */
const FAULT: LitterRobotStatusPresentation = {
  icon: 'mdi:alert-octagon',
  color: 'var(--error-color, #db4437)',
};

const CAT_SENSOR_FAULT: LitterRobotStatusPresentation = {
  icon: 'mdi:cat-alert',
  color: 'var(--error-color, #db4437)',
};

/** Powered off / offline */
const OFF: LitterRobotStatusPresentation = {
  icon: 'mdi:power-standby',
  color: 'var(--disabled-text-color, var(--secondary-text-color))',
};

const OFFLINE: LitterRobotStatusPresentation = {
  icon: 'mdi:cloud-off-outline',
  color: 'var(--disabled-text-color, var(--secondary-text-color))',
};

const POWER_DOWN: LitterRobotStatusPresentation = {
  icon: 'mdi:power-off',
  color: 'var(--disabled-text-color, var(--secondary-text-color))',
};

const POWER_UP: LitterRobotStatusPresentation = {
  icon: 'mdi:power-on',
  color: 'var(--primary-color)',
};

/** Cat sensor interrupted — attention, not always a hard fault */
const INTERRUPTED: LitterRobotStatusPresentation = {
  icon: 'mdi:motion-sensor-off',
  color: 'var(--warning-color, #ff9800)',
};

/** Cat sensor timing — usually in-cycle */
const TIMING: LitterRobotStatusPresentation = {
  icon: 'mdi:timer-outline',
  color: 'var(--primary-color)',
};

/**
 * Status codes where a clean / empty cycle is in progress (globe active).
 * Matches Whisker `status_code` sensor enum in Home Assistant core.
 */
const CYCLING_STATUS_CODES = new Set(['ccp', 'ec', 'cst']);

/**
 * @param rawState - `sensor.status_code` state string from HA
 * @returns true while a cycle is running (clean cycle, empty cycle, or cat-sensor timing phase).
 */
export const isLitterRobotCycling = (
  rawState: string | undefined | null,
): boolean => {
  if (rawState === undefined || rawState === null || rawState === '') {
    return false;
  }
  const s = rawState.toLowerCase();
  if (s === 'unknown' || s === 'unavailable') {
    return false;
  }
  return CYCLING_STATUS_CODES.has(s);
};

const STATUS_TABLE: Record<string, LitterRobotStatusPresentation> = {
  rdy: GOOD,
  ccc: { icon: 'mdi:check-circle', color: GOOD.color },
  ccp: ACTIVE,
  cd: CAT_ACTIVE,
  cst: TIMING,
  ec: EMPTY_CYCLE,
  p: PAUSED,
  df1: DRAWER_WARN,
  df2: DRAWER_WARN,
  dfs: DRAWER_FULL,
  sdf: DRAWER_FULL,
  pd: PINCH,
  spf: PINCH,
  br: BONNET,
  csf: CAT_SENSOR_FAULT,
  scf: CAT_SENSOR_FAULT,
  csi: INTERRUPTED,
  dhf: FAULT,
  dpf: FAULT,
  hpf: FAULT,
  otf: FAULT,
  off: OFF,
  offline: OFFLINE,
  pwrd: POWER_DOWN,
  pwru: POWER_UP,
};

/**
 * @param rawState - `sensor.status_code` state string from HA (lowercase enum member)
 */
export const litterRobotStatusPresentation = (
  rawState: string | undefined | null,
): LitterRobotStatusPresentation => {
  if (rawState === undefined || rawState === null || rawState === '') {
    return UNAVAILABLE;
  }
  const state = rawState.toLowerCase();
  if (state === 'unknown' || state === 'unavailable') {
    return UNAVAILABLE;
  }
  return STATUS_TABLE[state] ?? UNAVAILABLE;
};
