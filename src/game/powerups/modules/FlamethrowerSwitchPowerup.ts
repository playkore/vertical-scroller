import Phaser from 'phaser';
import { PowerupDefinition } from '../PowerupDefinition';
import { getShipById } from '../../ships/ShipRegistry';

const ship = getShipById('flamethrower');

export const powerupModule: PowerupDefinition = {
  id: 'switch-flamethrower',
  name: 'SWITCH FLAME',
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
