import { Command, Shell } from 'https://cdn.jsdelivr.net/npm/@author.io/shell@1.8.4/index.js'
import { existsSync } from "https://deno.land/std/fs/mod.ts"
import PaletteGenerator from './lib/PaletteGenerator.js'

const encoder = new TextEncoder('utf-8')
const decoder = new TextDecoder('utf-8')
const rawcfg = await Deno.readFile('./manifest.json').catch(console.log)
const cfg = JSON.parse(decoder.decode(rawcfg))

function populateTemplate (string, find, replace) {
    if ((/[a-zA-Z\_]+/g).test(string)) {
        return string.replace(new RegExp('\{\{(?:\\s+)?(' + find + ')(?:\\s+)?\}\}'), replace)
    } else {
        throw new Error("Find statement does not match regular expression: /[a-zA-Z\_]+/")
    }
}

const sh = new Shell({
  ...cfg,

  commands: [{
    name: 'make',
    description: 'Generate a new VSCode Theme package',
    arguments: ['cfgpath', 'outputdir'],

    async handler ({ data }) {
      let { cfgpath, outputdir } = data

      console.log(`Generating Theme...`)
      const json = await Deno.readFile(cfgpath).catch(console.error)
      const cfg = JSON.parse(decoder.decode(json))
      
      // const generator = new ThemeGenerator(cfg)
      const palette = new PaletteGenerator(cfg)
      let html = decoder.decode(await Deno.readFile('./src/index.html').catch(console.error))

      html = populateTemplate(html, 'bg', `rgb(${palette.background.rgb.join(', ')})`)

      palette.steps.forEach((step, index) => {
        html = populateTemplate(html, `c${index}`, `rgb(${step.rgb.join(', ')})`)
      })

      outputdir = outputdir ?? './dist'

      if (!existsSync(outputdir)) {
        await Deno.mkdir(outputdir)
      }

      console.log(`Writing index.html to ${await Deno.realPath(outputdir)}...`)
      await Deno.writeTextFile(`${outputdir}/index.html`, html)
    }
  }]
})

sh.exec(Deno.args.length === 0 ? '--help' : Deno.args)

