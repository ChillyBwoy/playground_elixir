defmodule Playground.Repo.Migrations.CreateRooms do
  use Ecto.Migration

  def change do
    create table(:rooms, primary_key: false) do
      add :id, :binary_id, primary_key: true
      add :name, :string, null: false
      add :user_id, references(:users, on_delete: :delete_all, type: :binary_id), null: false

      timestamps()
    end

    create index(:rooms, [:user_id])
  end
end
