import Router from "@koa/router"
import fs from "fs"
import { Context, State } from "./commons"

const LATEST_VERSION = "latest"
const NIGHTLY_VERSION = "nightly"

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

export function getRouter(): Router<State, Context> {
  const versions = fs.readdirSync("data")
  const router = getEmptyRouter(versions)
  const availableVersions: string[] = []

  // Sort versions by name, to get the latest version first
  // and the nightly version last
  const sortedVersions: string[] = versions.sort((a, b) => {
    if (a === NIGHTLY_VERSION) return 1
    if (b === NIGHTLY_VERSION) return -1
    return a.localeCompare(b)
  })

  sortedVersions.forEach(async (version) => {
    const addedVersion = addVersionRoutes(router, version)
    if (addedVersion) {
      availableVersions.push(addedVersion)
    }
  })

  const latestVersion = sortedVersions[0]
  addVersionRoutes(router, latestVersion, LATEST_VERSION)
  availableVersions.push(LATEST_VERSION)

  router.get("/versions", (ctx) => (ctx.body = availableVersions))

  return router
}

function addVersionRoutes(
  router: Router<State, Context>,
  version: string,
  versionName: string = version,
) {
  console.log(`[INFO] - Adding routes for version ${versionName} (${version})`)

  if (!fs.existsSync(`data/${version}/supportedRegions.json`)) {
    console.warn(
      `[WARN] - No supportedRegions.json file found for version ${version}, skipping...`,
    )
    return
  }

  const supportedRegions: SupportedRegions = JSON.parse(
    fs.readFileSync(`data/${version}/supportedRegions.json`, "utf-8"),
  )
  const supportedRegionsValues = Object.values(supportedRegions)
  if (supportedRegionsValues.length === 0) {
    console.warn(
      `[WARN] - No supported regions for the version ${version}, skipping...`,
    )
    return
  }

  const supportedLanguages = Object.keys(Object.values(supportedRegions)[0])
  router.get(`/${versionName}`, (ctx) => {
    ctx.type = "application/json"
    ctx.body = {
      version,
      languages: supportedLanguages,
      regions: supportedRegions,
    }
  })

  supportedLanguages.map((lang) => {
    fs.readFile(`data/${version}/personas-${lang}.json`, (err, data) => {
      if (err) throw err

      router.get(`/${versionName}/${lang}/personas`, (ctx) => {
        ctx.type = "application/json"
        ctx.body = JSON.parse(data.toString("utf-8"))
      })
    })
    ;(Object.keys(supportedRegions) as RegionCode[]).map(
      (region: RegionCode) => {
        addAPIRoutes(lang, region, version, versionName, router)
        addAPIRoutes(lang, region, version, versionName, router, true)
      },
    )
  })
  return versionName
}

// TODO: validate inputs
function addAPIRoutes(
  lang: string,
  region: RegionCode,
  version: string,
  versionRoute: string,
  router: Router<State, Context>,
  optim?: boolean,
) {
  fs.readFile(
    `data/${version}/co2-model.${region}-lang.${lang}${
      optim ? "-opti" : ""
    }.json`,
    (err, data) => {
      if (err) throw err
      const rules = JSON.parse(data.toString("utf-8"))

      const route = `/${versionRoute}/${lang}/${region}/${
        optim ? "optim-" : ""
      }rules`
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
    },
  )
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
<li><code>/{version}</code> :retourne les langues et régions supportées par la version <code>{version}</code></li>
<li><code>&lt;version&gt;/&lt;langue&gt;/personas</code> : retourne l’ensemble des personas du modèle</li>
<li><code>&lt;version&gt;/&lt;langue&gt;/&lt;region&gt;/rules/</code> - retourne l’ensemble des règles du modèle</li>
<li><code>&lt;version&gt;/&lt;langue&gt;/&lt;region&gt;/optim-rules/</code> - retourne l’ensemble des règles optimisées du modèle</li>
<li><code>&lt;version&gt;/&lt;langue&gt;/&lt;region&gt;/rules/&lt;rule&gt;</code> - retourne la règle <code>{rule}</code> du modèle</li>
</ul>
`
  })
  return router
}
