import Phaser from 'phaser';
import { PowerupDefinition } from '../PowerupDefinition';
import { getShipById } from '../../ships/ShipRegistry';

const ship = getShipById('interceptor');

export const powerupModule: PowerupDefinition = {
  id: 'switch-interceptor',
  name: 'SWITCH INT',
  textureKey: ship.textureKey,
  fallSpeed: 108,
  behavior: {
    onCollect: ({ scene }) => {
      const shipScene = scene as Phaser.Scene & { applyShipById?: (shipId: string) => void };
      shipScene.applyShipById?.(ship.id);
    }
  },
  registerAssets: () => undefined
};
