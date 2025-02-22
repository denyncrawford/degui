import { App } from "https://deno.land/x/deno_koa@v1.0.4/mod.ts";
import { App as Astrodon } from "../../mod.ts";
import { lookup } from "https://deno.land/x/mrmime@v1.0.0/mod.ts";
import pack from "./dist/snapshot.b.ts";
import { flat } from "./utils.ts";

const snapshot = flat(pack);

const astrodonApp = await Astrodon.new();

await astrodonApp.registerWindow({
  title: "Vue Example",
  url: "http://localhost:3000/",
});

// Render

const app = new App();

app.use((ctx) => {
  const { url } = ctx;
  console.log(url);
  ctx.status = 200;
  if (url == "/" || url == "/index.html") {
    ctx.set("Content-Type", "text/html");
    ctx.body = snapshot["/index.html"];
    return;
  }
  ctx.set("Content-Type", lookup(url.split("/").pop()));
  ctx.body = snapshot[url];
});

app.listen({ port: 3000 });

console.log("server has started on http://localhost:3000 🚀");
console.log("running render process 🚀");
astrodonApp.run();
