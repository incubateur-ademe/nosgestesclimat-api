import cors from "@koa/cors"
import Koa from "koa"
import { Context, State } from "./commons"
import { getRouter } from "./getRouter"

const app = new Koa<State, Context>()

const origin =
  process.env.NODE_ENV === "development"
    ? "http://localhost"
    : "https://nosgestesclimat-api.osc-fr1.scalingo.io"

app.use(cors({ origin }))

const router = getRouter()
app.use(router.routes())
app.use(router.allowedMethods())

app.on("error", (err, ctx) => {
  console.error("server error", err, ctx)
})

const port = process.env.PORT || 3000

app.listen(port, function () {
  console.log(`listening on: ${origin}:${port}`)
})
