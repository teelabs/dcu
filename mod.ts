import { Command, Row, Table } from "./deps.ts";
import { readMapFiles } from "./src/files/mod.ts";
import { buildModule } from "./src/modules/mod.ts";
import { DenoModule } from "./src/modules/types.ts";

const buildTSModule = async (content: string): Promise<DenoModule[]> => {
  const modules: DenoModule[] = [];

  const entries = content.split("\n");

  for (const entry of entries.filter(Boolean)) {
    if (entry) {
      const module = await buildModule(entry);

      modules.push(module);
    }
  }

  return modules;
};

await new Command()
  .name("dcu - deno check updates 🦕")
  .description(
    "Checks the latest version of mapped libraries and updates them if requested.",
  )
  .version("0.1.1")
  .option("-u, --update [value:boolean]", "Updates the dependecies's maps.", {
    default: false,
    standalone: true,
  })
  .action(async ({ update }) => {
    for (const mapFile of await readMapFiles()) {
      if (mapFile.content) {
        if (mapFile.isTS()) {
          const TSModules = await buildTSModule(mapFile.content);

          for (const TSModule of TSModules) {
            if (update && TSModule.shouldUpdate()) {
              mapFile.content = mapFile.content?.replace(
                TSModule.currentSourceURL,
                TSModule.latestSourceURL,
              );
              TSModule.updated = true;
            }
          }

          if (update) {
            const encoder = new TextEncoder();
            const data = encoder.encode(mapFile.content);
            await Deno.writeFile(mapFile.path, data, { create: false });
          }

          const table = new Table()
            .header([
              "Module Name",
              "Current Version",
              "Latest Version",
              "Updated?",
            ])
            .body(
              TSModules.map((
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
        }
      }
    }
  })
  .parse(Deno.args);
