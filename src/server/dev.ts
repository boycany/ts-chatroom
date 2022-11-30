import webpack from "webpack";
import webpackDevMiddleware from "webpack-dev-middleware";
import { Express } from "express";

export default function (app: Express) {
  const config = require("../../webpack.config.js");
  const compiler = webpack(config);

  app.get("/main", function (req, res, next) {
    res.redirect("/main/main.html");
  });

  app.get("/main2", function (req, res, next){
    res.redirect("/main2/main2.html")
  })

  app.get("/chatRoom", function (req, res, next) {
    res.redirect("/chatRoom/chatRoom.html");
  });

  app.get("/chatRoom2", function (req, res, next){
    res.redirect("/chatRoom2/chatRoom2.html")
  })

  app.use(
    webpackDevMiddleware(compiler, {
      publicPath: config.output.publicPath,
    })
  );
}
