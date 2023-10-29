import Router from "@koa/router"
import { koaMiddleware as publicodesAPI } from "@publicodes/api"
import fs from "fs"
import Engine from "publicodes"
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

export function getRouter(): Router<State, Context> {
  const versions = fs.readdirSync("data")
  const router = getEmptyRouter()
  const availableVersions: string[] = []

  // Create middleware with your Engine
  // const apiRoutes = publicodesAPI(
  //   new Engine(
  //     JSON.parse(
  //       fs.readFileSync("data/preprod/co2-model.FR-lang.fr.json", "utf-8"),
  //     ),
  //   ),
  // )

  // Basic routes usage (/evaluate, /rules, etc.)
  // router.use(`/preprod/fr/FR`, apiRoutes)

  versions.forEach((version) => {
    if (!fs.existsSync(`data/${version}/supportedRegions.json`)) {
      console.warn(
        `[WARN] - No supportedRegions.json file found for version ${version}, skipping...`,
      )
      return
    }
    availableVersions.push(version)

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
    router.get(`/${version}`, (ctx) => {
      ctx.body = {
        languages: supportedLanguages,
        regions: supportedRegions,
      }
    })

    supportedLanguages.forEach((language) => {
      Object.keys(supportedRegions).forEach((regionCode) => {
        // TODO: manage errors
        const modelPath = `data/${version}/co2-model.${regionCode}-lang.${language}.json`
        try {
          console.log(`[INFO] - Parsing ${modelPath}`)
          const rules = JSON.parse(
            fs.readFileSync(
              `data/${version}/co2-model.${regionCode}-lang.${language}.json`,
              "utf-8",
            ),
          )
          const apiRoutes = publicodesAPI(new Engine(rules))
          router.use(`/${version}/${language}/${regionCode}`, apiRoutes)
          console.log(
            `[INFO] - Routes added for ${version}/${language}/${regionCode}`,
          )
        } catch (err) {
          console.error(
            "[ERROR] - While building API routes for version:",
            version,
            "language:",
            language,
            "region:",
            regionCode,
            "\n",
          )
          console.error(err)
        }
      })
    })
  })

  router.get("/versions", (ctx) => (ctx.body = availableVersions))

  return router
}

function getEmptyRouter(): Router<State, Context> {
  const router = new Router<State, Context>()
  router.get("/", (ctx) => {
    ctx.body = `
<h1>API REST du modèle Nos Gestes Climat</h1>

<h2>Endpoints</h2>

<ul>
	<li>
		<p>
			<code>POST</code> <code>/evaluate</code> Évalue une ou plusieurs expressions avec une situation donnée
		</p>
		<p>
	</li>
	<li>
		<p>
			<code>GET</code> <code>/rules</code> Retourne la liste de toutes vos règles
		</p>
	</li>
	<li>
		<p>
			<code>GET</code> <code>/rules/{rule}</code> Retourne une règle spécifique
		</p>
	</li>
</ul>

<p>See the <a href="https://publi.codes/docs/api/api-rest">documentation page</a> for more information.</p>
	`
  })
  return router
}
