import Router from "@koa/router"
import { koaMiddleware as publicodesAPI } from "@publicodes/api"
import { readFileSync } from "fs"
import Engine from "publicodes"
import { Context, State } from "./commons"

export function getRouter(): Router<State, Context> {
  const router = new Router<State, Context>()

  // Create middleware with your Engine
  const apiRoutes = publicodesAPI(
    new Engine(
      JSON.parse(
        readFileSync("data/preprod/co2-model.FR-lang.fr.json", "utf-8"),
      ),
    ),
  )

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

  // Basic routes usage (/evaluate, /rules, etc.)
  router.use(apiRoutes)

  // Or use with specific route prefix (/v1/evaluate, /v1/rules, etc.)
  router.use("/v1", apiRoutes)

  return router
}
