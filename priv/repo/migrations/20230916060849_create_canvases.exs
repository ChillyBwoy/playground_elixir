defmodule Playground.Repo.Migrations.CreateCanvases do
  use Ecto.Migration

  def change do
    create table(:canvases, primary_key: false) do
      add :id, :binary_id, primary_key: true
      add :name, :string
      add :room_id, references(:rooms, on_delete: :delete_all, type: :binary_id), null: false

      timestamps()
    end

    create index(:canvases, [:room_id])
  end
end
