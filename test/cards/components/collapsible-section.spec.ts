import { WhiskerCollapsibleSection } from '@cards/components/collapsible-section';
import { fixture } from '@open-wc/testing-helpers';
import { expect } from 'chai';
import type { TemplateResult } from 'lit';

describe('collapsible-section.ts (WhiskerCollapsibleSection)', () => {
  it('renders an ha-expansion-panel with the given header', async () => {
    const el = new WhiskerCollapsibleSection();
    el.header = 'Pet visits';

    const rendered = await fixture(el.render() as TemplateResult);
    const panel = rendered.matches('ha-expansion-panel')
      ? rendered
      : rendered.querySelector('ha-expansion-panel');

    expect(panel).to.not.be.null;
    expect((panel as HTMLElement & { header?: string }).header).to.equal(
      'Pet visits',
    );
  });

  it('starts closed when collapsed is true', async () => {
    const el = new WhiskerCollapsibleSection();
    el.header = 'Pet weight';
    el.collapsed = true;

    const rendered = await fixture(el.render() as TemplateResult);
    const panel = rendered.matches('ha-expansion-panel')
      ? rendered
      : rendered.querySelector('ha-expansion-panel');

    expect((panel as HTMLElement & { expanded?: boolean }).expanded).to.equal(
      false,
    );
  });

  it('starts open when collapsed is false', async () => {
    const el = new WhiskerCollapsibleSection();
    el.header = 'Pet weight';

    const rendered = await fixture(el.render() as TemplateResult);
    const panel = rendered.matches('ha-expansion-panel')
      ? rendered
      : rendered.querySelector('ha-expansion-panel');

    expect((panel as HTMLElement & { expanded?: boolean }).expanded).to.equal(
      true,
    );
  });

  it('keeps a viewer toggle across re-renders', async () => {
    const el = document.createElement(
      'whisker-collapsible-section',
    ) as WhiskerCollapsibleSection;
    el.header = 'Pet weight';
    el.collapsed = true;
    document.body.appendChild(el);
    await el.updateComplete;

    (
      el as unknown as {
        _onExpandedChanged: (ev: CustomEvent<{ expanded: boolean }>) => void;
      }
    )._onExpandedChanged(
      new CustomEvent('expanded-changed', { detail: { expanded: true } }),
    );
    await el.updateComplete;

    // force a re-render without changing collapsed — viewer choice must stick
    el.header = 'Pet weight updated';
    await el.updateComplete;

    expect(
      (
        el.shadowRoot!.querySelector('ha-expansion-panel') as HTMLElement & {
          expanded?: boolean;
        }
      ).expanded,
    ).to.equal(true);

    el.remove();
  });

  it('re-seeds from collapsed when that config changes', async () => {
    const el = document.createElement(
      'whisker-collapsible-section',
    ) as WhiskerCollapsibleSection;
    el.header = 'Pet weight';
    el.collapsed = true;
    document.body.appendChild(el);
    await el.updateComplete;

    (
      el as unknown as {
        _onExpandedChanged: (ev: CustomEvent<{ expanded: boolean }>) => void;
      }
    )._onExpandedChanged(
      new CustomEvent('expanded-changed', { detail: { expanded: true } }),
    );
    await el.updateComplete;

    el.collapsed = false;
    await el.updateComplete;
    expect(
      (
        el.shadowRoot!.querySelector('ha-expansion-panel') as HTMLElement & {
          expanded?: boolean;
        }
      ).expanded,
    ).to.equal(true);

    el.collapsed = true;
    await el.updateComplete;
    expect(
      (
        el.shadowRoot!.querySelector('ha-expansion-panel') as HTMLElement & {
          expanded?: boolean;
        }
      ).expanded,
    ).to.equal(false);

    el.remove();
  });
});
