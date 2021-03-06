class ThemeGenerator {
  #cfg
  #defaultName = 'Untitled'
  #ratio = 1.618033988749895
  #contrast = 1 - this.#ratio

  constructor (cfg) {
    this.#cfg = cfg

    if (!cfg.name) {
      console.warn(`Theme config does not contain a "name" property. Defaulting to "${this.#defaultName}"`)
    }

    this.name = cfg.name ?? this.#defaultName
  }

  generate () {

  }

  getColorSteps (r, g, b) {

  }
}

export { ThemeGenerator as default }