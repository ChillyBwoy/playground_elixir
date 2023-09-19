defmodule Playground.Chalkboard.Shape do
  use Ecto.Schema
  import Ecto.Changeset

  @primary_key {:id, :binary_id, autogenerate: true}
  @foreign_key_type :binary_id
  @derive {Jason.Encoder, only: [:id, :shape_data]}
  schema "shapes" do
    embeds_one :shape_data, Playground.Chalkboard.ShapeData

    belongs_to :canvas, Playground.Chalkboard.Canvas
    belongs_to :user, Playground.Auth.User

    timestamps()
  end

  @doc false
  def changeset(shape, attrs) do
    shape
    |> cast(attrs, [:canvas_id, :user_id])
    |> cast_embed(:shape_data)
    |> validate_required([:shape_data, :canvas_id, :user_id])
  end
end
