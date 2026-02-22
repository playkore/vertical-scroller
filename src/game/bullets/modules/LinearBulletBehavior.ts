import { BulletBehaviorDefinition, BulletBehaviorParams } from '../BulletBehavior';

const getParam = (params: BulletBehaviorParams, key: string, fallback = 0): number => {
  return Number.isFinite(params[key]) ? params[key] : fallback;
};

export const bulletBehavior: BulletBehaviorDefinition = {
  id: 'linear',
  onFire: ({ bullet, params }) => {
    bullet.setVelocity(getParam(params, 'velocityX'), getParam(params, 'velocityY', -400));
    return null;
  }
};
