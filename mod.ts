import { Command, Row, Table } from "./deps.ts";
import { readMapFiles } from "./src/files/mod.ts";
import { JSONImportMap, ReadMapFileResult } from "./src/files/types.ts";
import { buildJSONModule, buildTSModule } from "./src/modules/mod.ts";
import { DenoModule } from "./src/modules/types.ts";

const handleTSModules = async (
  mapFile: ReadMapFileResult,
  update: boolean,
): Promise<DenoModule[]> => {
  const modules: DenoModule[] = [];

  const entries = mapFile.content!.split("\n");

  for (const entry of entries.filter(Boolean)) {
    if (entry) {
      const module = await buildTSModule(entry);

      if (module) {
        if (update && module.shouldUpdate()) {
          mapFile.content = mapFile.content?.replace(
            module.currentSourceURL,
            module.latestSourceURL,
          ) || null;
          module.updated = true;
        }

        modules.push(module);
      }
    }
  }

  return modules;
};

const handleJSONModules = async (
  mapFile: ReadMapFileResult,
  update: boolean,
): Promise<DenoModule[]> => {
  const modules: DenoModule[] = [];

  const { imports = {} } = JSON.parse(mapFile.content!) as JSONImportMap;

  for (const [name, source] of Object.entries(imports)) {
    const module = await buildJSONModule(source);

    if (module) {
      if (update && module.shouldUpdate()) {
        imports[name] = module.latestSourceURL;
        module.updated = true;

        mapFile.content = JSON.stringify({ imports }, null, 2);
      }

      modules.push(module);
    }
  }

  return modules;
};

const handleModules = (
  mapFile: ReadMapFileResult,
  update: boolean,
): Promise<DenoModule[]> => {
  return mapFile.isTS()
    ? handleTSModules(mapFile, update)
    : handleJSONModules(mapFile, update);
};

const displayResultTable = (
  mapFile: ReadMapFileResult,
  modules: DenoModule[],
) => {
  const table = new Table()
    .header([
      "Module Name",
      "Current Version",
      "Latest Version",
      "Updated?",
    ])
    .body(
      modules.map((
        { name, currentVersion, latestVersion, updated },
      ) =>
        Row.from([
          name,
          currentVersion,
          latestVersion,
          updated as unknown as string,
        ])
      ),
    )
    .padding(4)
    .indent(1);

  console.log(`\n\n File: ${mapFile.name} (${mapFile.path})`);
  console.log("=".repeat(table.toString().indexOf("\n") + 1));

  table.render();
};

await new Command()
  .name("dcu - deno check updates 🦕")
  .description(
    "Checks the latest version of mapped libraries and updates them if requested.",
  )
  .version("0.1.2")
  .option("-u, --update [value:boolean]", "Updates the dependecies's maps.", {
    default: false,
    standalone: true,
  })
  .action(async ({ update }) => {
    for (const mapFile of await readMapFiles()) {
      if (mapFile.content) {
        const modules = await handleModules(mapFile, update);

        if (update) {
          const encoder = new TextEncoder();
          const data = encoder.encode(mapFile.content);
          await Deno.writeFile(mapFile.path, data, { create: false });
        }

        displayResultTable(mapFile, modules);
      }
    }
  })
  .parse(Deno.args);
