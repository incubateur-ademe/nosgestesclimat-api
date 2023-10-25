import cors from "@koa/cors"
import Koa from "koa"
import { Context, State } from "./commons"
import { getRouter } from "./getRouter"

const app = new Koa<State, Context>()

const origin =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://nosgestesclimat-api.osc-fr1.scalingo.io"

app.use(cors({ origin }))

app.use(getRouter().routes())
app.use(getRouter().allowedMethods())

const port = process.env.PORT || 3001

app.listen(port, function () {
  console.log("listening on port:", port)
})
