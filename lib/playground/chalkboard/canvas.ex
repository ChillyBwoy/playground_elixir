defmodule Playground.Chalkboard.Canvas do
  use Ecto.Schema
  import Ecto.Changeset

  @primary_key {:id, :binary_id, autogenerate: true}
  @foreign_key_type :binary_id
  @derive {Jason.Encoder, only: [:id, :name, :room_id, :shapes]}
  schema "canvases" do
    field :name, :string

    belongs_to :room, Playground.Chat.Room
    has_many :shapes, Playground.Chalkboard.Shape

    timestamps()
  end

  @doc false
  def changeset(canvas, attrs) do
    canvas
    |> cast(attrs, [:name, :room_id])
    |> validate_required([:name, :room_id])
  end
end
