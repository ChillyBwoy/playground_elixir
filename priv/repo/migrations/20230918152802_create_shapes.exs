defmodule Playground.Repo.Migrations.CreateShapes do
  use Ecto.Migration

  def change do
    create table(:shapes, primary_key: false) do
      add :id, :binary_id, primary_key: true
      add :shape_data, :jsonb
      add :canvas_id, references(:canvases, on_delete: :delete_all, type: :binary_id)
      add :user_id, references(:users, on_delete: :delete_all, type: :binary_id)

      timestamps()
    end

    create index(:shapes, [:canvas_id])
    create index(:shapes, [:user_id])
  end
end
