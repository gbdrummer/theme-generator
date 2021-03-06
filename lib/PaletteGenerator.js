import Color from './Color.js'

class PaletteGenerator {
  #cfg
  #contrast
  #brightness
  #initialContrast
  background

  constructor (cfg) {
    this.#cfg = cfg
    this.#contrast = cfg.contrast ?? 1.618033988749895
    this.#brightness = cfg.brightness ?? 1
    this.#initialContrast = Math.pow(this.#contrast - 1, 3)
    this.background = new Color(cfg.background ?? `${Math.round(255 * this.#initialContrast)},`.repeat(3).split(',').map(str => parseInt(str)))
  }

  get colors () {
    return {
      background: this.background.rgb,
      steps: this.steps.map(color => color.rgb)
    }
  }

  get steps () {
    return this.#getSteps(this.background.rgb)
  }

  #getSteps ({ r, g, b }) {
    const multiplier = this.#contrast - 1
    let ratio = multiplier

    return [0,0,0,0,0].reduce((steps, step, index) => {
      if (index > 0) {
        const previous = index === 1 ? this.background : steps[index - 1]
        steps[index] = this.#generateColor(previous, ratio)
        ratio *= multiplier
      }

      return steps
    }, [this.#generateColor(this.background, this.#initialContrast + this.#contrast - 1)])
  }

  #generateColor (base, multiplier) {
    return new Color(base.rgb.map((value, index) => {
      const bg = this.background[index]
      return (Math.round((255 - bg) * multiplier + bg)) * this.#brightness
    }))
  }
}

export { PaletteGenerator as default }