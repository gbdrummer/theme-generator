class Color {
  constructor ([r, g, b]) {
    this.r = r
    this.g = g
    this.b = b
  }

  get 0 () {
    return this.r
  }

  get 1 () {
    return this.g
  }

  get 2 () {
    return this.b
  }

  get rgb () {
    return [this.r, this.g, this.b]
  }
}

export { Color as default }