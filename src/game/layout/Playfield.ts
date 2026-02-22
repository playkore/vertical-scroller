export type PlayfieldBounds = {
  left: number;
  right: number;
  width: number;
  height: number;
  sidePanelWidth: number;
};

const SIDE_PANEL_RATIO = 0.1;
const MIN_SIDE_PANEL_WIDTH = 24;
const MAX_SIDE_PANEL_WIDTH = 52;

export function getPlayfieldBounds(width: number, height: number): PlayfieldBounds {
  const sidePanelWidth = Math.min(
    MAX_SIDE_PANEL_WIDTH,
    Math.max(MIN_SIDE_PANEL_WIDTH, Math.round(width * SIDE_PANEL_RATIO))
  );

  return {
    left: sidePanelWidth,
    right: width - sidePanelWidth,
    width: width - sidePanelWidth * 2,
    height,
    sidePanelWidth
  };
}
