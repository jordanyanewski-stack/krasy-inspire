/* eslint-disable @typescript-eslint/no-require-imports -- isolated CommonJS loader tests the real TypeScript query module without a database */
const assert = require("node:assert/strict");
const fs = require("node:fs");
const ts = require("typescript");
const Module = require("node:module");
const { PgDialect } = require("drizzle-orm/pg-core");
const { pgTable, text, boolean, timestamp } = require("drizzle-orm/pg-core");
const posts=pgTable("posts",{slug:text("slug"),published:boolean("published"),date:timestamp("date")});
const conditions=[];
const chain={select(){return this},from(){return this},where(condition){conditions.push(condition);return this},orderBy(){return Promise.resolve([])},then(resolve){return Promise.resolve([]).then(resolve)}};
const code=ts.transpileModule(fs.readFileSync("src/lib/posts.ts","utf8"),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
const mod=new Module(__filename+"-posts",module);mod.filename=__filename;mod.paths=module.paths;
mod.require=(name)=>name==="@/db"?{getDb:()=>chain}:name==="@/db/schema"?{posts}:require(name);
mod._compile(code,mod.filename);
(async()=>{
 await mod.exports.getPublishedPosts();
 await assert.rejects(()=>mod.exports.getPublishedPost("draft-slug"));
 const dialect=new PgDialect();
 const list=dialect.sqlToQuery(conditions[0]),detail=dialect.sqlToQuery(conditions[1]);
 assert.match(list.sql,/published/);assert.deepEqual(list.params,[true]);
 assert.match(detail.sql,/slug.*and.*published/);assert.deepEqual(detail.params,["draft-slug",true]);
 const before=conditions.length;await mod.exports.getAllPosts();assert.equal(conditions.length,before,"admin list must retain drafts");
 for(const file of ["src/app/page.tsx","src/app/journal/page.tsx"])assert.match(fs.readFileSync(file,"utf8"),/getPublishedPosts\(\)/);
 assert.match(fs.readFileSync("src/app/journal/[slug]/page.tsx","utf8"),/getPublishedPost\(slug\)/);
 console.log("Public list/detail SQL requires published=true; draft lookup is rejected; admin list retains drafts. No database used.");
})().catch(error=>{console.error(error);process.exitCode=1});
