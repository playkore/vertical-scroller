import Phaser from 'phaser';
import { PowerupDefinition } from '../PowerupDefinition';
import { getShipById } from '../../ships/ShipRegistry';

const ship = getShipById('solar-spiral');

export const powerupModule: PowerupDefinition = {
  id: 'switch-solar-spiral',
  name: 'SWITCH SUN',
  textureKey: ship.textureKey,
  fallSpeed: 104,
  behavior: {
    onCollect: ({ scene }) => {
      const shipScene = scene as Phaser.Scene & { applyShipById?: (shipId: string) => void };
      shipScene.applyShipById?.(ship.id);
    }
  },
  registerAssets: () => undefined
};
