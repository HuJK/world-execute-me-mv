import React from 'react';
import {C} from '../../theme';
import {Flower, PetalOverride} from '../../components/Flower';

/** The black flower (dark form) exactly as handed off by the bridge: ink2 petals, clay edges, sharp 0.35, clay glow. */
export const BlackFlower: React.FC<{
  x: number;
  y: number;
  size: number;
  t: number;
  petals?: PetalOverride[];
  glow?: number;
  spin?: number;
  opacity?: number;
  color?: string;
  edge?: string;
  sharp?: number;
  centerColor?: string;
  glowColor?: string;
}> = ({x, y, size, petals, glow = 0.6, spin = 0, opacity = 1, color = C.ink2, edge = C.clay, sharp = 0.35, centerColor, glowColor = C.clay}) => (
  <Flower
    x={x}
    y={y}
    size={size}
    color={color}
    edge={edge}
    edgeWidth={3}
    sharp={sharp}
    glow={glow}
    glowColor={glowColor}
    petals={petals}
    spin={spin}
    opacity={opacity}
    centerColor={centerColor}
  />
);
