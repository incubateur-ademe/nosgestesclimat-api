import cors from "@koa/cors";
import Router from "@koa/router";
import { koaMiddleware as publicodesAPI } from "@publicodes/api";
import Koa from "koa";
import Engine from "publicodes";
import { readFileSync } from "fs";

interface State extends Koa.DefaultState {}
interface Context extends Koa.DefaultContext {}
const app = new Koa<State, Context>();
const router = new Router<State, Context>();

const origin =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://nosgestesclimat-api.osc-fr1.scalingo.io";

app.use(cors({ origin }));

// Create middleware with your Engine
const apiRoutes = publicodesAPI(
  new Engine(
    JSON.parse(readFileSync("data/1.6.0/co2-model.FR-lang.fr.json", "utf-8")),
  ),
);

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
	`;
});

// Basic routes usage (/evaluate, /rules, etc.)
router.use(apiRoutes);

// Or use with specific route prefix (/v1/evaluate, /v1/rules, etc.)
router.use("/v1", apiRoutes);

app.use(router.routes());
app.use(router.allowedMethods());

const port = 3002;

app.listen(port, function () {
  console.log("listening on port:", port);
});
