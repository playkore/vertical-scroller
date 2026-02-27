import Phaser from 'phaser';
import { PowerupDefinition } from '../PowerupDefinition';
import { getShipById } from '../../ships/ShipRegistry';

const ship = getShipById('bulwark');

export const powerupModule: PowerupDefinition = {
  id: 'switch-bulwark',
  name: 'SWITCH BLW',
  textureKey: ship.textureKey,
  fallSpeed: 96,
  behavior: {
    onCollect: ({ scene }) => {
      const shipScene = scene as Phaser.Scene & { applyShipById?: (shipId: string) => void };
      shipScene.applyShipById?.(ship.id);
    }
  },
  registerAssets: () => undefined
};
