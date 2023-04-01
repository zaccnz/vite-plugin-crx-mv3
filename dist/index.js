"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  default: () => crxMV3
});
module.exports = __toCommonJS(src_exports);

// node_modules/.pnpm/tsup@6.3.0_typescript@4.8.4/node_modules/tsup/assets/cjs_shims.js
var getImportMetaUrl = () => typeof document === "undefined" ? new URL("file:" + __filename).href : document.currentScript && document.currentScript.src || new URL("main.js", document.baseURI).href;
var importMetaUrl = /* @__PURE__ */ getImportMetaUrl();

// src/index.ts
var import_ws = require("ws");
var import_path7 = require("path");

// src/utils.ts
var import_os = __toESM(require("os"));
var import_path = require("path");
var import_promises = require("fs/promises");
function isJsonString(str) {
  try {
    return !!(JSON.parse(str) && str);
  } catch (e) {
    return false;
  }
}
function slash(p) {
  return p.replace(/\\/g, "/");
}
function normalizePath(id) {
  return import_path.posix.normalize(import_os.default.platform() === "win32" ? slash(id) : id);
}
function normalizePathResolve(p1, p2) {
  return normalizePath((0, import_path.resolve)(p1, p2));
}
var normalizeJsFilename = (p) => p.replace(/\.[tj]sx?/, ".js");
var normalizeCssFilename = (p) => p.replace(/\.(less|scss)/, ".css");
function relaceCssUrlPrefix(code) {
  return code.replace(/(?<=url\()[\s\S]*?(?=\))/gm, function(str) {
    return "chrome-extension://" + slash((0, import_path.join)("__MSG_@@extension_id__", str.trim()));
  });
}
function relaceResourcePathPrefix(code) {
  return code.replace(
    /(?<=(=))"[^(?!")]+(\.png|jpg|jpeg|svg|webp|gif|mp3|mp4|avi|rmvb|mpeg|ra|ram|mov|wmv|pdf)"(?=,|;)/gm,
    function(str) {
      return str.startsWith("http") ? str : `chrome.runtime.getURL(${str})`;
    }
  );
}
function isObject(value) {
  return Object.prototype.toString.call(value) === "[object Object]";
}
var isString = (value) => typeof value === "string";
async function emitFile(path, content) {
  try {
    let dirName = (0, import_path.dirname)(path);
    const isDirExist = await (0, import_promises.access)(dirName).then(() => true).catch(() => false);
    if (!isDirExist) {
      await (0, import_promises.mkdir)(dirName);
      await emitFile(path, content);
    } else {
      await (0, import_promises.writeFile)(path, content);
    }
  } catch (error) {
    console.log(error);
  }
}
async function getContentFromCache(context, id, getContentAsyncFun) {
  let content;
  if (!context.cache.has(id)) {
    content = await getContentAsyncFun;
    context.cache.set(id, content);
  } else {
    content = context.cache.get(id);
  }
  return content;
}

// src/processors/manifest.ts
var import_rollup = __toESM(require("rollup"));
var import_promises4 = require("fs/promises");
var import_path6 = require("path");

// src/constants.ts
var VITE_PLUGIN_CRX_MV3 = "vite-plugin-crx-mv3";
var UPDATE_CONTENT = "UPDATE_CONTENT";
var CONTENT_SCRIPT_DEV_PATH = "content-dev.js";
var SERVICE_WORK_DEV_PATH = "background-dev.js";
var stubId = "/@crx/stub";

// src/processors/asset.ts
var import_path4 = require("path");
var import_promises2 = require("fs/promises");

