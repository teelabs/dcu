# dcu

Deno Check Updates 🦕

## Examples

#### Checking for new versions on a deps.ts file:

```sh
$ deno run --allow-net --allow-read --allow-write https://deno.land/x/dcu@0.1.2/mod.ts
```

```
 File: deps.ts (./deps.ts)
==============================================================
 Module Name    Current Version    Latest Version    Updated?
 cliffy         0.25.6             0.25.7            false
 cliffy         0.25.6             0.25.7            false
 std            0.179.0            0.180.0           false
```

#### Checking for new versions on a import_map.json file (also updating):

```sh
$ deno run --allow-net --allow-read --allow-write https://deno.land/x/dcu@0.1.2/mod.ts --update
```

```
 File: import_map.json (./import_map.json)
==============================================================
 Module Name    Current Version    Latest Version    Updated?
 fresh          1.1.2              1.1.4             true
 preact         10.11.0            10.13.1           true
 preact         10.11.0            10.13.1           true
 string         5.2.4              5.2.6             true
 signals        1.0.3              1.1.3             true
 core           1.0.1              1.2.3             true
 twind          0.16.17            1.0.7             true
 twind          0.16.17            1.0.7             true
```

## Done

- [x] Add support for (dev_)deps.ts;
- [x] Add support for import_map.json.

## To-Do

- [ ] Improve the method for discovering dependency mapping files;
- [ ] Add tests;
- [ ] Add docs.
