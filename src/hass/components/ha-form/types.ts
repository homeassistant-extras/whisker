/**
 * https://github.com/home-assistant/frontend/blob/dev/src/components/ha-form/types.ts
 */

import type { Selector } from '@hass/data/selector';

export type HaFormSchema = HaFormSelector | HaFormExpandableSchema;

export interface HaFormBaseSchema {
  name: string;
  required?: boolean;
  label: string;
}

export interface HaFormExpandableSchema extends HaFormBaseSchema {
  type: 'expandable';
  flatten?: boolean;
  icon?: string;
  schema: readonly HaFormSchema[];
}

export interface HaFormSelector extends HaFormBaseSchema {
  selector: Selector;
}