// src/compiler/compile-sass.ts
var import_path2 = require("path");
var import_module = require("module");
var require2 = (0, import_module.createRequire)(importMetaUrl);
var tildeImporter = (url) => {
  if (url.includes("~")) {
    url = url.replace("~", "");
    if (!url.includes(".scss")) {
      url += ".scss";
    }
    url = require2.resolve(url);
  }
  return { file: url };
};
async function compileSass(context, originalPath, fullPath) {
  const { renderSync } = require2("sass");
  const { css } = renderSync({ file: fullPath, importer: tildeImporter });
  context.emitFile({
    type: "asset",
    source: css,
    fileName: (0, import_path2.normalize)(normalizeCssFilename(originalPath))
  });
}

// src/compiler/compile-less.ts
var import_fs = require("fs");
var import_path3 = require("path");
var import_module2 = require("module");
var require3 = (0, import_module2.createRequire)(importMetaUrl);
async function compileLess(context, originalPath, fullPath) {
  const less = require3("less");
  const source = (0, import_fs.readFileSync)(fullPath, "utf8");
  const { css } = await less.render(source, {
    paths: [process.cwd()],
    compress: true
  });
  context.emitFile({
    type: "asset",
    source: css,
    fileName: (0, import_path3.normalize)(normalizeCssFilename(originalPath))
  });
}

// src/processors/asset.ts
async function emitAsset(context, originalPath, fullPath) {
  if (originalPath.endsWith(".less")) {
    await compileLess(context, originalPath, fullPath);
  } else if (originalPath.endsWith(".scss")) {
    await compileSass(context, originalPath, fullPath);
  } else {
    let content = await getContentFromCache(
      context,
      fullPath,
      (0, import_promises2.readFile)(fullPath)
    );
    context.emitFile({
      type: "asset",
      source: content,
      fileName: (0, import_path4.normalize)(originalPath)
    });
  }
}

