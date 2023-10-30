import Router from "@koa/router"
import fs from "fs"
import { Context, State } from "./commons"

type Author = {
  nom: string
  url: string
}
type RegionCode = `${Uppercase<string>}`
type Region = {
  [language: string]: {
    nom: string
    code: RegionCode
    gentilé: string
    drapeau?: string
    authors?: Author[]
  }
}
type SupportedRegions = Record<RegionCode, Region>

export async function getRouter(): Promise<Router<State, Context>> {
  const versions = fs.readdirSync("data")
  const router = getEmptyRouter(versions)
  const availableVersions: string[] = []

  versions.forEach(async (version) => {
    if (!fs.existsSync(`data/${version}/supportedRegions.json`)) {
      console.warn(
        `[WARN] - No supportedRegions.json file found for version ${version}, skipping...`,
      )
      return
    }
    availableVersions.push(version)

    const supportedRegions: SupportedRegions = await Bun.file(
      `data/${version}/supportedRegions.json`,
    ).json()
    const supportedRegionsValues = Object.values(supportedRegions)
    if (supportedRegionsValues.length === 0) {
      console.warn(
        `[WARN] - No supported regions for the version ${version}, skipping...`,
      )
      return
    }

    const supportedLanguages = Object.keys(Object.values(supportedRegions)[0])
    router.get(`/${version}`, (ctx) => {
      ctx.body = {
        languages: supportedLanguages,
        regions: supportedRegions,
      }
    })

    supportedLanguages.map((lang) => {
      ;(Object.keys(supportedRegions) as RegionCode[]).map(
        (region: RegionCode) => {
          addAPIRoutes(lang, region, version, router)
          addAPIRoutes(lang, region, version, router, true)
        },
      )
    })
  })

  router.get("/versions", (ctx) => (ctx.body = availableVersions))

  return router
}

// TODO: valide inputs
async function addAPIRoutes(
  lang: string,
  region: RegionCode,
  version: string,
  router: Router<State, Context>,
  optim?: boolean,
): Promise<void> {
  const rules = await Bun.file(
    `data/${version}/co2-model.${region}-lang.${lang}${
      optim ? "-opti" : ""
    }.json`,
  ).json()

  const route = `/${version}/${lang}/${region}/${optim ? "optim-" : ""}rules`
  router.get(route, (ctx) => {
    ctx.type = "application/json"
    ctx.body = rules
  })
  router.get(`${route}/:rule`, (ctx) => {
    const { rule } = ctx.params
    ctx.type = "application/json"
    ctx.body = rules[rule]
  })
  console.log(`[INFO] - Routes added for ${route}`)
}

function getEmptyRouter(versions: string[]): Router<State, Context> {
  const router = new Router<State, Context>()
  router.get("/", (ctx) => {
    ctx.body = `
<h1 id="nosgestesclimat-api">nosgestesclimat-api</h1>
<p>API pour modèle Publicodes de Nos Gestes Climat.</p>
<h2 id="api">API</h2>
<p>Schéma général de l’API :</p>
<pre><code>https://data.nosgestesclimat.fr/&lt;version&gt;/&lt;langue&gt;/&lt;region&gt;</code></pre>
<p>Avec :</p>
<ul>
<li><code>version</code> - la version du modèle à utiliser (${versions
      .map((v) => `<code>${v}</code>`)
      .join(", ")})</li>
<li><code>langue</code> - la langue à utiliser (<code>fr</code> ou <code>en</code>)</li>
<li><code>region</code> - la région à utiliser (<code>FR</code>, <code>CA</code>, <code>BE</code>, <code>CH</code>, etc…)</li>
<li><code>/versions</code> : retourne l’ensemble des versions du modèle</li>
<li><code>/versions/{version}</code> :retourne les langues et régions supportées par la version <code>{version}</code></li>
<li><code>&lt;version&gt;/personas</code> : retourne l’ensemble des personas du modèle</li>
<li><code>&lt;version&gt;/&lt;langue&gt;/&lt;region&gt;/rules/</code> - retourne l’ensemble des règles du modèle</li>
<li><code>&lt;version&gt;/&lt;langue&gt;/&lt;region&gt;/optim-rules/</code> - retourne l’ensemble des règles optimisées du modèle</li>
<li><code>&lt;version&gt;/&lt;langue&gt;/&lt;region&gt;/rules/&lt;rule&gt;</code> - retourne la règle <code>{rule}</code> du modèle</li>
</ul>
`
  })
  return router
}
