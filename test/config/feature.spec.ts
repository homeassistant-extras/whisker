import { hasFeature } from '@/config/feature';
import type { Config, Features } from '@type/config';
import { expect } from 'chai';
import { describe, it } from 'mocha';

describe('feature', () => {
  it('should return true when config is null', () => {
    expect(hasFeature(null as unknown as Config, 'percentage')).to.be.true;
  });

  it('should return true when config is undefined', () => {
    expect(hasFeature(undefined as unknown as Config, 'percentage')).to.be.true;
  });

  it('should return false when config.features is undefined', () => {
    const config = {} as Config;
    expect(hasFeature(config, 'percentage')).to.be.false;
  });

  it('should return false when config.features is empty', () => {
    const config = { device_id: '', features: [] } as Config;
    expect(hasFeature(config, 'percentage')).to.be.false;
  });

  it('should return true when feature is present in config.features', () => {
    const config = {
      device_id: '',
      features: ['percentage', 'exclude_default_entities'],
    } as Config;
    expect(hasFeature(config, 'percentage')).to.be.true;
  });

  it('should return false when feature is not present in config.features', () => {
    const config = {
      device_id: '',
      features: [],
    } as Config;
    expect(hasFeature(config, 'percentage')).to.be.false;
  });

  it('should handle case-sensitive feature names', () => {
    const config = {
      device_id: '',
      features: ['PERCENTAGE' as Features],
    } as Config;
    expect(hasFeature(config, 'percentage')).to.be.false;
  });

  // Edge cases
  it('should handle empty string feature names', () => {
    const config = { features: ['' as any as Features] } as Config;
    expect(hasFeature(config, '' as unknown as Features)).to.be.true;
  });
});
