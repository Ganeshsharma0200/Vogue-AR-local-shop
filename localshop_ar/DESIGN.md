---
name: LocalShop AR
colors:
  surface: '#131315'
  surface-dim: '#131315'
  surface-bright: '#39393b'
  surface-container-lowest: '#0e0e10'
  surface-container-low: '#1c1b1d'
  surface-container: '#201f22'
  surface-container-high: '#2a2a2c'
  surface-container-highest: '#353437'
  on-surface: '#e5e1e4'
  on-surface-variant: '#cfc2d6'
  inverse-surface: '#e5e1e4'
  inverse-on-surface: '#313032'
  outline: '#988d9f'
  outline-variant: '#4d4354'
  surface-tint: '#ddb7ff'
  primary: '#ddb7ff'
  on-primary: '#490080'
  primary-container: '#b76dff'
  on-primary-container: '#400071'
  inverse-primary: '#842bd2'
  secondary: '#ffafd3'
  on-secondary: '#620040'
  secondary-container: '#85145a'
  on-secondary-container: '#ff93c8'
  tertiary: '#3cddc7'
  on-tertiary: '#003731'
  tertiary-container: '#00a392'
  on-tertiary-container: '#00302a'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#f0dbff'
  primary-fixed-dim: '#ddb7ff'
  on-primary-fixed: '#2c0051'
  on-primary-fixed-variant: '#6900b3'
  secondary-fixed: '#ffd8e7'
  secondary-fixed-dim: '#ffafd3'
  on-secondary-fixed: '#3d0026'
  on-secondary-fixed-variant: '#85145a'
  tertiary-fixed: '#62fae3'
  tertiary-fixed-dim: '#3cddc7'
  on-tertiary-fixed: '#00201c'
  on-tertiary-fixed-variant: '#005047'
  background: '#131315'
  on-background: '#e5e1e4'
  surface-variant: '#353437'
typography:
  headline-xl:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '800'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: 0em
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
    letterSpacing: 0em
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: 0.1em
  label-bold:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 8px
  sm: 16px
  md: 24px
  lg: 32px
  xl: 48px
  gutter: 16px
  margin: 20px
---

## Brand & Style

The design system is engineered to bridge the gap between high-street fashion and cutting-edge spatial computing. It evokes a sense of "digital couture"—where the energy of local commerce meets the precision of augmented reality. The personality is vibrant, confident, and premium, targeting a fashion-conscious demographic that values both community and technological convenience.

The visual style utilizes **Glassmorphism** for AR overlays to maintain spatial context without obscuring the camera feed, combined with a **Minimalist Dark Mode** for the 2D interface to ensure that product imagery and the primary "Neon Purple" brand colors radiate. The result is a high-contrast, immersive environment that feels like an extension of a high-end fashion magazine in 3D space.

## Colors

The palette is anchored in a deep, obsidian dark mode that serves as a canvas for high-energy accents. 

- **Primary (Neon Purple):** Used for critical actions, brand identification, and active AR markers. It provides a futuristic tech-feel.
- **Secondary (Electric Pink):** Employed for accents, promotions, and secondary highlights to inject a "fashion-forward" energy.
- **Surface Colors:** A range of deep charcoals and translucent blacks are used to define hierarchy without breaking the dark-mode aesthetic. 
- **Functional Colors:** Success (Teal) and Error (Bright Red) are saturated to ensure they remain legible against the vibrant primary palette.

All colors are chosen with high-saturation profiles to ensure visibility when overlaid on various real-world backgrounds through the AR viewport.

## Typography

The design system utilizes **Inter** exclusively to achieve a clean, utilitarian, yet premium technical feel. The scale is built on heavy weights (Bold and ExtraBold) for headlines to create a clear "fashion editorial" hierarchy.

- **Headlines:** Use high-contrast weights and tighter letter spacing to create a sense of density and authority.
- **Body Text:** Optimized for legibility against dark backgrounds with slightly increased line height.
- **Labels:** Uppercase treatment is used for labels and secondary metadata to mimic garment tagging and technical specifications.

## Layout & Spacing

This design system employs a **Fluid Grid** model to accommodate various mobile screen aspect ratios and AR viewport sizes. 

- **The 8px Rhythm:** All spacing and sizing are derived from an 8px base unit to ensure visual consistency.
- **Safe Areas:** A 20px outer margin is strictly enforced to ensure controls do not interfere with physical device edges or camera UI elements.
- **AR Context:** Elements in the AR view should be centered or anchored to the bottom-third of the screen to maintain ergonomic "thumb-reach" while keeping the center of the field-of-view clear for product visualization.

## Elevation & Depth

Depth in the design system is communicated through **Glassmorphism** and transparency rather than traditional shadows. This maintains the "AR-first" philosophy where the UI feels like a physical layer of glass floating in the user's environment.

- **Background Blur:** Elements utilize a 12px to 20px backdrop filter blur to maintain legibility.
- **Border Treatment:** Surfaces are defined by a 1px "inner-glow" border (semi-transparent white) to catch the light, simulating the edge of a glass pane.
- **Layering:** Primary interactive elements (like the "Buy" button) sit on the highest Z-index, using full opacity and a subtle ambient purple glow to distinguish them from informational glass layers.

## Shapes

The shape language is defined by **Rounded (0.5rem base)** geometry. This strikes a balance between the "tech" nature of AR (often associated with sharp lines) and the "lifestyle" nature of fashion (which favors organic, approachable curves).

- **Standard Cards:** Use 1rem (rounded-lg) for a friendly, modern feel.
- **Buttons & Chips:** Use 1.5rem (rounded-xl) or pill-shapes to invite interaction.
- **AR Nodes:** Floating product tags use a mix of pill shapes for text and perfect circles for price points, creating a distinct visual language for spatial elements.

## Components

The components within the design system prioritize high-contrast interaction and "glassy" aesthetics:

- **Glass Buttons:** Primary buttons use a solid Neon Purple gradient. Secondary buttons use a glass background with a Neon Purple border and white text.
- **Fashion Cards:** Sleek cards with 1px borders and no shadows. They use large, edge-to-edge product imagery with glass overlays for text metadata at the bottom.
- **AR Tag:** A specialized component consisting of a "ping" dot and a connected glass label that tracks physical objects. The connecting line should be a thin, 1px dashed Neon Purple stroke.
- **Navigation Dock:** A floating glass bar at the bottom of the screen with blurred background and haptic-feedback icons.
- **Input Fields:** Dark, recessed backgrounds with Electric Pink focus states to ensure the user knows exactly where the cursor is in a dark environment.
- **Scanning Reticle:** A dynamic, animated frame in the center of the AR view that uses the Secondary Electric Pink color to guide users to "frame" products.