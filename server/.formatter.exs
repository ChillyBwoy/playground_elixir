[
  import_deps: [:ecto, :ecto_sql, :phoenix, :plug, :socket],
  subdirectories: ["priv/*/migrations"],
  inputs: ["*.{ex,exs}", "{config,lib,test}/**/*.{ex,exs}", "priv/*/seeds.exs"]
]
