# dcu

Deno Check Updates 🦕


```sh
$ deno run --allow-net --allow-read --allow-write https://deno.land/x/dcu@0.1.1/mod.ts --update
```

```
 File: deps.ts (./deps.ts)
==============================================================
 Module Name    Current Version    Latest Version    Updated?
 cliffy         0.25.7             0.25.7            false
 cliffy         0.25.7             0.25.7            false
 std            0.180.0            0.180.0           false
```

## TO-DO
- [x] Add support for (dev_)deps.ts;
- [ ] Add support for import_map.json;
- [ ] Improve the method for discovering dependency mapping files;
- [ ] Add tests;
- [ ] Add docs.