// src/processors/background.ts
var dynamicImportAssetRex = /(?<=(chrome|browser|Browser).scripting.(insertCSS|removeCSS)\()[\s\S]*?(?=\))/gm;
var dynamicImportScriptRex = /(?<=(chrome|browser|Browser).scripting.executeScript\()[\s\S]*?(?=\))/gm;
async function generageDynamicImportScript(context, manifestContext, code) {
  let sources = [];
  let content = code.replace(
    dynamicImportScriptRex,
    (match) => match.replace(/(?<=(files:\[)?)["|'][\s\S]*?["|'](?=\]?)/gm, (fileStr) => {
      const filePath = fileStr.replace(/"|'/g, "").trim();
      sources.push(filePath);
      return `"${normalizeJsFilename(filePath)}"`;
    })
  );
  for (const filePath of sources) {
    if (/\.(js|ts)$/.test(filePath)) {
      await manifestContext.doBuild(context, filePath);
    }
  }
  return content;
}
async function generageDynamicImportAsset(context, manifestContext, code) {
  let filePath = "";
  let content = code.replace(
    dynamicImportAssetRex,
    (match) => match.replace(/(?<=(files:\[)?)["|'][\s\S]*?["|'](?=\]?)/gm, (fileStr) => {
      filePath = fileStr.replace(/"|'/g, "").trim();
      return `"${normalizeCssFilename(filePath)}"`;
    })
  );
  if (filePath) {
    let fullPath = normalizePathResolve(manifestContext.srcDir, filePath);
    emitAsset(context, filePath, fullPath);
  }
  return content;
}

// src/processors/content-scripts.ts
var import_path5 = require("path");
var import_promises3 = require("fs/promises");
var dynamicImportRex = /(?<=chrome.runtime.getURL\()[\s\S]*?(?=\))/gm;
async function generageDynamicImportScript2(context, manifestContext, code) {
  let sources = [];
  let content = code.replace(dynamicImportRex, (filePath) => {
    filePath = filePath.replace(/"|'/g, "").trim();
    sources.push(filePath);
    let normalizePath2 = normalizeJsFilename(normalizeCssFilename(filePath));
    return `"${normalizePath2}"`;
  });
  for (const filePath of sources) {
    if (/\.(js|ts)$/.test(filePath)) {
      await manifestContext.doBuild(context, filePath);
    } else {
      if (!filePath.endsWith(".html")) {
        let fullPath = (0, import_path5.resolve)(manifestContext.srcDir, filePath);
        await emitAsset(context, filePath, fullPath);
      }
    }
  }
  return content;
}
async function emitDevScript(context, port, manifestContext) {
  let viteConfig = manifestContext.options.viteConfig;
  let manifest = manifestContext.manifest;
  let serviceWorkerPath = manifestContext.serviceWorkerAbsolutePath;
  let contentScripts = manifest == null ? void 0 : manifest.content_scripts;
  if (viteConfig.mode === "production")
    return manifest;
  if (!serviceWorkerPath && (contentScripts == null ? void 0 : contentScripts.length)) {
    let backgroundPath = normalizePathResolve(__dirname, "client/background.js");
    let content = await getContentFromCache(
      context,
      backgroundPath,
      (0, import_promises3.readFile)(backgroundPath, "utf8")
    );
    manifest.background = {
      service_worker: SERVICE_WORK_DEV_PATH
    };
    context.emitFile({
      type: "asset",
      source: content,
      fileName: SERVICE_WORK_DEV_PATH
    });
  }
  if (!manifestContext.manifest.content_scripts) {
    manifest.content_scripts = [];
  }
  if (serviceWorkerPath || (contentScripts == null ? void 0 : contentScripts.length)) {
    let code = `var PORT=${port},MENIFEST_NAME='${manifest.name}';`;
    let contentScriptDevPath = normalizePathResolve(
      __dirname,
      "client/content.js"
    );
    let content = await getContentFromCache(
      context,
      contentScriptDevPath,
      (0, import_promises3.readFile)(contentScriptDevPath, "utf8")
    );
    context.emitFile({
      type: "asset",
      source: code + content,
      fileName: CONTENT_SCRIPT_DEV_PATH
    });
    manifest.content_scripts = [
      ...manifest.content_scripts,
      {
        matches: ["<all_urls>"],
        js: [CONTENT_SCRIPT_DEV_PATH]
      }
    ];
  }
  return manifest;
}

// src/processors/manifest.ts
var ManifestProcessor = class {
  cache = /* @__PURE__ */ new Map();
  plugins = [];
  assetPaths = [];
  contentScriptChunkModules = [];
  webAccessibleResources = [];
  srcDir;
  serviceWorkerAbsolutePath;
  manifest = {};
  options;
  packageJsonPath = "";
  constructor(options) {
    this.options = options;
    this.srcDir = (0, import_path6.dirname)(options.manifestPath);
    this.plugins = options.viteConfig.plugins.filter(
      (p) => p.name !== VITE_PLUGIN_CRX_MV3
    );
    let manifestAbsolutPath = normalizePathResolve(
      options.viteConfig.root,
      options.manifestPath
    );
    try {
      this.packageJsonPath = normalizePath((0, import_path6.join)(process.cwd(), "package.json"));
    } catch (error) {
    }
    this.watchPackageJson(this.packageJsonPath);
    this.loadManifest(manifestAbsolutPath);
  }
  watchPackageJson(input) {
    if (!input)
      return;
    const watcher = import_rollup.default.watch({ input });
    watcher.on("event", (event) => {
      if (event.code == "START") {
        this.cache.delete(input);
      }
    });
  }
  async doBuild(context, filePath) {
    const { rollup: rollup2 } = await import("rollup");
    const fileFullPath = normalizePathResolve(this.srcDir, filePath);
    context.addWatchFile(fileFullPath);
    const bundle = await rollup2({
      context: "globalThis",
      input: fileFullPath,
      plugins: this.plugins,
      cache: this.cache.get(fileFullPath)
    });
    if (!this.cache.has(fileFullPath)) {
      this.cache.set(fileFullPath, bundle.cache);
    }
    try {
      const { output } = await bundle.generate({
        entryFileNames: normalizeJsFilename(filePath)
      });
      const outputChunk = output[0];
      context.emitFile({
        type: "asset",
        source: outputChunk.code,
        fileName: outputChunk.fileName
      });
    } finally {
      await bundle.close();
    }
  }
  async loadManifest(manifestPath) {
    var _a;
    let packageJson = {};
    if (this.packageJsonPath) {
      let content = await getContentFromCache(
        this,
        this.packageJsonPath,
        (0, import_promises4.readFile)(this.packageJsonPath, "utf-8")
      );
      packageJson = JSON.parse(content);
    }
    let manifestContent = await getContentFromCache(
      this,
      manifestPath,
      (0, import_promises4.readFile)(manifestPath, "utf8")
    );
    if (!isJsonString(manifestContent)) {
      throw new Error("The manifest.json is not valid.");
    }
    const manifest = JSON.parse(manifestContent);
    manifest.name = !manifest.name || manifest.name == "auto" ? packageJson.name : manifest.name;
    manifest.version = !manifest.version || manifest.version == "auto" ? packageJson.version : manifest.version;
    if (!manifest.name) {
      throw new Error("The name field of manifest.json is required.");
    }
    if (!manifest.version) {
      throw new Error("The version field of manifest.json is required.");
    }
    if (!manifest.manifest_version) {
      throw new Error(
        "The manifest_version field of manifest.json is required."
      );
    }
    this.manifest = manifest;
    let serviceworkerPath = (_a = this.manifest.background) == null ? void 0 : _a.service_worker;
    this.serviceWorkerAbsolutePath = serviceworkerPath ? normalizePathResolve(this.srcDir, serviceworkerPath) : "";
  }
  async reLoadManifest(manifestPath) {
    await this.loadManifest(manifestPath);
    this.webAccessibleResources = [];
  }
  clearCacheById(context, id) {
    if (context.cache.has(id)) {
      context.cache.delete(id);
    }
    if (this.cache.has(id)) {
      this.cache.delete(id);
    }
  }
  getHtmlPaths() {
    var _a, _b, _c;
    const manifest = this.manifest;
    return [
      (_a = manifest.action) == null ? void 0 : _a.default_popup,
      Object.values(manifest.chrome_url_overrides ?? {}),
      manifest.devtools_page,
      manifest.options_page,
      (_b = manifest.options_ui) == null ? void 0 : _b.page,
      (_c = manifest.sandbox) == null ? void 0 : _c.pages,
      ...(manifest.web_accessible_resources ?? []).map((resource) => resource.resources).flat().filter((resource) => resource.endsWith(".html"))
    ].flat().filter((x) => isString(x)).map((p) => (0, import_path6.resolve)(this.srcDir, p));
  }
  getContentScriptPaths() {
    let paths = [];
    for (const item of this.manifest.content_scripts ?? []) {
      if (Array.isArray(item.js)) {
        paths = [...paths, ...item.js];
      }
    }
    return paths.map((p) => normalizePathResolve(this.srcDir, p));
  }
  async transform(code, id, context) {
    let data = "";
    if (this.serviceWorkerAbsolutePath === id) {
      let backgroundPath = normalizePathResolve(
        __dirname,
        "client/background.js"
      );
      let content = await getContentFromCache(
        context,
        backgroundPath,
        (0, import_promises4.readFile)(backgroundPath, "utf8")
      );
      data += content;
    }
    code = await generageDynamicImportScript2(
      context,
      this,
      code
    );
    code = await generageDynamicImportScript(
      context,
      this,
      code
    );
    code = await generageDynamicImportAsset(context, this, code);
    return data + code;
  }
  async generateDevScript(context, port) {
    this.manifest = await emitDevScript(context, port, this);
  }
  fixManifestPath(path) {
    const manifestDir = normalizePathResolve(
      this.options.viteConfig.root,
      (0, import_path6.dirname)(this.options.manifestPath)
    );
    const fileDir = normalizePathResolve(manifestDir, path);
    try {
      const [_, path2] = fileDir.split(this.options.viteConfig.root + "/");
      return path2;
    } catch {
      return (0, import_path6.basename)(path);
    }
  }
  async generateManifest(context, bundle, bundleMap) {
    var _a, _b, _c, _d;
    let manifest = this.manifest;
    for (const item of manifest.content_scripts ?? []) {
      for (const [index, css] of (item.css ?? []).entries()) {
        if (item.css) {
          item.css[index] = normalizeCssFilename(css);
        }
      }
      for (const [index, script] of (item.js ?? []).entries()) {
        let scriptAbsolutePath = normalizePathResolve(this.srcDir, script);
        let chunk = bundleMap[scriptAbsolutePath];
        if (chunk) {
          let importedCss = [...chunk.viteMetadata.importedCss];
          let importedAssets = [...chunk.viteMetadata.importedAssets];
          this.webAccessibleResources = [
            ...this.webAccessibleResources,
            ...importedCss,
            ...importedAssets,
            ...chunk.imports,
            chunk.fileName
          ];
          for (const chunkImport of chunk.imports) {
            if (bundle[chunkImport]) {
              let importedCss2 = bundle[chunkImport].viteMetadata.importedCss;
              item.css = [...item.css ?? [], ...importedCss2];
            }
          }
          if (importedCss.length) {
            item.css = [...item.css ?? [], ...importedCss];
          }
          item.js[index] = "contentscript-loader-" + (0, import_path6.basename)(chunk.fileName);
          let content = `(function () {
            (async () => {
                  await import(
                    chrome.runtime.getURL("${chunk.fileName}")
                  );
                })().catch(console.error);
            })();`;
          let outDir = this.options.viteConfig.build.outDir;
          let outputPath = outDir + "/" + item.js[index];
          await emitFile(outputPath, content);
          console.log(`
${outDir}/\x1B[32m${item.js[index]}\x1B[`);
        }
      }
    }
    if (this.serviceWorkerAbsolutePath) {
      manifest.background = {
        ...manifest.background,
        service_worker: bundleMap[this.serviceWorkerAbsolutePath].fileName
      };
    }
    if ((_a = manifest.action) == null ? void 0 : _a.default_popup) {
      manifest.action.default_popup = this.fixManifestPath(manifest.action.default_popup);
    }
    if (manifest.devtools_page) {
      manifest.devtools_page = this.fixManifestPath(manifest.devtools_page);
    }
    if (manifest.options_page) {
      manifest.options_page = this.fixManifestPath(manifest.options_page);
    }
    if ((_b = manifest.options_ui) == null ? void 0 : _b.page) {
      manifest.options_ui.page = this.fixManifestPath(manifest.options_ui.page);
    }
    if ((_c = manifest.sandbox) == null ? void 0 : _c.pages) {
      manifest.sandbox.pages = manifest.sandbox.pages.map(
        (page) => this.fixManifestPath(page)
      );
    }
    for (const key of Object.keys(manifest.chrome_url_overrides || {})) {
      if ((_d = manifest.chrome_url_overrides) == null ? void 0 : _d[key]) {
        manifest.chrome_url_overrides[key] = (0, import_path6.basename)(
          manifest.chrome_url_overrides[key]
        );
      }
    }
    if (this.webAccessibleResources.length) {
      manifest.web_accessible_resources = [
        ...manifest.web_accessible_resources ?? [],
        {
          matches: ["<all_urls>"],
          resources: this.webAccessibleResources,
          use_dynamic_url: true
        }
      ];
    }
    context.emitFile({
      type: "asset",
      source: JSON.stringify(manifest, null, 2),
      fileName: "manifest.json"
    });
  }
  getAssetPaths() {
    var _a, _b;
    let assetPaths = [];
    const defaultIcon = (_b = (_a = this.manifest) == null ? void 0 : _a.action) == null ? void 0 : _b.default_icon;
    if (defaultIcon && isString(defaultIcon)) {
      assetPaths = [defaultIcon];
    } else if (isObject(defaultIcon)) {
      let defaultIconPaths = Object.values(defaultIcon);
      assetPaths = [...assetPaths, ...defaultIconPaths];
    }
    if (isObject(this.manifest.icons)) {
      let iconPaths = Object.values(this.manifest.icons);
      assetPaths = [...assetPaths, ...iconPaths];
    }
    if (Array.isArray(this.manifest.content_scripts)) {
      this.manifest.content_scripts.forEach((item) => {
        if (Array.isArray(item.css)) {
          assetPaths = [...assetPaths, ...item.css];
        }
      });
    }
    return assetPaths;
  }
  async generateAsset(context) {
    this.assetPaths = this.getAssetPaths();
    for (const path of this.assetPaths) {
      let fullPath = normalizePathResolve(this.srcDir, path);
      context.addWatchFile(fullPath);
      emitAsset(context, path, fullPath);
    }
  }
};

// src/http.ts
var import_http = require("http");
async function httpServerStart(port) {
  const server = (0, import_http.createServer)();
  return new Promise((resolve5, reject) => {
    const onError = (e) => {
      if (e.code === "EADDRINUSE") {
        console.log(`Port ${port} is in use, trying another one...`);
        server.listen(++port);
      } else {
        server.removeListener("error", onError);
        reject(e);
      }
    };
    server.on("error", onError);
    server.listen(port, () => {
      console.log("WebSocket server started on port: ", port);
      server.removeListener("error", onError);
      resolve5({ port, server });
    });
  });
}

// src/index.ts
function crxMV3(options = {}) {
  let { port = 8181, manifest = "" } = options;
  if (!manifest || typeof manifest != "string" || typeof manifest == "string" && !manifest.endsWith("manifest.json")) {
    throw new Error(
      "The manifest parameter is required and the value must be the path to the chrome extension's manifest.json."
    );
  }
  let socket;
  let changedFilePath = "";
  let manifestAbsolutPath;
  let manifestProcessor;
  let srcDir = (0, import_path7.dirname)(manifest);
  let config;
  let popupAbsolutePath = "";
  let popupMoudles = [];
  async function websocketServerStart(manifest2) {
    var _a, _b;
    if (config.mode === "production" || !((_a = manifest2 == null ? void 0 : manifest2.background) == null ? void 0 : _a.service_worker) && !((_b = manifest2 == null ? void 0 : manifest2.content_scripts) == null ? void 0 : _b.length)) {
      return;
    }
    const serverOptions = await httpServerStart(port);
    const server = serverOptions.server;
    port = serverOptions.port;
    const wss = new import_ws.WebSocketServer({ noServer: true });
    wss.on("connection", function connection(ws) {
      console.log(`\x1B[32m[${VITE_PLUGIN_CRX_MV3}]\x1B[0m client connected.`);
      ws.on("message", () => {
        ws.send("keep websocket alive.");
      });
      ws.on("close", () => {
        console.log(
          `\x1B[32m[${VITE_PLUGIN_CRX_MV3}]\x1B[0m client disconnected.`
        );
      });
      socket = ws;
    });
    server.on("upgrade", function upgrade(request, socket2, head) {
      if (request.url === `/${manifest2.name}/crx`) {
        wss.handleUpgrade(request, socket2, head, function done(ws) {
          wss.emit("connection", ws, request);
        });
      } else {
        socket2.destroy();
      }
    });
  }
  return {
    name: VITE_PLUGIN_CRX_MV3,
    apply: "build",
    async configResolved(_config) {
      var _a;
      config = _config;
      manifestAbsolutPath = normalizePathResolve(config.root, manifest);
      manifestProcessor = new ManifestProcessor({
        manifestPath: manifest,
        viteConfig: config
      });
      await manifestProcessor.loadManifest(manifestAbsolutPath);
      await websocketServerStart(manifestProcessor.manifest);
      let defaultPopupPath = (_a = manifestProcessor.manifest.action) == null ? void 0 : _a.default_popup;
      if (defaultPopupPath) {
        popupAbsolutePath = normalizePathResolve(srcDir, defaultPopupPath);
      }
    },
    async options({ input, ...options2 }) {
      await manifestProcessor.reLoadManifest(manifestAbsolutPath);
      let htmlPaths = manifestProcessor.getHtmlPaths();
      let contentScriptPaths = manifestProcessor.getContentScriptPaths();
      let buildInput = config.build.rollupOptions.input;
      let finalInput = input;
      let serviceWorkerPath = manifestProcessor.serviceWorkerAbsolutePath ? [manifestProcessor.serviceWorkerAbsolutePath] : [];
      if (Array.isArray(buildInput)) {
        finalInput = [
          ...buildInput,
          ...htmlPaths,
          ...contentScriptPaths,
          ...serviceWorkerPath,
          stubId
        ];
      } else if (isObject(buildInput)) {
        const entryObj = { stub: stubId };
        for (const item of [
          ...htmlPaths,
          ...contentScriptPaths,
          ...serviceWorkerPath
        ]) {
          const name = (0, import_path7.basename)(item, (0, import_path7.extname)(item));
          entryObj[name] = (0, import_path7.resolve)(srcDir, item);
        }
        finalInput = { ...buildInput, ...entryObj };
      } else {
        finalInput = [
          buildInput && isString(buildInput) ? buildInput : stubId,
          ...htmlPaths,
          ...contentScriptPaths,
          ...serviceWorkerPath
        ];
      }
      return { input: finalInput, ...options2 };
    },
    watchChange(id) {
      changedFilePath = normalizePath(id);
      manifestProcessor.clearCacheById(this, changedFilePath);
      console.log(`\x1B[35mFile change detected :\x1B[0m ${changedFilePath}`);
    },
    async buildStart() {
      this.addWatchFile(manifestAbsolutPath);
      await manifestProcessor.generateDevScript(this, port);
      await manifestProcessor.generateAsset(this);
    },
    transform(code, id) {
      return manifestProcessor.transform(code, id, this);
    },
    resolveId(source) {
      if (source === stubId)
        return stubId;
      return null;
    },
    load(id) {
      if (id === stubId)
        return `console.log('stub')`;
      return null;
    },
    async generateBundle(options2, bundle) {
      let bundleMap = {};
      let contentScriptPaths = manifestProcessor.getContentScriptPaths();
      let contentScriptImportedCss = [];
      for (const [key, chunk] of Object.entries(bundle)) {
        if (chunk.type === "chunk" && chunk.facadeModuleId) {
          if (chunk.facadeModuleId === stubId) {
            delete bundle[key];
          } else if (chunk.facadeModuleId === popupAbsolutePath) {
            popupMoudles = Object.keys(chunk.modules);
          } else {
            bundleMap[chunk.facadeModuleId] = chunk;
            if (contentScriptPaths.includes(chunk.facadeModuleId)) {
              let output = bundle[key];
              output.code = relaceResourcePathPrefix(output.code);
              contentScriptImportedCss = [
                ...contentScriptImportedCss,
                ...output.viteMetadata.importedCss
              ];
            }
          }
        }
      }
      for (const fileName of contentScriptImportedCss) {
        let output = bundle[fileName];
        output.source = isString(output.source) ? relaceCssUrlPrefix(output.source) : "";
      }
      await manifestProcessor.generateManifest(this, bundle, bundleMap);
    },
    writeBundle() {
      if (socket) {
        if (!popupMoudles.includes(changedFilePath)) {
          socket.send(UPDATE_CONTENT);
        }
      }
    }
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
