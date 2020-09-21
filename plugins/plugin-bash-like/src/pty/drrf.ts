/**
 * Copyright (c) 2018 The xterm.js authors. All rights reserved.
 * @license MIT
 */

import { IBufferCell } from 'xterm'

// import { INVERTED_DEFAULT_COLOR } from 'browser/renderer/atlas/Constants';
export const INVERTED_DEFAULT_COLOR = 257

// import { NULL_CELL_CODE, WHITESPACE_CELL_CHAR, Attributes } from 'common/buffer/Constants';
export const NULL_CELL_CODE = 0
export const WHITESPACE_CELL_CHAR = ' '
export const enum Attributes {
  /**
   * bit 1..8     blue in RGB, color in P256 and P16
   */
  BLUE_MASK = 0xff,
  BLUE_SHIFT = 0,
  PCOLOR_MASK = 0xff,
  PCOLOR_SHIFT = 0,

  /**
   * bit 9..16    green in RGB
   */
  GREEN_MASK = 0xff00,
  GREEN_SHIFT = 8,

  /**
   * bit 17..24   red in RGB
   */
  RED_MASK = 0xff0000,
  RED_SHIFT = 16,

  /**
   * bit 25..26   color mode: DEFAULT (0) | P16 (1) | P256 (2) | RGB (3)
   */
  CM_MASK = 0x3000000,
  CM_DEFAULT = 0,
  CM_P16 = 0x1000000,
  CM_P256 = 0x2000000,
  CM_RGB = 0x3000000,

  /**
   * bit 1..24  RGB room
   */
  RGB_MASK = 0xffffff
}

// rest from DomRenderRowFactory.ts
export const BOLD_CLASS = 'xterm-bold'
export const DIM_CLASS = 'xterm-dim'
export const ITALIC_CLASS = 'xterm-italic'
export const UNDERLINE_CLASS = 'xterm-underline'
export const CURSOR_CLASS = 'xterm-cursor'
export const CURSOR_BLINK_CLASS = 'xterm-cursor-blink'
export const CURSOR_STYLE_BLOCK_CLASS = 'xterm-cursor-block'
export const CURSOR_STYLE_BAR_CLASS = 'xterm-cursor-bar'
export const CURSOR_STYLE_UNDERLINE_CLASS = 'xterm-cursor-underline'

function padStart(text: string, padChar: string, length: number): string {
  while (text.length < length) {
    text = padChar + text
  }
  return text
}

/**
 * Stroing the styling from `_workCell`.
 *
 * Attribution: from DomRenderRofFactory.createRow xterm v4.4.0
 *
 */
export default function applyStyle(_workCell: IBufferCell) {
  const classList = []
  const style = {}
  let textContent

  if (_workCell.isBold()) {
    classList.push(BOLD_CLASS)
  }

  if (_workCell.isItalic()) {
    classList.push(ITALIC_CLASS)
  }

  if (_workCell.isDim()) {
    classList.push(DIM_CLASS)
  }

  if (_workCell.isUnderline()) {
    classList.push(UNDERLINE_CLASS)
  }

  if (_workCell.isInvisible()) {
    textContent = WHITESPACE_CELL_CHAR
  } else {
    textContent = _workCell.getChars() || WHITESPACE_CELL_CHAR
  }

  let fg = _workCell.getFgColor()
  let fgColorMode = _workCell.getFgColorMode()
  let bg = _workCell.getBgColor()
  let bgColorMode = _workCell.getBgColorMode()
  const isInverse = !!_workCell.isInverse()
  if (isInverse) {
    const temp = fg
    fg = bg
    bg = temp
    const temp2 = fgColorMode
    fgColorMode = bgColorMode
    bgColorMode = temp2
  }

  // Foreground
  switch (fgColorMode) {
    case Attributes.CM_P16:
    case Attributes.CM_P256:
      // if (_workCell.isBold() && fg < 8 && this._optionsService.options.drawBoldTextInBrightColors) {
      // fg += 8;
      // }
      // if (!this._applyMinimumContrast(charElement, this._colors.background, this._colors.ansi[fg])) {
      classList.push(`xterm-fg-${fg}`)
      // }
      break
    case Attributes.CM_RGB:
      /* const color = rgba.toColor(
        (fg >> 16) & 0xFF,
        (fg >>  8) & 0xFF,
        (fg      ) & 0xFF
      ); */
      // if (!this._applyMinimumContrast(charElement, this._colors.background, color)) {
      style['color'] = `#${padStart(fg.toString(16), '0', 6)}`
      // }
      break
    case Attributes.CM_DEFAULT:
    default:
      // if (!this._applyMinimumContrast(charElement, this._colors.background, this._colors.foreground)) {
      if (isInverse) {
        classList.push(`xterm-fg-${INVERTED_DEFAULT_COLOR}`)
      }
    // }
  }

  // Background
  switch (bgColorMode) {
    case Attributes.CM_P16:
    case Attributes.CM_P256:
      classList.push(`xterm-bg-${bg}`)
      break
    case Attributes.CM_RGB:
      style['background-color'] = `#${padStart(bg.toString(16), '0', 6)}`
      break
    case Attributes.CM_DEFAULT:
    default:
      if (isInverse) {
        classList.push(`xterm-bg-${INVERTED_DEFAULT_COLOR}`)
      }
  }

  return {
    classList,
    textContent,
    style
  }
}
