import Phaser from 'phaser';
import { PowerupDefinition } from '../PowerupDefinition';
import { getShipById } from '../../ships/ShipRegistry';

const ship = getShipById('lancer');

export const powerupModule: PowerupDefinition = {
  id: 'switch-lancer',
  name: 'SWITCH LNC',
  textureKey: ship.textureKey,
  fallSpeed: 100,
  behavior: {
    onCollect: ({ scene }) => {
      const shipScene = scene as Phaser.Scene & { applyShipById?: (shipId: string) => void };
      shipScene.applyShipById?.(ship.id);
    }
  },
  registerAssets: () => undefined
};
